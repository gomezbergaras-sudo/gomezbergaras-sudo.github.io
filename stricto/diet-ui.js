const profileInputs = [
  ['age', 'Edad (años)', 1, 120, 1],
  ['height', 'Estatura (cm)', 60, 250, .1],
  ['weight', 'Peso actual (kg)', 15, 500, .1],
  ['targetWeight', 'Peso objetivo (kg)', 15, 500, .1],
  ['waist', 'Cintura (cm)', 25, 350, .1],
  ['hip', 'Cadera (cm)', 25, 350, .1],
];

const healthOptions = {
  unknown: 'Prefiero no responder',
  clear: 'Ninguna de las precauciones aplica',
  review: 'Alguna aplica o tengo dudas',
};

const dietCatalogFilters = {query: '', family: 'all', preference: null, page: 0};
const dietCatalogPageSize = 12;

function currentDietPlan() {
  return buildDietPlan(state.profile, state.goal, state.foodPreference, state.strengthDays);
}

function selectOptions(entries, current) {
  return entries.map(([id, label]) => `<option value="${escapeHtml(id)}"${id === current ? ' selected' : ''}>${escapeHtml(label)}</option>`).join('');
}

function renderGoalPage() {
  const profile = state.profile;
  document.querySelector('#goal-content').innerHTML = `<div class="sub-grid profile-layout">
    <article class="card sub-card profile-form-card">
      <header class="card-heading"><div class="heading-title">${icon('target', 'card-icon')}<h2>Datos para tu plan</h2></div></header>
      <form id="profile-form">
        <p class="helper">La edad, estatura y el peso actual permiten personalizar el plan. Las demás medidas son opcionales.</p>
        <label class="field">Nombre o apodo<input name="name" maxlength="35" value="${escapeHtml(state.name)}" autocomplete="nickname"></label>
        <div class="fields">${profileInputs.map(([key, label, min, max, step]) => `<label class="field">${label}<input name="${key}" type="number" inputmode="${step === 1 ? 'numeric' : 'decimal'}" min="${min}" max="${max}" step="${step}" value="${escapeHtml(profile[key])}"></label>`).join('')}</div>
        <div class="fields profile-options">
          <label class="field">Objetivo<select name="goal">${selectOptions(Object.entries(goalOptions).map(([id, goal]) => [id, goal.name]), state.goal)}</select></label>
          <label class="field">Tipo de alimentación<select name="foodPreference">${selectOptions(Object.entries(preferences), state.foodPreference)}</select></label>
          <label class="field">Días de fuerza por semana<select name="strengthDays">${selectOptions(strengthOptions.map(value => [value, value]), state.strengthDays)}</select></label>
          <label class="field">Hora habitual de fin de cena<input type="time" name="dinner" value="${escapeHtml(profile.dinner)}"></label>
        </div>
        <label class="field">Preferencia de ayuno<select name="fastingPreference">${selectOptions(Object.entries(fastingPreferences), profile.fastingPreference)}</select></label>
        <div class="profile-precautions">
          <label class="field">Precauciones para el ayuno<select name="health" aria-describedby="profile-precautions">${selectOptions(Object.entries(healthOptions), profile.health)}</select></label>
          <p class="helper" id="profile-precautions">Indica si hay embarazo o lactancia, antecedentes de un trastorno alimentario, diabetes, medicamentos que requieran comer a horas fijas, pérdida involuntaria de peso o alguna condición que requiera supervisión.</p>
        </div>
        <div class="stack-actions"><button class="button button-primary" type="submit">Guardar mi perfil</button><a class="button button-outline" href="#dietas">Ver mi plan ${icon('arrow')}</a></div>
      </form>
    </article>
    <div class="sub-stack">
      <article class="card sub-card"><header class="card-heading"><div class="heading-title">${icon('chart', 'card-icon')}<h2>Registro de medidas</h2></div></header>
        ${measurementHistoryMarkup()}
        <p class="helper profile-privacy">Tus datos se guardan en este navegador. El informe incluye las medidas registradas, tus objetivos y el plan actual.</p>
      </article>
      <article class="card sub-card"><h2>Metas numéricas opcionales</h2><form id="targets-form">
        <p class="helper">Ingresa las metas que ya tengas definidas. Puedes dejar los campos en blanco.</p>
        <div class="fields">${[['kcal', 'kcal'], ...macroGroups.map(([key, name]) => [key, `${name} (g)`])].map(([key, label]) => `<label class="field">${label}<input name="${key}" type="number" min="1" max="${key === 'kcal' ? '15000' : '2500'}" step="1" value="${escapeHtml(state.targets[key])}"></label>`).join('')}</div>
        <div><button class="button button-outline">Guardar metas</button></div></form>
      </article>
    </div>
  </div>`;
}

