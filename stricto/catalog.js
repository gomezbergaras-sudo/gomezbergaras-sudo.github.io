const foods = [
  ['pollo', 'Pechuga de pollo cocida', 'sliced grilled chicken breast', 165, 31, 0, 3.6],
  ['arroz', 'Arroz blanco cocido', 'cooked plain white rice', 130, 2.7, 28.2, 0.3],
  ['aguacate', 'Aguacate', 'sliced green avocado', 160, 2, 8.5, 14.7],
  ['garbanzos', 'Garbanzos cocidos', 'cooked round chickpeas', 164, 8.9, 27.4, 2.6],
  ['pepino', 'Pepino', 'slices of cucumber', 15, 0.7, 3.6, 0.1],
  ['avena', 'Avena seca', 'dry rolled oats', 379, 13.2, 67.7, 6.5],
  ['yogur', 'Yogur griego natural', 'plain white Greek yogurt', 59, 10.2, 3.6, 0.4],
  ['manzana', 'Manzana', 'fresh apple', 52, 0.3, 13.8, 0.2],
  ['almendras', 'Almendras', 'raw almonds', 579, 21.2, 21.6, 49.9],
  ['banana', 'Banana / cambur', 'fresh banana', 89, 1.1, 22.8, 0.3],
  ['huevo', 'Huevo cocido', 'sliced hard boiled eggs', 155, 12.6, 1.1, 10.6],
  ['caraotas', 'Caraotas negras cocidas', 'cooked black beans', 132, 8.9, 23.7, 0.5],
  ['lentejas', 'Lentejas cocidas', 'cooked brown lentils', 116, 9, 20.1, 0.4],
  ['salmon', 'Salmón cocido', 'grilled salmon fillet', 206, 22.1, 0, 12.4],
  ['brocoli', 'Brócoli cocido', 'green broccoli florets', 35, 2.4, 7.2, 0.4],
  ['tomate', 'Tomate', 'sliced fresh tomatoes', 18, 0.9, 3.9, 0.2],
  ['batata', 'Batata asada', 'roasted sweet potato', 90, 2, 20.7, 0.2],
  ['pasta', 'Pasta cocida', 'plain cooked pasta spaghetti', 158, 5.8, 30.9, 0.9],
  ['tofu', 'Tofu firme', 'firm tofu cubes', 144, 17.3, 2.8, 8.7],
  ['atun', 'Atún en agua, escurrido', 'flaked canned tuna', 116, 25.5, 0, 0.8],
  ['quinoa', 'Quinoa cocida', 'cooked quinoa grains', 120, 4.4, 21.3, 1.9],
  ['leche', 'Leche entera', 'a glass of whole milk', 61, 3.2, 4.8, 3.3],
  ['zanahoria', 'Zanahoria', 'sliced carrots', 41, 0.9, 9.6, 0.2],
  ['fresa', 'Fresas', 'fresh strawberries', 32, 0.7, 7.7, 0.3],
  ['lechuga', 'Lechuga romana', 'romaine lettuce leaves', 17, 1.2, 3.3, 0.3],
  ['aceite', 'Aceite de oliva', '', 884, 0, 0, 100],
  ['arepa', 'Arepa simple (referencia)', 'plain Venezuelan corn arepa', 190, 4, 39, 2.5],
  ['platano', 'Plátano maduro cocido', 'cooked ripe plantain slices', 116, 0.8, 31.2, 0.2],
].map(([id, name, visual, kcal, protein, carbs, fat]) => ({id, name, visual, kcal, protein, carbs, fat}));

const goalOptions = {
  gain: {
    name: 'Subir de peso', icon: 'up', summary: 'Aumentar la energía de forma gradual.',
    guidance: 'Suma una colación o amplía una porción si te cuesta comer suficiente. Puedes incluir alimentos como aguacate, frutos secos y aceite de oliva. Reparte las comidas durante el día según tu apetito.',
    tip: 'Si una ventana corta te deja con poco tiempo para comer suficiente, puedes ampliar el horario de comidas o usar Stricto con el ayuno desactivado.',
  },
  lose: {
    name: 'Bajar de peso', icon: 'down', summary: 'Ajustar las porciones de manera gradual.',
    guidance: 'Combina proteína, verduras o frutas y una porción de granos o tubérculos. Ajusta la cantidad según tu apetito y actividad. Elige comidas que puedas repetir con comodidad durante la semana.',
  },
  recomp: {
    name: 'Recomposición corporal', icon: 'strength', summary: 'Reducir grasa y favorecer la masa muscular.',
    guidance: 'Incluye una fuente de proteína en tus comidas y acompáñala de verduras y carbohidratos según tu actividad. Combina este hábito con entrenamiento de fuerza progresivo.',
  },
};

const exampleMeals = [
  {id: 'demo-pollo', name: 'Bowl de pollo y aguacate', period: 'Almuerzo', time: '13:20', kcal: 610, protein: 45, carbs: 60, fat: 21, icon: 'bowl'},
  {id: 'demo-avena', name: 'Yogur con avena', period: 'Desayuno', time: '10:05', kcal: 485, protein: 34, carbs: 50, fat: 14, icon: 'coffee'},
  {id: 'demo-manzana', name: 'Manzana y almendras', period: 'Colación', time: '16:10', kcal: 150, protein: 3, carbs: 18, fat: 9, icon: 'apple'},
];

const examplePlate = [['pollo', 140], ['arroz', 145], ['aguacate', 65], ['garbanzos', 45], ['pepino', 45]];
