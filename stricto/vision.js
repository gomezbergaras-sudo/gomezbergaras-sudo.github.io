if (typeof importScripts === 'function') importScripts('vision-profile.js');

const transformerBase = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/';
const tileSize = 224;
const scanAreas = {
  full: [0, 0, 1, 1],
  left: [0, 0, .56, 1],
  right: [.44, 0, .56, 1],
  top: [0, 0, 1, .56],
  bottom: [0, .44, 1, .56],
};
let visionPipeline;

function getFoodClassifier(report) {
  if (!visionPipeline) {
    visionPipeline = (async () => {
      const {pipeline, env, RawImage} = await import(`${transformerBase}transformers.min.js`);
      env.allowLocalModels = false;
      env.useBrowserCache = typeof caches !== 'undefined' && location.protocol !== 'file:';
      env.backends.onnx.wasm.numThreads = 1;
      env.backends.onnx.wasm.wasmPaths = transformerBase;
      const classifier = await pipeline('zero-shot-image-classification', strictoVisionProfile.model, {
        revision: strictoVisionProfile.revision,
        device: 'wasm',
        dtype: 'q8',
        progress_callback: event => {
          if (event.status === 'progress' && event.file?.endsWith('.onnx') && event.total > 0) {
            report(`Descargando el modelo de visión… ${Math.round(event.progress)} %`);
          }
        },
      });
      // The combined model requires text input even when only the image embeddings are used.
      const tokens = classifier.tokenizer(['a photo'], {padding: true, truncation: true});
      return {classifier, RawImage, tokens};
    })().catch(error => {
      visionPipeline = undefined;
      throw error;
    });
  }
  return visionPipeline;
}

function normalizeVisionVector(values) {
  const length = Math.hypot(...values) || 1;
  return Float32Array.from(values, value => value / length);
}

function decodeVisionVector(encoded) {
  const bytes = Uint8Array.from(atob(encoded), char => char.charCodeAt(0));
  return normalizeVisionVector(new Int8Array(bytes.buffer));
}

const visionReferences = {
  classes: strictoVisionProfile.classes.map(({id, texts, center}) => ({
    id,
    texts: texts.map(decodeVisionVector),
    center: center ? decodeVisionVector(center) : null,
  })),
  background: strictoVisionProfile.background.map(decodeVisionVector),
  emptyPlates: strictoVisionProfile.emptyPlates.map(decodeVisionVector),
};

function visionSimilarity(first, second) {
  let similarity = 0;
  for (let i = 0; i < first.length; i++) similarity += first[i] * second[i];
  return similarity;
}

function resemblesEmptyPlate(views, classes) {
  const foodReferences = classes.filter(food => food.center).map(food => food.center);
  if (!foodReferences.length) return false;
  // Require agreement in the whole image and the center before ruling out a plate.
  return views.length === 2 && views.every(vector => {
    const plateScore = Math.max(...visionReferences.emptyPlates.map(plate => visionSimilarity(vector, plate)));
    if (plateScore < .72) return false;
    const foodScore = Math.max(...foodReferences.map(food => visionSimilarity(vector, food)));
    return plateScore - foodScore >= .06;
  });
}

function selectFoodMatches(features, candidateIds) {
  const rules = strictoVisionProfile.options;
  const classes = visionReferences.classes.filter(food => candidateIds.has(food.id));
  if (!classes.length || !features.length || resemblesEmptyPlate(features.slice(0, 2), classes)) return [];

  const views = features.map(vector => {
    const negative = Math.max(...visionReferences.background.map(reference => visionSimilarity(vector, reference)));
    const candidates = classes.map(({id, texts, center}) => {
      const scores = texts.map(text => visionSimilarity(vector, text));
      const lexical = Math.max(...scores) * .65 + .35 * scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return {id, lexical, appearance: center ? visionSimilarity(vector, center) : null};
    });
    const appearances = candidates.map(food => food.appearance).filter(score => score !== null).sort((a, b) => a - b);
    const midpoint = appearances[Math.floor(appearances.length / 2)] ?? 0;
    const ranked = candidates.map(({id, lexical, appearance}) => ({
      id,
      score: lexical + rules.weight * (appearance === null ? 0 : appearance - midpoint),
    })).sort((a, b) => b.score - a.score);
    return {negative, ranked};
  });

  const [overview, ...crops] = views;
  const overviewGap = overview.ranked[0].score - overview.negative;
  const evidence = new Map();
  let positiveCrops = 0;
  for (const {negative, ranked: [first, second]} of crops) {
    const contrast = first.score - negative;
    if (contrast < rules.cropGate) continue;
    positiveCrops++;
    const crop = evidence.get(first.id) ?? {hits: 0, margin: -1, contrast: -1};
    crop.hits++;
    crop.margin = Math.max(crop.margin, Math.min(contrast, first.score - (second?.score ?? negative)));
    crop.contrast = Math.max(crop.contrast, contrast);
    evidence.set(first.id, crop);
  }
  if (overviewGap < rules.reject && positiveCrops < rules.recovery) return [];

  const matches = overview.ranked.flatMap((food, rank) => {
    const crop = evidence.get(food.id);
    const primary = rank === 0 && overviewGap >= rules.fullGate && (crop?.hits >= 2 || overviewGap >= .018);
    if (!primary && (!crop || (crop.hits < rules.repeat && crop.margin < rules.singleCrop))) return [];
    return [{
      id: food.id,
      primary,
      score: Math.max(food.score - overview.negative, crop?.contrast ?? -1) + Math.min(crop?.hits ?? 0, 5) * .005,
      margin: crop?.margin ?? 0,
    }];
  }).sort((a, b) => Number(b.primary) - Number(a.primary) || b.score - a.score);

  const highest = Math.max(...matches.map(food => food.score));
  return matches.filter((food, index) => index === 0 || food.margin >= rules.strongCrop || food.score >= highest - rules.window)
    .slice(0, rules.cap).map(food => food.id);
}

