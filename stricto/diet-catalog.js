const dietPortionGoals = {
  general: 'Porción de referencia',
  gain: goalOptions.gain.name,
  lose: goalOptions.lose.name,
  recomp: goalOptions.recomp.name,
};

// Grams per serving: general, gain, lose, recomp. Weights refer to ingredients as listed.
const dietPortions = {
  carne: [115, 145, 105, 140],
  legumbre: [125, 155, 105, 145],
  grano: [135, 180, 95, 140],
  vegetal: [75, 75, 75, 75],
  fruta: [100, 125, 100, 110],
  semilla: [15, 25, 10, 15],
};

// Approximate kcal per 100 g for the food as listed, based on generic USDA FoodData Central entries.
const dietEnergyDensity = {
  ...Object.fromEntries(foods.map(({id, kcal}) => [id, kcal])),
  huevo: 143, 'huevo-cocido': 155, res: 204, pavo: 147, cerdo: 143, queso: 299,
  yogur: 61, 'yogur-soya': 66, yuca: 125, pan: 252, pasta: 149, pimenton: 31,
  repollo: 25, espinaca: 23, calabacin: 17, cebolla: 40, champinones: 22, rabanos: 16,
  hojas: 20, fresas: 32, cambur: 89, papaya: 43, naranja: 47, pina: 50, pera: 57,
  nueces: 654, chia: 486, semillas: 559, 'salsa-tomate': 29, 'salsa-pimenton': 31,
  limon: 22, 'tortilla-maiz': 218, 'tortilla-trigo': 310, auyama: 20, papa: 87, caldo: 6,
  'bebida-soya': 33, cacao: 228, mango: 60, berenjena: 25, maiz: 96, 'frijol-rojo': 127, camaron: 99,
};

const dietIngredients = Object.fromEntries([
  ['arepa', 'arepa de maíz cocida', [80, 105, 65, 85]],
  ['huevo', 'huevo sin cáscara', [100, 150, 100, 125], 'vegetarian'],
  ['huevo-cocido', 'huevo cocido sin cáscara', [60, 100, 50, 85], 'vegetarian'],
  ['pollo', 'pechuga de pollo cocida', 'carne', 'mixed'],
  ['res', 'carne de res magra cocida', 'carne', 'mixed'],
  ['pavo', 'pechuga de pavo cocida', 'carne', 'mixed'],
  ['cerdo', 'lomo de cerdo cocido', 'carne', 'mixed'],
  ['salmon', 'salmón cocido', 'carne', 'mixed'],
  ['atun', 'atún en agua escurrido', 'carne', 'mixed'],
  ['caraotas', 'caraotas negras cocidas', 'legumbre'],
  ['lentejas', 'lentejas cocidas', 'legumbre'],
  ['garbanzos', 'garbanzos cocidos', 'legumbre'],
  ['tofu', 'tofu firme', 'legumbre'],
  ['queso', 'queso blanco fresco', [40, 60, 35, 45], 'vegetarian'],
  ['yogur', 'yogur natural', [150, 200, 145, 185], 'vegetarian'],
  ['yogur-soya', 'yogur natural de soya', [150, 200, 145, 185]],
  ['avena', 'avena en hojuelas (seca)', [35, 55, 30, 45]],
  ['arroz', 'arroz cocido', 'grano'],
  ['quinoa', 'quinoa cocida', 'grano'],
  ['batata', 'batata asada', 'grano'],
  ['platano', 'plátano maduro cocido', 'grano'],
  ['yuca', 'yuca cocida', 'grano'],
  ['pan', 'pan integral', [55, 75, 45, 55]],
  ['pasta', 'pasta integral cocida', 'grano'],
  ['aguacate', 'aguacate', [45, 65, 35, 45]],
  ['tomate', 'tomate', 'vegetal'],
  ['pimenton', 'pimentón asado', 'vegetal'],
  ['repollo', 'repollo', 'vegetal'],
  ['pepino', 'pepino', 'vegetal'],
  ['espinaca', 'espinaca', 'vegetal'],
  ['calabacin', 'calabacín', 'vegetal'],
  ['cebolla', 'cebolla', [30, 30, 30, 30]],
  ['champinones', 'champiñones', 'vegetal'],
  ['brocoli', 'brócoli cocido', 'vegetal'],
  ['zanahoria', 'zanahoria', 'vegetal'],
  ['lechuga', 'lechuga romana', 'vegetal'],
  ['rabanos', 'rábanos', 'vegetal'],
  ['hojas', 'hojas verdes', 'vegetal'],
  ['fresas', 'fresas', 'fruta'],
  ['cambur', 'cambur', 'fruta'],
  ['manzana', 'manzana', 'fruta'],
  ['papaya', 'papaya', 'fruta'],
  ['naranja', 'naranja', 'fruta'],
  ['pina', 'piña', 'fruta'],
  ['pera', 'pera', 'fruta'],
  ['almendras', 'almendras', 'semilla'],
  ['nueces', 'nueces', 'semilla'],
  ['chia', 'semillas de chía', 'semilla'],
  ['semillas', 'semillas de auyama', 'semilla'],
  ['salsa-tomate', 'salsa de tomate', [65, 80, 60, 65]],
  ['salsa-pimenton', 'puré de pimentón asado', [65, 80, 60, 65]],
  ['aceite', 'aceite de oliva', [8, 13, 6, 8]],
  ['limon', 'jugo de limón', [12, 12, 12, 12]],
  ['tortilla-maiz', 'tortilla de maíz', [65, 90, 55, 75]],
  ['tortilla-trigo', 'tortilla integral de trigo', [65, 90, 55, 75]],
  ['auyama', 'auyama cocida', [140, 180, 140, 150]],
  ['papa', 'papa cocida', 'grano'],
  ['caldo', 'caldo de verduras', [180, 200, 180, 190]],
  ['bebida-soya', 'bebida de soya sin azúcar', [200, 250, 175, 220]],
  ['cacao', 'cacao en polvo sin azúcar', [7, 10, 6, 8]],
  ['mango', 'mango', 'fruta'],
  ['berenjena', 'berenjena', [150, 150, 150, 150]],
  ['maiz', 'maíz tierno cocido', [80, 110, 65, 90]],
  ['frijol-rojo', 'frijoles rojos cocidos', 'legumbre'],
  ['camaron', 'camarones cocidos y pelados', 'carne', 'mixed'],
].map(([id, name, grams, diet = 'vegan']) => [id, {
  name, grams: Array.isArray(grams) ? grams : dietPortions[grams], diet,
}]));

