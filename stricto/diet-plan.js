const emptyProfile = {
  age: '', height: '', weight: '', targetWeight: '', waist: '', hip: '',
  dinner: '', fastingPreference: 'none', health: 'unknown',
};

const measurementFields = {weight: ['Peso', 'kg'], waist: ['Cintura', 'cm'], hip: ['Cadera', 'cm']};
const fastingPreferences = {
  none: 'Prefiero un horario flexible',
  start: 'Quiero empezar con una ventana',
  used: 'Ya hago 12 horas con comodidad',
};

const dietRecipes = {
  avena: {
    name: 'Yogur con avena y fruta',
    ingredientIds: ['yogur', 'avena', 'fresas', 'cambur'],
    method: 'Sirve el yogur frío y añade la avena y la fruta cortada.',
  },
  arepa: {
    name: 'Arepa con caraotas y aguacate',
    ingredientIds: ['arepa', 'caraotas', 'aguacate', 'tomate'],
    method: 'Abre la arepa caliente, rellénala con las caraotas y el aguacate, y sirve el tomate al lado.',
  },
  pollo: {
    name: 'Pollo, arroz y aguacate',
    ingredientIds: ['pollo', 'arroz', 'garbanzos', 'aguacate', 'pepino'],
    method: 'Sirve el arroz con el pollo cortado, los garbanzos y el pepino. Termina con aguacate.',
  },
  salmon: {
    name: 'Salmón con arroz y verduras',
    ingredientIds: ['salmon', 'arroz', 'aguacate', 'rabanos', 'hojas'],
    method: 'Coloca el salmón cocido sobre el arroz y acompáñalo con aguacate, rábanos y hojas verdes.',
  },
  tofu: {
    name: 'Tofu, quinoa y brócoli',
    ingredientIds: ['tofu', 'quinoa', 'brocoli', 'zanahoria'],
    method: 'Dora el tofu, cocina las verduras y sirve todo sobre la quinoa.',
  },
  manzana: {
    name: 'Manzana y almendras',
    ingredientIds: ['manzana', 'almendras'],
    method: 'Corta la manzana y sírvela con las almendras.',
  },
};

const dietMenus = {
  gain: {mixed: ['tostada-huevo', 'guiso-res', 'tacos-camaron', 'batido-cacao'], plant: ['arepa', 'chili-vegetal', 'pastas:lentejas:espinaca:salsa-tomate', 'batido-cacao']},
  lose: {mixed: ['tostada-huevo', 'wrap-pavo', 'chili-vegetal', 'vasito-mango'], plant: ['avena', 'tofu', 'chili-vegetal', 'manzana']},
  recomp: {mixed: ['huevos:batata:espinaca:aguacate', 'brochetas-cerdo', 'tacos-camaron', 'vasito-mango'], plant: ['avena', 'chili-vegetal', 'pastas:garbanzos:brocoli:salsa-tomate', 'vasito-mango']},
  general: {mixed: ['tostada-huevo', 'wrap-pavo', 'chili-vegetal', 'vasito-mango'], plant: ['arepa', 'tofu', 'chili-vegetal', 'vasito-mango']},
};

function recipeFor(id, preference) {
  const recipe = Object.hasOwn(dietRecipes, id) ? dietRecipes[id] : dietCatalogById.get(id);
  if (id !== 'avena' || preference !== 'vegan') return recipe;
  return {...recipe, name: 'Yogur de soya con avena y fruta', ingredientIds: ['yogur-soya', ...recipe.ingredientIds.slice(1)]};
}

function adultBodyIndex(weight, height) {
  return weight && height ? weight / (height / 100) ** 2 : null;
}

function fastingSafety(profile) {
  if (profile.age && profile.age < 18) return 'Para menores de 18 años, Stricto propone comidas regulares. Consulta tus metas con un profesional de salud.';
  if (profile.health === 'review') return 'Por las precauciones que marcaste, consulta a un profesional de salud antes de ajustar tus horarios o tus metas de peso.';
  const current = adultBodyIndex(profile.weight, profile.height);
  const target = adultBodyIndex(profile.targetWeight, profile.height);
  if (current !== null && current < 18.5) return 'Tu peso y estatura sugieren revisar si estás comiendo suficiente. Consulta a un profesional antes de cambiar tu alimentación o iniciar ayuno.';
  if (target !== null && target < 18.5) return 'El peso objetivo registrado quedaría por debajo del rango de referencia para adultos. Revisa esa meta antes de hacer cambios.';
  return '';
}

function buildDietPlan(profile, goal, preference, strengthDays) {
  const ready = Boolean(profile.age && profile.weight && profile.height);
  const safety = fastingSafety(profile);
  const bmi = adultBodyIndex(profile.weight, profile.height);
  const inconsistent = profile.targetWeight && profile.weight && (
    (goal === 'gain' && profile.targetWeight < profile.weight) || (goal === 'lose' && profile.targetWeight > profile.weight)
  );
  const goalCaution = inconsistent ? 'El peso objetivo y la meta seleccionada apuntan en direcciones distintas. Revísalos en tu perfil.'
    : ready && goal === 'lose' && bmi < 25 ? 'Para decidir si conviene bajar de peso hacen falta datos adicionales. Puedes enfocarte en cómo comes, cómo te sientes y tu actividad.' : '';
  const tailored = ready && profile.health === 'clear' && !safety && !goalCaution;
  const menu = dietMenus[tailored ? goal : 'general'][preference === 'mixed' ? 'mixed' : 'plant'];
  const mealNames = ['Desayuno', 'Almuerzo', 'Cena', 'Colación'];
  const meals = menu.map((id, index) => ({id, period: mealNames[index], ...recipeFor(id, preference)}));
  const mealAdvice = tailored ? goalOptions[goal].guidance : 'Incluye comidas regulares y variadas. Los platos de abajo son ejemplos que puedes adaptar a tu apetito y costumbres.';
  const training = tailored && goal === 'recomp' && Number.parseInt(strengthDays, 10) > 0
    ? 'En los días de fuerza, reserva una comida con proteína y carbohidratos cerca del entrenamiento según tu comodidad.' : '';
  const fasting = {hours: 0, start: '', available: true, status: 'Sin ayuno recomendado', reason: ''};
  if (safety || goalCaution) {
    fasting.reason = safety || goalCaution;
  } else if (!ready || profile.health !== 'clear') {
    fasting.available = false;
    fasting.status = 'Por definir';
    fasting.reason = 'Registra tu edad, estatura y peso, y confirma las precauciones en tu perfil.';
  } else if (goal === 'gain') {
    fasting.reason = 'Mantén el horario flexible para poder incluir comidas y colaciones suficientes.';
  } else if (profile.fastingPreference === 'none') {
    fasting.reason = 'Elegiste un horario flexible para tus comidas.';
  } else if (!profile.dinner) {
    fasting.available = false;
    fasting.status = 'Por definir';
    fasting.reason = 'Indica a qué hora sueles terminar de cenar para calcular la ventana.';
  } else {
    const hours = profile.fastingPreference === 'used' ? 14 : 12;
    Object.assign(fasting, {
      hours, start: profile.dinner, status: `${hours}:${24 - hours} opcional`,
      reason: hours === 12 ? 'Puedes probar un intervalo nocturno de 12 horas que encaje con tus comidas habituales.'
        : 'Puedes probar 14 horas si ya toleras 12 y puedes mantener tus comidas y tu entrenamiento.',
    });
  }
  return {profileComplete: ready, tailored, meals, mealAdvice, training, fasting};
}