function measurementHistoryMarkup() {
  const history = state.measurements.slice(-5).reverse();
  if (!history.length) return '<p class="empty">Tu peso, cintura y cadera aparecerán aquí al guardar tu perfil.</p>';
  return `<ul class="measurement-list">${history.map(record => `<li><time datetime="${record.date}">${new Date(`${record.date}T12:00:00`).toLocaleDateString('es-VE', {day: 'numeric', month: 'short', year: 'numeric'})}</time>
    <span>${Object.entries(measurementFields).filter(([key]) => record[key]).map(([key, [label, unit]]) => `${label} ${number(record[key], 1)} ${unit}`).join(' · ')}</span></li>`).join('')}</ul>`;
}

function saveDietProfile(elements) {
  const values = Object.fromEntries(profileInputs.map(([key]) => [key, elements[key].value === '' ? '' : elements[key].valueAsNumber]));
  const profile = { ...values, dinner: elements.dinner.value, fastingPreference: elements.fastingPreference.value, health: elements.health.value };
  const measureKeys = Object.keys(measurementFields);
  const last = state.measurements.at(-1);
  if (measureKeys.some(key => profile[key] && profile[key] !== last?.[key])) {
    const date = localDate();
    const sameDay = last?.date === date;
    const record = {date, ...(sameDay ? last : {})};
    for (const key of measureKeys) if (profile[key]) record[key] = profile[key];
    state.measurements = [...(sameDay ? state.measurements.slice(0, -1) : state.measurements), record];
  }
  leaveDemo();
  state.name = elements.name.value.trim();
  state.goal = elements.goal.value;
  state.foodPreference = elements.foodPreference.value;
  state.strengthDays = elements.strengthDays.value;
  state.profile = profile;
  if (fastingSafety(profile)) {
    state.allowFasting = false;
    state.duration = 0;
  }
  tell('Perfil guardado. Tu plan de Dietas se actualizó.');
}

function mealPhoto(meal, className, lazy = false) {
  return `<img class="${className}" src="assets/${meal.photo}" alt="${meal.alt}" width="840" height="560"${lazy ? ' loading="lazy" decoding="async"' : ''}${meal.focal ? ` style="object-position:${meal.focal}"` : ''}>`;
}

function dietRecipeCard(meal, label, lazy = false) {
  return `<article class="card diet-recipe">
    <button class="diet-photo-button" type="button" data-action="recipe" data-id="${meal.id}" aria-label="Ver receta de ${meal.name}">${mealPhoto(meal, 'diet-food-photo', lazy)}</button>
    <div class="diet-recipe-copy"><span class="diet-period">${label}</span><h3>${meal.name}</h3>
    <button class="text-button diet-recipe-link" type="button" data-action="recipe" data-id="${meal.id}">Ver receta ${icon('arrow')}</button></div>
  </article>`;
}

function activeDietCatalogPreference() {
  return dietCatalogFilters.preference ?? state.foodPreference;
}

function dietCatalogMarkup() {
  const categories = [['all', 'Todas las categorías'], ...Object.entries(dietFamilies).map(([id, family]) => [id, family.label])];
  const diets = [['mixed', 'Todas las comidas'], ['meat', 'Con carne o pescado'], ['vegetarian', 'Vegetarianas'], ['vegan', 'Veganas']];
  return `<section class="diet-catalog" id="diet-catalog" aria-labelledby="diet-catalog-title" tabindex="-1">
    <div class="diet-section-heading"><h2 id="diet-catalog-title">Explora comidas</h2><span>${number(dietCatalog.length)} combinaciones</span></div>
    <div class="card diet-filters" id="diet-catalog-filters">
      <label class="field diet-search">Buscar por ingrediente<input type="search" name="query" placeholder="Ej. huevo, arepa o pavo" value="${escapeHtml(dietCatalogFilters.query)}"></label>
      <label class="field">Categoría<select name="family">${selectOptions(categories, dietCatalogFilters.family)}</select></label>
      <label class="field">Alimentación<select name="preference">${selectOptions(diets, activeDietCatalogPreference())}</select></label>
    </div>
    <p class="diet-results" id="diet-catalog-results" role="status" tabindex="-1"></p>
    <div class="diet-recipes diet-catalog-recipes" id="diet-catalog-grid"></div>
    <div class="diet-pages" id="diet-catalog-pages" hidden>
      <button class="button button-outline" type="button" data-action="diet-catalog-page" data-step="-1">Anterior</button>
      <span id="diet-catalog-page"></span>
      <button class="button button-outline" type="button" data-action="diet-catalog-page" data-step="1">Siguiente</button>
    </div>
  </section>`;
}

