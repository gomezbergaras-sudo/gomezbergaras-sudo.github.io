// Atlas cells follow the approved photos from left to right, top to bottom.
const dietPhotoSheets = {
  proteinas: {columns: 4, rows: 4, ids: [
    'arepa', 'huevo', 'huevo-cocido', 'pollo',
    'res', 'pavo', 'cerdo', 'salmon',
    'atun', 'caraotas', 'lentejas', 'garbanzos',
    'tofu', 'queso', 'yogur', 'yogur-soya',
  ]},
  bases: {columns: 4, rows: 4, ids: [
    'avena', 'arroz', 'quinoa', 'batata',
    'platano', 'yuca', 'pan', 'pasta',
    'aguacate', 'tomate', 'pimenton', 'repollo',
    'pepino', 'espinaca', 'calabacin', 'cebolla',
  ]},
  frescos: {columns: 4, rows: 4, ids: [
    'champinones', 'brocoli', 'zanahoria', 'lechuga',
    'rabanos', 'hojas', 'fresas', 'cambur',
    'manzana', 'papaya', 'naranja', 'pina',
    'pera', 'almendras', 'nueces', 'chia',
  ]},
  extras: {columns: 4, rows: 4, ids: [
    'semillas', 'salsa-tomate', 'salsa-pimenton', 'aceite',
    'limon', 'tortilla-maiz', 'auyama', 'papa',
    'caldo', 'bebida-soya', 'cacao', 'mango',
    'berenjena', 'maiz', 'frijol-rojo', 'camaron',
  ]},
  tortilla: {columns: 1, rows: 1, ids: ['tortilla-trigo']},
  menu1: {columns: 2, rows: 3},
  menu2: {columns: 2, rows: 3},
  berenjena: {columns: 1, rows: 1},
};

const dietIngredientPhotos = new Map(Object.entries(dietPhotoSheets).flatMap(([sheet, {ids = []}]) =>
  ids.map((id, cell) => [id, {sheet, cell}])));

function dietPhotoTile({sheet, cell}) {
  const {columns, rows} = dietPhotoSheets[sheet];
  const x = columns === 1 ? 0 : (cell % columns) * 100 / (columns - 1);
  const y = rows === 1 ? 0 : Math.floor(cell / columns) * 100 / (rows - 1);
  return `<span class="diet-photo-tile" style="background-image:url(assets/comidas-${sheet}.jpg);background-size:${columns * 100}% ${rows * 100}%;background-position:${x}% ${y}%"></span>`;
}

function mealPhoto(recipe, className) {
  if (recipe.platedPhoto) {
    return `<span class="${className} diet-plated-photo" role="img" aria-label="${escapeHtml(recipe.name)}">${dietPhotoTile(recipe.platedPhoto)}</span>`;
  }
  const count = recipe.ingredientIds.length;
  const columns = count <= 4 ? 2 : 3;
  const rows = Math.ceil(count / columns);
  const ingredients = recipe.ingredientIds.map(id => dietIngredients[id].name).join(', ');
  return `<span class="${className} diet-photo-set" role="img" aria-label="Fotos de ${escapeHtml(ingredients)}" style="--photo-columns:${columns};--photo-rows:${rows}">
    ${recipe.ingredientIds.map(id => `<span class="diet-photo-frame" data-ingredient="${id}">${dietPhotoTile(dietIngredientPhotos.get(id))}</span>`).join('')}
  </span>`;
}