const catalogProteins = ['pollo', 'res', 'pavo', 'cerdo', 'salmon', 'atun', 'garbanzos', 'tofu', 'lentejas', 'caraotas'];

const dietTitleNames = {
  'huevo-cocido': 'huevo', pollo: 'pollo', res: 'res', pavo: 'pavo', cerdo: 'cerdo',
  salmon: 'salmón', atun: 'atún', caraotas: 'caraotas', lentejas: 'lentejas', garbanzos: 'garbanzos',
  tofu: 'tofu', queso: 'queso blanco', arroz: 'arroz', quinoa: 'quinoa', batata: 'batata',
  platano: 'plátano maduro', yuca: 'yuca', brocoli: 'brócoli', 'yogur-soya': 'yogur de soya',
};

const dietFamilies = {
  arepas: {
    label: 'Arepas',
    groups: [
      ['huevo-cocido', 'res', 'pavo', 'pollo', 'caraotas', 'atun', 'queso', 'tofu', 'garbanzos', 'lentejas'],
      ['aguacate', 'tomate', 'pimenton', 'repollo'],
      ['pepino', 'papaya', 'naranja', 'pina'],
    ],
    ingredients: ids => ['arepa', ...ids],
    title: (filling, topping, side) => `Arepa de ${filling} y ${topping} con ${side}`,
    method: (filling, topping, side) => `Calienta la arepa y ábrela por un lado. Rellena con ${filling} y ${topping}. Sirve con ${side} al lado.`,
  },
  huevos: {
    label: 'Huevos',
    groups: [
      ['batata', 'yuca', 'platano', 'pan'],
      ['espinaca', 'tomate', 'pimenton', 'calabacin', 'cebolla', 'champinones'],
      ['aguacate', 'queso', 'pepino'],
    ],
    ingredients: ids => ['huevo', ...ids],
    title: (base, vegetable, side) => `Huevos revueltos con ${vegetable}, ${base} y ${side}`,
    method: (base, vegetable, side) => `Pica y saltea el ingrediente vegetal (${vegetable}). Agrega el huevo batido y remueve hasta que cuaje por completo. Sirve con ${base} y ${side}.`,
  },
  bowls: {
    label: 'Bowls',
    groups: [
      catalogProteins,
      ['arroz', 'quinoa', 'batata', 'platano', 'yuca'],
      ['brocoli', 'zanahoria', 'espinaca', 'pepino', 'pimenton'],
    ],
    ingredients: ids => ids,
    title: (protein, base, vegetable) => `Bowl de ${protein}, ${base} y ${vegetable}`,
    method: (protein, base, vegetable) => `Pon ${base} en un bowl. Agrega ${protein} en trozos o bien escurrido, y termina con ${vegetable}.`,
  },
  avenas: {
    label: 'Avena y yogur',
    groups: [
      ['yogur', 'yogur-soya'],
      ['fresas', 'cambur', 'manzana', 'papaya', 'pina', 'pera'],
      ['almendras', 'nueces', 'chia', 'semillas'],
    ],
    ingredients: ids => ['avena', ...ids],
    title: (yogurt, fruit, topping) => `Avena con ${yogurt}, ${fruit} y ${topping}`,
    method: (yogurt, fruit, topping) => `Mezcla las hojuelas de avena con ${yogurt}. Agrega ${fruit} en trozos y termina con ${topping}.`,
  },
  pastas: {
    label: 'Pastas',
    groups: [
      catalogProteins.filter(id => id !== 'salmon'),
      ['brocoli', 'espinaca', 'calabacin', 'champinones'],
      ['salsa-tomate', 'aceite', 'salsa-pimenton'],
    ],
    ingredients: ids => ['pasta', ...ids],
    title: (protein, vegetable, sauce) => `Pasta integral con ${protein}, ${vegetable} y ${sauce}`,
    method: (protein, vegetable, sauce) => `Calienta la pasta cocida con ${vegetable} y ${protein}. Incorpora ${sauce} al final y mezcla antes de servir.`,
  },
  ensaladas: {
    label: 'Ensaladas',
    groups: [
      catalogProteins.filter(id => id !== 'caraotas'),
      ['lechuga', 'espinaca', 'repollo', 'pepino', 'tomate'],
      ['aguacate', 'zanahoria', 'quinoa', 'pimenton'],
    ],
    ingredients: ids => [...ids, 'limon'],
    title: (protein, base, topping) => `Ensalada de ${base} con ${protein} y ${topping}`,
    method: (protein, base, topping) => `Prepara la base con ${base} y agrega ${protein}. Incorpora ${topping}, aliña con el jugo de limón y mezcla justo antes de servir.`,
  },
};