function renderDietCatalogResults() {
  const matches = searchDietCatalog({...dietCatalogFilters, preference: activeDietCatalogPreference()});
  const pageCount = Math.ceil(matches.length / dietCatalogPageSize);
  const page = Math.min(dietCatalogFilters.page, Math.max(0, pageCount - 1));
  const first = page * dietCatalogPageSize;
  const pageMeals = matches.slice(first, first + dietCatalogPageSize);
  const grid = document.querySelector('#diet-catalog-grid');
  dietCatalogFilters.page = page;
  document.querySelector('#diet-catalog-results').textContent = matches.length
    ? `${number(first + 1)}–${number(first + pageMeals.length)} de ${number(matches.length)} ${matches.length === 1 ? 'combinación' : 'combinaciones'}`
    : 'No hay coincidencias. Prueba otro ingrediente o cambia los filtros.';
  grid.innerHTML = pageMeals.map(meal => dietRecipeCard(meal, dietFamilies[meal.family].label, true)).join('');
  const pagination = document.querySelector('#diet-catalog-pages');
  pagination.hidden = pageCount < 2;
  document.querySelector('#diet-catalog-page').textContent = `Página ${number(page + 1)} de ${number(pageCount)}`;
  pagination.querySelector('[data-step="-1"]').disabled = page === 0;
  pagination.querySelector('[data-step="1"]').disabled = page + 1 >= pageCount;
}

function updateDietCatalogFilter(input) {
  dietCatalogFilters[input.name] = input.value;
  dietCatalogFilters.page = 0;
  renderDietCatalogResults();
}

function stepDietCatalog(step) {
  dietCatalogFilters.page = Math.max(0, dietCatalogFilters.page + step);
  renderDietCatalogResults();
  const results = document.querySelector('#diet-catalog-results');
  results.focus({preventScroll: true});
  results.scrollIntoView({block: 'start'});
}

function renderDietPage() {
  const plan = currentDietPlan();
  const goal = goalOptions[state.goal];
  const { fasting } = plan;
  const applied = fasting.hours && fasting.hours === state.duration && fasting.start === state.fastStart && state.allowFasting;
  const windowText = fasting.hours ? `${showTime(addHours(fasting.start, fasting.hours))} – ${showTime(fasting.start)}` : '';
  const applyLabel = fasting.hours ? 'Aplicar este horario' : 'Usar horario flexible';
  const showApply = fasting.available && (fasting.hours || (!state.demo && state.duration));
  const headings = plan.tailored ? goal.name : 'Ideas para tu día';
  const progress = Object.entries(measurementFields).filter(([key]) => state.profile[key]).map(([key, [label, unit]]) => `<div><dt>${label}</dt><dd>${number(state.profile[key], 1)} ${unit}</dd></div>`).join('');
  const target = state.profile.targetWeight ? `<div><dt>Peso objetivo</dt><dd>${number(state.profile.targetWeight, 1)} kg</dd></div>` : '';
  document.querySelector('#diet-content').innerHTML = `<div class="diet-layout">
      <article class="card diet-summary">
        <div class="heading-title">${icon(goal.icon, 'card-icon')}<h2>${headings}</h2></div>
        <p>${plan.mealAdvice}</p>${plan.training ? `<p>${plan.training}</p>` : ''}
        ${progress || target ? `<dl class="diet-metrics">${progress}${target}</dl>` : ''}
        <div class="stack-actions"><a class="button button-light" href="#objetivo">${plan.profileComplete ? 'Actualizar mi perfil' : 'Completar mi perfil'} ${icon('arrow')}</a>
        <button class="button diet-catalog-link" type="button" data-action="show-diet-section" aria-controls="diet-catalog">${icon('bowl')} Explorar comidas</button>
        <button class="button diet-jump" type="button" data-action="show-diet-section" aria-controls="diet-window">${icon('moon')} Ver ayuno</button></div>
      </article>
    <section class="diet-menu" aria-labelledby="plan-meals-title">
      <div class="diet-section-heading"><h2 id="plan-meals-title">Menú de un día</h2><span>${preferences[state.foodPreference]}</span></div>
      <div class="diet-recipes">${plan.meals.map(meal => dietRecipeCard(meal, meal.period)).join('')}</div>
    </section>
    <article class="card diet-window" id="diet-window" aria-labelledby="diet-window-heading" tabindex="-1">
      <div class="heading-title">${icon('clock', 'card-icon')}<h2 id="diet-window-heading">Ayuno recomendado</h2></div>
      <strong class="diet-window-title">${fasting.status}</strong>
      ${windowText ? `<p class="diet-window-time">Horario de comidas · ${windowText}</p>` : ''}
      <p>${fasting.reason}</p>
      ${applied ? `<a class="button button-outline" href="#ayuno">Ver horario aplicado ${icon('check')}</a>` : showApply ? `<button class="button button-outline" type="button" data-action="apply-diet-fast">${applyLabel}</button>` : ''}
    </article>
    ${dietCatalogMarkup()}
  </div>`;
  renderDietCatalogResults();
}

