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

function mealPhoto(meal, className) {
  return `<img class="${className}" src="assets/${meal.photo}" alt="${meal.alt}" width="840" height="560"${meal.focal ? ` style="object-position:${meal.focal}"` : ''}>`;
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
        <button class="button diet-jump" type="button" data-action="show-diet-window" aria-controls="diet-window">${icon('moon')} Ver ayuno</button></div>
      </article>
    <section class="diet-menu" aria-labelledby="plan-meals-title">
      <div class="diet-section-heading"><h2 id="plan-meals-title">Menú de un día</h2><span>${preferences[state.foodPreference]}</span></div>
      <div class="diet-recipes">${plan.meals.map(meal => `<article class="card diet-recipe">
        <button class="diet-photo-button" type="button" data-action="recipe" data-id="${meal.id}" aria-label="Ver receta de ${meal.name}">${mealPhoto(meal, 'diet-food-photo')}</button>
        <div class="diet-recipe-copy"><span class="diet-period">${meal.period}</span><h3>${meal.name}</h3>
        <button class="text-button diet-recipe-link" type="button" data-action="recipe" data-id="${meal.id}">Ver receta ${icon('arrow')}</button></div>
      </article>`).join('')}</div>
    </section>
    <article class="card diet-window" id="diet-window" aria-labelledby="diet-window-heading" tabindex="-1">
      <div class="heading-title">${icon('clock', 'card-icon')}<h2 id="diet-window-heading">Ayuno recomendado</h2></div>
      <strong class="diet-window-title">${fasting.status}</strong>
      ${windowText ? `<p class="diet-window-time">Horario de comidas · ${windowText}</p>` : ''}
      <p>${fasting.reason}</p>
      ${applied ? `<a class="button button-outline" href="#ayuno">Ver horario aplicado ${icon('check')}</a>` : showApply ? `<button class="button button-outline" type="button" data-action="apply-diet-fast">${applyLabel}</button>` : ''}
    </article>
  </div>`;
}

function showDietWindow() {
  const card = document.querySelector('#diet-window');
  card.focus({preventScroll: true});
  card.scrollIntoView({block: 'start'});
}

function showDietRecipe(id) {
  if (!Object.hasOwn(dietRecipes, id)) return;
  const recipe = recipeFor(id, state.foodPreference);
  openDialog('recipe', recipe.name, '', `${mealPhoto(recipe, 'diet-detail-photo')}
    <div><h3>Ingredientes</h3><ul class="menu-list">${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul><h3>Preparación</h3><p class="guide diet-method">${recipe.method}</p></div>`);
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
  const summary = [
    'STRICTO • MI PERFIL Y PLAN', `Fecha ${localDate()}`, '',
    `Nombre o apodo: ${state.name || 'Sin registrar'}`,
    ...profileInputs.map(([key, label]) => `${label}: ${profile[key] ? number(profile[key], 1) : 'Sin registrar'}`),
    `Objetivo: ${goalOptions[state.goal].name}`, `Alimentación: ${preferences[state.foodPreference]}`,
    `Días de fuerza por semana: ${state.strengthDays}`, '',
    'REGISTRO DE MEDIDAS',
    ...(state.measurements.length ? state.measurements.map(record => `${record.date} · ${Object.entries(measurementFields).filter(([key]) => record[key]).map(([key, [name, unit]]) => `${name} ${number(record[key], 1)} ${unit}`).join(' · ')}`) : ['Sin registros.']), '',
    'MENÚ DE UN DÍA', plan.mealAdvice, ...(plan.training ? [plan.training] : []),
    ...plan.meals.map(meal => `${meal.period} · ${meal.name}\n  ${meal.ingredients.join(', ')}. ${meal.method}`), '',
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