const dietFamilyLabels = {
  sopas: 'Sopas y cremas', tacos: 'Tacos', wraps: 'Wraps', tostadas: 'Tostadas', batidos: 'Batidos',
  guisos: 'Guisos', parrilla: 'Parrilla', horno: 'Al horno', sandwiches: 'Sándwiches', postres: 'Postres',
  ...Object.fromEntries(Object.entries(dietFamilies).map(([id, family]) => [id, family.label])),
};

const featuredDietMeals = [
  ['crema-auyama', 'sopas', 'Crema de auyama y zanahoria', ['auyama', 'zanahoria', 'caldo', 'semillas'],
    'Cocina la zanahoria en el caldo hasta que esté tierna. Añade la auyama cocida, licúa y sirve con las semillas de auyama por encima.', 'menu1', 0],
  ['tacos-camaron', 'tacos', 'Tacos de camarones, repollo y aguacate', ['tortilla-maiz', 'camaron', 'repollo', 'aguacate'],
    'Calienta las tortillas. Rellena con los camarones cocidos, el repollo finamente cortado y el aguacate en láminas.', 'menu1', 1],
  ['wrap-pavo', 'wraps', 'Wrap integral de pavo, lechuga y tomate', ['tortilla-trigo', 'pavo', 'lechuga', 'tomate'],
    'Entibia la tortilla. Coloca la lechuga, el pavo cocido y el tomate en el centro, dobla los bordes y enrolla.', 'menu1', 2],
  ['tostada-huevo', 'tostadas', 'Tostada integral de aguacate, huevo y tomate', ['pan', 'aguacate', 'huevo-cocido', 'tomate'],
    'Tuesta el pan integral. Reparte las láminas de aguacate, huevo cocido y tomate sobre el pan.', 'menu1', 3],
  ['batido-cacao', 'batidos', 'Batido de cambur, cacao y avena', ['bebida-soya', 'cambur', 'cacao', 'avena'],
    'Licúa la bebida de soya, el cambur, la avena en hojuelas y el cacao hasta obtener una mezcla homogénea.', 'menu1', 4],
  ['guiso-res', 'guisos', 'Guiso de res con papa y zanahoria', ['res', 'papa', 'zanahoria', 'caldo'],
    'Cocina la zanahoria cortada en el caldo. Añade la res y la papa ya cocidas, en cubos, y calienta todo junto hasta servir.', 'menu1', 5],
  ['brochetas-cerdo', 'parrilla', 'Brochetas de cerdo, pimentón y cebolla', ['cerdo', 'pimenton', 'cebolla'],
    'Corta el lomo cocido, el pimentón y la cebolla en piezas similares. Ensarta alternando los ingredientes y dora las brochetas en una plancha caliente.', 'menu2', 0],
  ['berenjena-lentejas', 'horno', 'Berenjena rellena de lentejas y queso blanco', ['berenjena', 'lentejas', 'salsa-tomate', 'queso'],
    'Corta la berenjena a lo largo y hornéala hasta ablandarla. Rellena con lentejas y salsa de tomate, agrega el queso desmenuzado y hornea unos minutos más.', 'berenjena', 0],
  ['crema-maiz', 'sopas', 'Crema de maíz y papa', ['maiz', 'papa', 'caldo', 'aceite'],
    'Calienta el caldo con el maíz y la papa cocida. Licúa y termina con un hilo de aceite de oliva.', 'menu2', 2],
  ['sandwich-atun', 'sandwiches', 'Sándwich integral de atún, pepino y lechuga', ['pan', 'atun', 'pepino', 'lechuga'],
    'Escurre el atún y repártelo sobre el pan integral. Agrega el pepino cortado y la lechuga; cierra el sándwich.', 'menu2', 3],
  ['chili-vegetal', 'guisos', 'Chili de frijoles rojos, maíz y pimentón', ['frijol-rojo', 'maiz', 'tomate', 'pimenton'],
    'Cocina el tomate picado con el pimentón. Incorpora el maíz y los frijoles ya cocidos y reduce a fuego suave hasta espesar.', 'menu2', 4],
  ['vasito-mango', 'postres', 'Vasito de mango, yogur de soya y chía', ['mango', 'yogur-soya', 'chia'],
    'Mezcla las semillas de chía con el yogur de soya y alterna capas de yogur y mango en cubos. Refrigera antes de servir.', 'menu2', 5],
].map(([id, family, name, ingredientIds, method, sheet, cell]) =>
  makeDietRecipe({id, family, name, ingredientIds, method, platedPhoto: {sheet, cell}}));

