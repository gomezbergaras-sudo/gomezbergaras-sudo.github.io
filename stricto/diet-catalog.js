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
].map(([id, name, grams, diet = 'vegan']) => [id, {
  name, grams: Array.isArray(grams) ? grams : dietPortions[grams], diet,
}]));

const catalogProteins = ['pollo', 'res', 'pavo', 'cerdo', 'salmon', 'atun', 'garbanzos', 'tofu', 'lentejas', 'caraotas'];

const dietFamilies = {
  arepas: {
    label: 'Arepas',
    photo: 'dieta-arepa-huevo.jpg',
    alt: 'Arepa de maíz rellena de huevo, aguacate y tomate',
    groups: [
      ['huevo-cocido', 'res', 'pavo', 'pollo', 'caraotas', 'atun', 'queso', 'tofu', 'garbanzos', 'lentejas'],
      ['aguacate', 'tomate', 'pimenton', 'repollo'],
      ['pepino', 'papaya', 'naranja', 'pina'],
    ],
    ingredients: ids => ['arepa', ...ids],
    title: (filling, topping, side) => `Arepa con ${filling} y ${topping}, acompañada de ${side}`,
    method: (filling, topping, side) => `Calienta la arepa y ábrela por un lado. Rellena con ${filling} y ${topping}. Sirve con ${side} al lado.`,
  },
  huevos: {
    label: 'Huevos',
    photo: 'dieta-huevos.jpg',
    alt: 'Huevos revueltos con batata, espinaca y aguacate',
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
    photo: 'bowl-stricto.jpg',
    alt: 'Bowl de pollo, arroz y vegetales',
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
    photo: 'dieta-avena.jpg',
    alt: 'Yogur con avena, fresas y cambur',
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
    photo: 'dieta-pasta.jpg',
    alt: 'Pasta integral con pollo, brócoli y salsa de tomate',
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
    photo: 'dieta-ensalada.jpg',
    alt: 'Ensalada de lechuga romana, garbanzos y aguacate',
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

function dietSearchWords(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]+/g) ?? [];
}

function catalogMealsFor(familyId, family) {
  const combinations = family.groups.reduce((prefixes, group) =>
    group.flatMap(id => prefixes.map(prefix => [...prefix, id])), [[]]);
  return combinations.map(ids => {
    const ingredientIds = family.ingredients(ids);
    const names = ids.map(id => dietIngredients[id].name);
    const name = family.title(...names);
    return {
      id: [familyId, ...ids].join(':'), family: familyId, name, ingredientIds,
      photo: family.photo, alt: family.alt, referencePhoto: true, method: family.method(...names),
      animalProducts: ingredientIds.some(id => dietIngredients[id].diet !== 'vegan'),
      meat: ingredientIds.some(id => dietIngredients[id].diet === 'mixed'),
      searchWords: new Set(dietSearchWords(`${family.label} ${name} ${ingredientIds.map(id => dietIngredients[id].name).join(' ')}`)),
    };
  });
}

const dietCatalogGroups = Object.entries(dietFamilies).map(([id, family]) => catalogMealsFor(id, family));
const dietCatalog = Array.from({length: Math.max(...dietCatalogGroups.map(group => group.length))},
  (_, index) => dietCatalogGroups.map(group => group[index]).filter(Boolean)).flat();
const dietCatalogById = new Map(dietCatalog.map(recipe => [recipe.id, recipe]));

function searchDietCatalog({query, family, preference}) {
  const terms = dietSearchWords(query).filter(word => !['de', 'con', 'y', 'el', 'la'].includes(word));
  return dietCatalog.filter(recipe =>
    (family === 'all' || recipe.family === family)
    && (preference !== 'meat' || recipe.meat)
    && (preference !== 'vegan' || !recipe.animalProducts)
    && (preference !== 'vegetarian' || !recipe.meat)
    && terms.every(term => recipe.searchWords.has(term) || (term.length >= 4 && [...recipe.searchWords].some(word =>
      word.startsWith(term) || (term.endsWith('s') && word === term.slice(0, -1))))));
}

function portionIngredients(recipe, goal) {
  const portionIndex = Object.keys(dietPortionGoals).indexOf(goal);
  return recipe.ingredientIds.map(id => {
    const ingredient = dietIngredients[id];
    return {name: ingredient.name, grams: ingredient.grams[Math.max(portionIndex, 0)]};
  });
}