function showDietSection(id) {
  const section = document.getElementById(id);
  section.focus({preventScroll: true});
  section.scrollIntoView({block: 'start'});
}

function recipePortionsMarkup(recipe, goal) {
  return portionIngredients(recipe, goal).map(ingredient =>
    `<li><span>${ingredient.name}</span><strong>${number(ingredient.grams)} g</strong></li>`).join('');
}

function showDietRecipe(id) {
  const recipe = recipeFor(id, state.foodPreference);
  if (!recipe) return;
  const goal = currentDietPlan().tailored ? state.goal : 'general';
  const portionOptions = Object.entries(dietPortionGoals);
  openDialog('recipe', recipe.name, '', `<figure class="diet-recipe-figure">${mealPhoto(recipe, 'diet-detail-photo')}
    ${recipe.referencePhoto ? '<figcaption>Foto de referencia</figcaption>' : ''}</figure>
    <div class="diet-detail">
      <h3>Ingredientes para una porción</h3>
      ${fastingSafety(state.profile) ? '' : `<label class="field">Objetivo para los gramajes
        <select id="diet-recipe-goal" data-id="${id}">${selectOptions(portionOptions, goal)}</select></label>`}
      <ul class="diet-portion-list" id="diet-recipe-ingredients">${recipePortionsMarkup(recipe, goal)}</ul>
      <p class="helper">Gramajes orientativos para adultos. Pesa cada ingrediente tal como se indica en la lista.</p>
      <h3>Preparación</h3><p class="guide diet-method">${recipe.method}</p>
    </div>`);
}

function updateDietRecipePortions(select) {
  const recipe = recipeFor(select.dataset.id, state.foodPreference);
  document.querySelector('#diet-recipe-ingredients').innerHTML = recipePortionsMarkup(recipe, select.value);
}

function applyDietFasting() {
  const { fasting } = currentDietPlan();
  if (!fasting.available) return;
  if (state.fast) {
    tell('Termina el ayuno en curso antes de cambiar el horario.');
    return;
  }
  leaveDemo();
  state.duration = fasting.hours;
  if (fasting.hours) state.fastStart = fasting.start;
  state.allowFasting = Boolean(fasting.hours);
  saveState();
  renderPage();
  tell(fasting.hours ? 'Horario guardado en Ayuno. Puedes iniciar el temporizador cuando quieras.' : 'Horario flexible guardado en Ayuno.');
}

function downloadDietProfile() {
  const plan = currentDietPlan();
  const profile = state.profile;
  const portionGoal = plan.tailored ? state.goal : 'general';
  const summary = [
    'STRICTO • MI PERFIL Y PLAN', `Fecha ${localDate()}`, '',
    `Nombre o apodo: ${state.name || 'Sin registrar'}`,
    ...profileInputs.map(([key, label]) => `${label}: ${profile[key] ? number(profile[key], 1) : 'Sin registrar'}`),
    `Objetivo: ${goalOptions[state.goal].name}`, `Alimentación: ${preferences[state.foodPreference]}`,
    `Días de fuerza por semana: ${state.strengthDays}`, '',
    'REGISTRO DE MEDIDAS',
    ...(state.measurements.length ? state.measurements.map(record => `${record.date} · ${Object.entries(measurementFields).filter(([key]) => record[key]).map(([key, [name, unit]]) => `${name} ${number(record[key], 1)} ${unit}`).join(' · ')}`) : ['Sin registros.']), '',
    'MENÚ DE UN DÍA', plan.mealAdvice, ...(plan.training ? [plan.training] : []),
    ...plan.meals.map(meal => {
      const portions = portionIngredients(meal, portionGoal).map(({name, grams}) => `${grams} g de ${name}`);
      return `${meal.period} · ${meal.name}\n  ${portions.join(', ')}. ${meal.method}`;
    }), '',
    'AYUNO RECOMENDADO', plan.fasting.status, plan.fasting.reason,
    ...(plan.fasting.hours ? [`Horario de comidas: ${showTime(addHours(plan.fasting.start, plan.fasting.hours))} – ${showTime(plan.fasting.start)}`] : []),
  ].join('\n');
  const url = URL.createObjectURL(new Blob([summary], {type: 'text/plain;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = `stricto-perfil-${localDate()}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