function dietSearchWords(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]+/g) ?? [];
}

function makeDietRecipe(recipe) {
  const {family, name, ingredientIds} = recipe;
  return {
    ...recipe,
    animalProducts: ingredientIds.some(id => dietIngredients[id].diet !== 'vegan'),
    meat: ingredientIds.some(id => dietIngredients[id].diet === 'mixed'),
    searchWords: new Set(dietSearchWords(`${dietFamilyLabels[family]} ${name} ${ingredientIds.map(id => dietIngredients[id].name).join(' ')}`)),
  };
}

function catalogMealsFor(familyId, family) {
  const combinations = family.groups.reduce((prefixes, group) =>
    group.flatMap(id => prefixes.map(prefix => [...prefix, id])), [[]]);
  return combinations.map(ids => {
    const ingredientIds = family.ingredients(ids);
    const names = ids.map(id => dietIngredients[id].name);
    return makeDietRecipe({
      id: [familyId, ...ids].join(':'), family: familyId,
      name: family.title(...ids.map((id, index) => dietTitleNames[id] ?? names[index])),
      ingredientIds, method: family.method(...names),
    });
  });
}

const dietCatalogGroups = Object.entries(dietFamilies).map(([id, family]) => catalogMealsFor(id, family));
const dietCatalog = [
  ...featuredDietMeals,
  ...Array.from({length: Math.max(...dietCatalogGroups.map(group => group.length))},
    (_, index) => dietCatalogGroups.map(group => group[index]).filter(Boolean)).flat(),
];
const dietCatalogById = new Map(dietCatalog.map(recipe => [recipe.id, recipe]));

function dietRecipeMatchesPreference(recipe, preference) {
  return (preference !== 'meat' || recipe.meat)
    && (preference !== 'vegan' || !recipe.animalProducts)
    && (preference !== 'vegetarian' || !recipe.meat);
}

function searchDietCatalog({query, family, preference}) {
  const terms = dietSearchWords(query).filter(word => !['de', 'con', 'y', 'el', 'la'].includes(word));
  return dietCatalog.filter(recipe =>
    (family === 'all' || recipe.family === family)
    && dietRecipeMatchesPreference(recipe, preference)
    && terms.every(term => recipe.searchWords.has(term) || (term.length >= 4 && [...recipe.searchWords].some(word =>
      word.startsWith(term) || (term.endsWith('s') && word === term.slice(0, -1))))));
}

function portionIngredients(recipe, goal, scale = 1) {
  const portionIndex = Object.keys(dietPortionGoals).indexOf(goal);
  return recipe.ingredientIds.map(id => {
    const ingredient = dietIngredients[id];
    const weight = ingredient.grams[Math.max(portionIndex, 0)] * scale;
    const grams = Math.round(weight);
    return {name: ingredient.name, grams, kcal: grams * dietEnergyDensity[id] / 100};
  });
}

function recipeEnergy(recipe, goal, scale) {
  return Math.round(portionIngredients(recipe, goal, scale).reduce((total, item) => total + item.kcal, 0));
}