async function decodeFoodPhoto(blob) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(blob);
    } catch (error) {
      if (typeof document === 'undefined') throw error;
    }
  }
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function makeVisionCanvas(width, height, options) {
  const canvas = typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(width, height) : document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', options);
  context.imageSmoothingQuality = 'high';
  return context;
}

function boundVisionPhoto(image, area) {
  const width = image.naturalWidth ?? image.width;
  const height = image.naturalHeight ?? image.height;
  const region = scanAreas[area] ?? scanAreas.full;
  const box = getVisionCropBox(width, height, region);
  const scale = Math.min(1, 1100 / Math.max(box.width, box.height));
  if (scale === 1 && region === scanAreas.full) return image;
  const context = makeVisionCanvas(Math.max(1, Math.round(box.width * scale)), Math.max(1, Math.round(box.height * scale)));
  context.drawImage(image, box.left, box.top, box.width, box.height, 0, 0, context.canvas.width, context.canvas.height);
  return context.canvas;
}

function getVisionCropBox(width, height, [x, y, w, h]) {
  const left = Math.floor(x * width);
  const top = Math.floor(y * height);
  return {
    left, top,
    width: Math.max(1, Math.min(width - left, Math.round(w * width))),
    height: Math.max(1, Math.min(height - top, Math.round(h * height))),
  };
}

function makeFoodCrop(image, context, RawImage, tile) {
  const {left, top, width: cropWidth, height: cropHeight} = getVisionCropBox(
    image.naturalWidth ?? image.width, image.naturalHeight ?? image.height, tile);
  const scale = tileSize / Math.max(cropWidth, cropHeight);
  const scaledWidth = Math.max(1, Math.round(cropWidth * scale));
  const scaledHeight = Math.max(1, Math.round(cropHeight * scale));
  context.fillStyle = '#e7e3dd';
  context.fillRect(0, 0, tileSize, tileSize);
  context.drawImage(image, left, top, cropWidth, cropHeight,
    Math.floor((tileSize - scaledWidth) / 2), Math.floor((tileSize - scaledHeight) / 2), scaledWidth, scaledHeight);
  const pixels = context.getImageData(0, 0, tileSize, tileSize).data;
  return new RawImage(pixels, tileSize, tileSize, 4);
}

async function extractFoodFeatures(blob, report, area = 'full') {
  report('Abriendo la foto…');
  const photo = await decodeFoodPhoto(blob).catch(cause => {
    const error = new Error('El navegador no pudo abrir el archivo de imagen.', {cause});
    error.name = 'UnreadableFoodPhoto';
    throw error;
  });
  try {
    const image = boundVisionPhoto(photo, area);
    if (image !== photo) photo.close?.();
    report('Preparando el modelo de visión…');
    const {classifier, RawImage, tokens} = await getFoodClassifier(report);
    const context = makeVisionCanvas(tileSize, tileSize, {willReadFrequently: true});
    const features = [];
    const crops = strictoVisionProfile.patches;
    const batchSize = 3;
    for (let i = 0; i < crops.length; i += batchSize) {
      report(`Buscando alimentos en la imagen… ${Math.round(i / crops.length * 100)} %`);
      const samples = crops.slice(i, i + batchSize).map(tile => makeFoodCrop(image, context, RawImage, tile));
      const {pixel_values} = await classifier.processor(samples);
      const {image_embeds} = await classifier.model({...tokens, pixel_values});
      for (const vector of image_embeds) features.push(normalizeVisionVector(vector.data));
    }
    return features;
  } finally {
    photo.close?.();
  }
}

async function analyzeFoodPhoto(blob, candidateIds, report, area) {
  return selectFoodMatches(await extractFoodFeatures(blob, report, area), new Set(candidateIds));
}

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
  self.onmessage = async ({data: {id, blob, candidates, area}}) => {
    try {
      const result = await analyzeFoodPhoto(blob, candidates, progress => self.postMessage({id, progress}), area);
      self.postMessage({id, result});
    } catch (error) {
      self.postMessage({id, error: {name: error?.name, message: String(error)}});
    }
  };
}
