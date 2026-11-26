const transformerBase = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/';
const visionModel = 'onnx-community/TinyCLIP-ViT-8M-16-Text-3M-YFCC15M-ONNX';
let visionPipeline;

function getFoodClassifier(report) {
  if (!visionPipeline) {
    visionPipeline = (async () => {
      const {pipeline, env, RawImage} = await import(`${transformerBase}transformers.min.js`);
      env.allowLocalModels = false;
      env.useBrowserCache = typeof caches !== 'undefined' && location.protocol !== 'file:';
      env.backends.onnx.wasm.numThreads = 1;
      env.backends.onnx.wasm.wasmPaths = transformerBase;
      const classify = await pipeline('zero-shot-image-classification', visionModel, {
        device: 'wasm', dtype: 'q8',
        progress_callback: event => {
          if (event.status === 'progress' && event.file?.endsWith('.onnx') && event.total > 0) {
            report(`Descargando el modelo de visión… ${Math.round(event.progress)} %`);
          }
        },
      });
      return {classify, RawImage};
    })().catch(error => {
      visionPipeline = undefined;
      throw error;
    });
  }
  return visionPipeline;
}

async function analyzeFoodPhoto(blob, foodCandidates, report) {
  report('Preparando el modelo de visión…');
  const {classify, RawImage} = await getFoodClassifier(report);
  report('Buscando alimentos en la imagen…');
  const rejected = ['an empty dinner plate', 'an ordinary object with no food', 'food that is not in the list'];
  const candidateLabels = [...foodCandidates.map(food => food.visual), ...rejected];
  const bitmap = await createImageBitmap(blob);
  const size = 224;
  const canvas = typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(size, size) : document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d', {willReadFrequently: true});
  const tiles = [[0, 0, 1, 1], [0, 0, .67, .67], [.33, 0, .67, .67], [0, .33, .67, .67], [.33, .33, .67, .67]];
  const samples = [];
  try {
    for (const [x, y, width, height] of tiles) {
      context.drawImage(bitmap, bitmap.width * x, bitmap.height * y, bitmap.width * width, bitmap.height * height, 0, 0, size, size);
      const pixels = context.getImageData(0, 0, size, size).data;
      samples.push(new RawImage(pixels, size, size, 4));
    }
  } finally {
    bitmap.close();
  }
  const matches = new Map();
  const results = await classify(samples, candidateLabels, {hypothesis_template: 'a photo of {}'});
  for (const [index, result] of results.entries()) {
    if (!result.length || rejected.includes(result[0].label)) continue;
    const candidates = index === 0 ? result.slice(0, 3) : result.slice(0, 1);
    for (const match of candidates) {
      const food = foodCandidates.find(item => item.visual === match.label);
      if (!food || match.score < .10) continue;
      matches.set(food.id, Math.max(matches.get(food.id) ?? 0, match.score));
    }
  }
  return [...matches.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
}

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
  self.onmessage = async ({data: {id, blob, candidates}}) => {
    try {
      const result = await analyzeFoodPhoto(blob, candidates, progress => self.postMessage({id, progress}));
      self.postMessage({id, result});
    } catch (error) {
      self.postMessage({id, error: String(error)});
    }
  };
}
