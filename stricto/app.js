const iconPaths = {
  home: '<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 21v-7h6v7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  book: '<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M8 3v18m3-13h5m-5 4h5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  moon: '<path d="M21 13a9 9 0 1 1-10-10 8 8 0 0 0 10 10Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18m-13 5h2m4 0h2"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18h1a1.7 1.7 0 0 0 1.1-3c-.7-.6-.3-1.7.6-1.7h1.6a4.7 4.7 0 0 0 4.7-4.6A8.8 8.8 0 0 0 12 3Z"/><path d="M7.4 13h.1m1-4.2h.1m4.1-1.9h.1m4 2.1h.1" stroke-width="2.6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  scan: '<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3M7 12h10"/>',
  camera: '<path d="M4 7h4l2-3h4l2 3h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="3"/>',
  chart: '<path d="M3 3v18h18M7 15l4-4 4 2 5-6"/>',
  bowl: '<path d="M3 12h18a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8Zm5 9h8m-9-13 2-3m4 3 2-3m4 3 2-3"/>',
  coffee: '<path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Zm13 1h2a2 2 0 0 1 0 4h-2M3 21h16M8 3v2m4-2v2"/>',
  apple: '<path d="M12 8c-3-4-9-1-9 4s3 8 6 8c1 0 2-1 3-1s2 1 3 1c3 0 6-4 6-8s-6-8-9-4Zm0 0c0-3 2-5 5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  strength: '<path d="M6 7v10m3-12v14m6-14v14m3-12v10M2 12h4m3 0h6m3 0h4"/>',
  up: '<path d="M5 17 19 5M10 5h9v9"/>',
  down: '<path d="m5 7 14 12m-9 0h9v-9"/>',
  leaf: '<path d="M20 4c-9 0-15 3-15 9a5 5 0 0 0 5 5c6 0 9-6 10-14ZM4 20l10-10"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  upload: '<path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>',
  trash: '<path d="M3 6h18m-16 0 1 15h12l1-15M9 6V3h6v3m-5 4v7m4-7v7"/>',
};

const designs = {
  pulso: ['Pulso', 'Ciruela, coral y un reloj con marcas de progreso.', '#fff8f2'],
  ritmo: ['Ritmo', 'Fondo nocturno y acentos verde menta.', '#10161e'],
  claro: ['Claro', 'Azul cobalto, escáner primero y progreso lineal.', '#eff3ff'],
};
const navViews = ['hoy', 'ayuno', 'diario', 'objetivo', 'dietas'];
const periods = ['Desayuno', 'Almuerzo', 'Cena', 'Colación'];
const macroGroups = [['protein', 'Proteínas', 'protein'], ['carbs', 'Carbohidratos', 'carbs'], ['fat', 'Grasas', 'fat']];
const localProfileStorageKey = 'stricto-v1';
let storageKey = localProfileStorageKey;
let workspaceAccount = null;
let workspaceOpen = false;
const principalProfileId = 'principal';
const memoryProfiles = new Map();
const hour = 3600000;
const preferences = {mixed: 'Omnívora', vegetarian: 'Vegetariana', vegan: 'Vegana'};
const strengthOptions = ['0', '1', '2', '3', '4', '5 o más'];
const initialState = {
  demo: true, theme: 'pulso', goal: 'recomp', name: '', foodPreference: 'mixed', strengthDays: '0',
  profile: emptyProfile, measurements: [],
  targets: {kcal: '', protein: '', carbs: '', fat: ''}, allowFasting: false, duration: 0, fastStart: '20:00', fast: null, fastHistory: [], meals: [],
};

function profileStorageKey(id) {
  return id === principalProfileId ? storageKey : `${storageKey}:perfil:${id}`;
}

function profileIds() {
  const ids = new Set([principalProfileId, ...memoryProfiles.keys()]);
  const prefix = `${storageKey}:perfil:`;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) ids.add(key.slice(prefix.length));
    }
  } catch {
    storageAvailable = false;
  }
  return [...ids];
}

function lastProfileId() {
  try {
    const id = localStorage.getItem(`${storageKey}:perfil-activo`);
    return profileIds().includes(id) ? id : principalProfileId;
  } catch {
    storageAvailable = false;
    return principalProfileId;
  }
}

function readState(id) {
  let saved = memoryProfiles.get(id);
  if (!saved) {
    try {
      saved = JSON.parse(localStorage.getItem(profileStorageKey(id)));
    } catch {
      saved = null;
    }
  }
  return {
    ...initialState, ...saved,
    name: typeof saved?.name === 'string' ? saved.name : initialState.name,
    theme: Object.hasOwn(designs, saved?.theme) ? saved.theme : initialState.theme,
    goal: Object.hasOwn(goalOptions, saved?.goal) ? saved.goal : initialState.goal,
    foodPreference: Object.hasOwn(preferences, saved?.foodPreference) ? saved.foodPreference : initialState.foodPreference,
    profile: {...emptyProfile, ...saved?.profile}, targets: {...initialState.targets, ...saved?.targets},
    meals: Array.isArray(saved?.meals) ? saved.meals.slice() : [],
    measurements: Array.isArray(saved?.measurements) ? saved.measurements.slice() : [],
    fastHistory: Array.isArray(saved?.fastHistory) ? saved.fastHistory.slice() : [],
  };
}

let storageAvailable = true;
let activeProfileId = principalProfileId;
let state = null;
let view = 'hoy';
let journalDay = localDate();
let composer = null;
let visionWorker;
let scanRequestId = 0;
let toastTimeout;
const dialog = document.querySelector('#dialog');
const dialogContent = document.querySelector('#dialog-content');

function saveState() {
  try {
    localStorage.setItem(profileStorageKey(activeProfileId), JSON.stringify(state));
    memoryProfiles.delete(activeProfileId);
  } catch {
    memoryProfiles.set(activeProfileId, state);
    storageAvailable = false;
  }
}

function profileDisplayName(id, profileState) {
  return profileState.name.trim() || (id === principalProfileId ? 'Perfil principal' : 'Perfil');
}

function activateProfile(id, profileState = readState(id)) {
  if (id === activeProfileId) {
    dialog.close();
    return;
  }
  activeProfileId = id;
  state = profileState;
  journalDay = localDate();
  resetDietCatalog();
  try {
    localStorage.setItem(`${storageKey}:perfil-activo`, id);
  } catch {
    storageAvailable = false;
  }
  if (dialog.open) dialog.close();
  applyTheme();
  renderPage();
  updateClock();
  tell(`Perfil activo · ${profileDisplayName(id, state)}`);
}

function openProfilePicker() {
  openDialog('profiles', 'Perfiles', 'Cada perfil tiene sus metas, medidas, diario y horario en este navegador.', `
    ${workspaceAccount ? `<p class="helper account-current">${escapeHtml(workspaceAccount.email)}</p>` : ''}
    <div class="profile-picker">${profileIds().map(id => {
      const profileState = id === activeProfileId ? state : readState(id);
      const current = id === activeProfileId;
      return `<button class="button button-outline profile-choice" type="button" data-action="switch-profile" data-id="${escapeHtml(id)}" aria-pressed="${current}"><span><strong>${escapeHtml(profileDisplayName(id, profileState))}</strong><small>${goalOptions[profileState.goal].name}</small></span>${current ? '<em>Activo</em>' : icon('chevron')}</button>`;
    }).join('')}</div>
    <div class="stack-actions">
      <button class="button button-primary" type="button" data-action="new-profile">${icon('plus')} Crear perfil</button>
      <button class="button button-outline" type="button" data-auth-action="${workspaceAccount ? 'signout' : 'signin'}">${workspaceAccount ? 'Cerrar sesión' : 'Iniciar sesión'}</button>
    </div>`);
}

function openStrictoWorkspace(account = null) {
  if (dialog.open) dialog.close();
  memoryProfiles.clear();
  storageAvailable = true;
  workspaceAccount = account;
  storageKey = account ? `${localProfileStorageKey}:cuenta:${account.id}` : localProfileStorageKey;
  activeProfileId = lastProfileId();
  state = readState(activeProfileId);
  if (account) state.demo = false;
  journalDay = localDate();
  resetDietCatalog();
  workspaceOpen = true;
  document.querySelector('#stricto-auth').hidden = true;
  document.querySelector('#stricto-sidebar').hidden = false;
  document.querySelector('#main').hidden = false;
  applyTheme();
  showRoute();
  updateClock();
}

function closeStrictoWorkspace() {
  workspaceOpen = false;
  workspaceAccount = null;
  state = null;
  memoryProfiles.clear();
  if (dialog.open) dialog.close();
  dialogContent.replaceChildren();
  document.querySelector('#stricto-sidebar').hidden = true;
  document.querySelector('#main').hidden = true;
  for (const element of document.querySelectorAll('#home-energy, #home-nutrition, #home-meals, #home-suggestion, #fast-content, #diary-content, #goal-content, #diet-content')) {
    element.replaceChildren();
  }
  document.querySelector('#avatar').textContent = 'S';
  document.querySelector('#avatar').removeAttribute('title');
  document.querySelector('#avatar').setAttribute('aria-label', 'Cambiar perfil');
  document.querySelector('#toast').classList.remove('visible');
  document.querySelector('#toast').textContent = '';
  document.documentElement.dataset.theme = 'pulso';
  document.querySelector('meta[name="theme-color"]').content = designs.pulso[2];
  document.querySelector('#stricto-auth').hidden = false;
  window.scrollTo(0, 0);
}

function openCreateProfile() {
  openDialog('profiles', 'Crear perfil', '', `
    <form id="new-profile-form" class="new-profile-form">
      <label class="field">Nombre o apodo<input name="name" maxlength="35" autocomplete="off" required></label>
      <label class="field">Objetivo<select name="goal">${selectOptions(Object.entries(goalOptions).map(([id, goal]) => [id, goal.name]), 'recomp')}</select></label>
      <label class="field">Tipo de alimentación<select name="preference">${selectOptions(Object.entries(preferences), 'mixed')}</select></label>
      <button class="button button-primary" type="submit">Crear y abrir perfil</button>
    </form>`);
  dialogContent.querySelector('input').focus();
}

function createProfile({name, goal, preference}) {
  const trimmed = name.value.trim();
  name.setCustomValidity(trimmed ? '' : 'Escribe un nombre o apodo.');
  if (!name.reportValidity()) return;
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  activateProfile(id, {...readState(id), name: trimmed, goal: goal.value, foodPreference: preference.value, demo: false});
  if (view !== 'objetivo') location.hash = 'objetivo';
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
}

function icon(name, className = '') {
  return `<span data-icon="${name}" class="${className}" aria-hidden="true"></span>`;
}

function drawIcons(root = document) {
  for (const element of root.querySelectorAll('[data-icon]:empty')) {
    element.setAttribute('aria-hidden', 'true');
    element.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[element.dataset.icon] ?? ''}</svg>`;
  }
}

function number(value, digits = 0) {
  return new Intl.NumberFormat('es-VE', {maximumFractionDigits: digits, useGrouping: 'always'}).format(value);
}

function localDate(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function localTime(date = new Date()) {
  return [date.getHours(), date.getMinutes()].map(part => String(part).padStart(2, '0')).join(':');
}

function showTime(value) {
  const [hours, minutes] = value.split(':').map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'a. m.' : 'p. m.'}`;
}

function atMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function addHours(time, hours) {
  const minutes = (atMinutes(time) + Math.round(hours * 60)) % 1440;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function elapsedTime(ms) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(part => String(part).padStart(2, '0')).join(':');
}

function tell(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = storageAvailable ? message : `${message} El almacenamiento del navegador está desactivado.`;
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3200);
}

function leaveDemo() {
  state.demo = false;
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  document.querySelector('meta[name="theme-color"]').content = designs[state.theme][2];
}

function renderHeader() {
  const date = new Date();
  const formatted = date.toLocaleDateString('es-VE', {weekday: 'long', day: 'numeric', month: 'long'});
  for (const dateNode of document.querySelectorAll('#date-today, #mobile-date')) {
    dateNode.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    dateNode.dateTime = localDate(date);
  }
  document.querySelector('#example-button').hidden = !state.demo;
  const avatar = document.querySelector('#avatar');
  const profileName = profileDisplayName(activeProfileId, state);
  avatar.textContent = (state.name.trim().charAt(0) || 'S').toUpperCase();
  avatar.title = profileName;
  avatar.setAttribute('aria-label', `Cambiar perfil. Activo: ${profileName}`);
  document.querySelector('#home-goal').textContent = goalOptions[state.goal].name;
}

function showRoute() {
  const route = location.hash.slice(1);
  view = navViews.includes(route) ? route : 'hoy';
  for (const page of navViews) {
    document.querySelector(`#view-${page}`).hidden = page !== view;
    const link = document.querySelector(`[data-nav="${page}"]`);
    if (page === view) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  renderPage();
  window.scrollTo(0, 0);
}

function renderPage() {
  renderHeader();
  if (view === 'hoy') renderHome();
  if (view === 'ayuno') renderFastPage();
  if (view === 'diario') renderJournal();
  if (view === 'objetivo') renderGoalPage();
  if (view === 'dietas') renderDietPage();
  renderFastReadings();
  drawIcons();
}

function mealsFor(date) {
  if (state.demo && date === localDate()) return exampleMeals;
  return state.meals.filter(meal => meal.date === date).sort((a, b) => b.time.localeCompare(a.time));
}

function totals(meals) {
  const total = {kcal: 0, protein: 0, carbs: 0, fat: 0};
  for (const meal of meals) {
    for (const key of Object.keys(total)) total[key] += meal[key];
  }
  return total;
}

function progress(value, target, color) {
  if (!(target > 0)) return '';
  const percentage = Math.max(0, Math.min(100, value / target * 100));
  return `<span class="bar" aria-hidden="true" style="--value:${percentage}%;${color ? `--bar-color:var(--${color})` : ''}"><i></i></span>`;
}

function nutritionMarkup(meals, label = 'Hoy', showCalories = true) {
  const total = totals(meals);
  const targets = state.demo ? {kcal: 2000, protein: 135, carbs: 210, fat: 70}
    : {...state.targets, kcal: showCalories ? currentDietPlan().calories.target : 0};
  return `<header class="card-heading"><div class="heading-title">${icon('chart', 'card-icon')}<h2>${showCalories ? 'Nutrición' : 'Macronutrientes'}</h2></div><span class="muted">${label}</span></header>
    ${showCalories ? `<div class="calorie-total"><strong>${number(total.kcal)}</strong><span>${targets.kcal ? `/ ${number(targets.kcal)} ` : ''}kcal ${targets.kcal ? '' : 'registradas'}</span></div>
    ${progress(total.kcal, targets.kcal)}` : ''}
    <div class="macros">${macroGroups.map(([key, name, color]) => `<div class="macro" style="--bar-color:var(--${color})">
      <span><i></i>${name}</span><strong>${number(total[key])} g ${targets[key] ? `<small>/ ${targets[key]} g</small>` : ''}</strong>${progress(total[key], targets[key], color)}
    </div>`).join('')}</div>`;
}

function renderHomeCalories(meals, calories) {
  const recorded = Math.round(totals(meals).kcal);
  const target = state.demo ? 2000 : calories.target;
  const sourceLabel = state.demo ? 'Meta de ejemplo' : calories.source === 'manual' ? 'Meta propia' : 'Meta estimada';
  const difference = target - recorded;
  const status = difference > 0 ? `${number(difference)} kcal hasta la meta`
    : difference < 0 ? `${number(-difference)} kcal por encima de la meta` : 'Meta alcanzada';
  document.querySelector('#home-energy').innerHTML = `
    <header class="card-heading"><div class="heading-title">${icon('chart', 'card-icon')}<h2>Calorías de hoy</h2></div>
      <a class="text-button" href="#objetivo">${target && !state.demo ? 'Ver mi meta' : 'Configurar mi meta'}</a></header>
    <div class="home-energy-values"><div class="calorie-total"><strong>${number(recorded)}</strong><span>kcal registradas</span></div>
      ${target ? `<span class="home-energy-target">${sourceLabel} <strong>${number(target)} kcal</strong></span>` : ''}</div>
    ${target ? `<progress class="home-energy-bar" value="${Math.min(recorded, target)}" max="${target}" aria-label="Calorías registradas frente a la meta" aria-valuetext="${number(recorded)} de ${number(target)} kcal"></progress>
      <p class="helper">${status}</p>` : '<div class="home-energy-track" aria-hidden="true"></div><p class="helper">Completa tu perfil para estimar la meta diaria o guarda una meta propia.</p>'}`;
}

function mealsMarkup(meals, detailed = false) {
  if (meals.length === 0) return '<p class="empty">Aún no hay comidas para esta fecha.</p>';
  return `<ul class="meals-list">${meals.map(meal => `<li class="meal-row${detailed ? ' diary-row' : ''}">
    ${icon(meal.icon, 'meal-icon')}<div class="meal-description"><strong>${escapeHtml(meal.name)}</strong><small>${meal.period} · ${showTime(meal.time)}</small></div>
    <span class="meal-kcal">${number(meal.kcal)} <small>kcal</small></span>
    ${detailed ? `<button type="button" class="icon-button" data-action="meal-details" data-id="${meal.id}" aria-label="Ver ${escapeHtml(meal.name)}">${icon('chevron')}</button>` : ''}
  </li>`).join('')}</ul>`;
}

function renderHome() {
  const meals = mealsFor(localDate());
  const plan = currentDietPlan();
  const lunch = plan.servings.find(serving => serving.period === 'Almuerzo').dishes[0];
  renderHomeCalories(meals, plan.calories);
  document.querySelector('#home-nutrition').innerHTML = nutritionMarkup(meals, 'Hoy', false);
  document.querySelector('#home-meals').innerHTML = `<header class="card-heading"><div class="heading-title">${icon('bowl', 'card-icon')}<h2>Comidas de hoy</h2></div><a href="#diario" class="text-button">Ver diario</a></header>${mealsMarkup(meals.slice(0, 3))}`;
  document.querySelector('#home-suggestion').innerHTML = `<header class="card-heading"><div class="heading-title">${icon('leaf', 'card-icon')}<h2>Idea de comida para tu objetivo</h2></div></header>
    <p><strong>${lunch.name}.</strong> ${plan.tailored ? goalOptions[state.goal].summary : 'Explora los platos y guarda tu perfil para adaptar el plan.'}</p><a class="button button-outline" href="#dietas">Ver mi plan de comidas ${icon('arrow')}</a>`;
}

function planLabel(duration) {
  return duration ? `${duration}:${24 - duration}` : 'Sin ayuno';
}

function fastReadings() {
  if (state.demo) return {plan: '14:10', 'timer-label': 'TIEMPO DE AYUNO', elapsed: '12:42:18', duration: 'de 14 h', status: 'Ayuno en curso', event: 'Próxima comida', 'event-time': '10:00 a. m.', schedule: '10:00 a. m. – 8:00 p. m.', ring: 90.75};
  const now = new Date();
  const active = state.fast;
  const start = state.fastStart;
  const opens = addHours(start, state.duration);
  const readings = {plan: planLabel(state.duration), 'timer-label': 'TIEMPO DE AYUNO', elapsed: '00:00:00', duration: state.duration ? `de ${state.duration} h` : '', status: 'Temporizador en pausa', event: '', 'event-time': 'Ayuno opcional', schedule: 'Horario flexible', ring: 0};
  if (state.duration) {
    const offset = (atMinutes(localTime(now)) - atMinutes(start) + 1440) % 1440;
    const inWindow = offset >= state.duration * 60;
    readings.status = inWindow ? 'Ventana de comida' : 'Ayuno programado';
    readings.event = inWindow ? 'La ventana cierra a las' : 'La ventana abre a las';
    readings['event-time'] = showTime(inWindow ? start : opens);
    readings.schedule = `${showTime(opens)} – ${showTime(start)}`;
  }
  if (active) {
    const duration = active.ends - active.started;
    const elapsed = now.getTime() - active.started;
    readings.elapsed = elapsedTime(elapsed);
    readings.duration = `de ${duration / hour} h`;
    readings.status = 'Ayuno en curso';
    readings.event = 'El temporizador termina a las';
    readings['event-time'] = showTime(localTime(new Date(active.ends)));
    readings.ring = Math.max(0, Math.min(100, elapsed / duration * 100));
  }
  return readings;
}

function renderFastReadings() {
  const readings = fastReadings();
  document.querySelector('#sidebar-window').textContent = readings.plan;
  for (const element of document.querySelectorAll('[data-fast]')) {
    const key = element.dataset.fast;
    if (key === 'ring') element.style.setProperty('--progress', `${readings.ring}%`);
    else if (element.textContent !== readings[key]) element.textContent = readings[key];
  }
}

function fastActionMarkup() {
  return state.demo ? '<button type="button" class="button button-light" data-action="personal">Pasar a mi espacio</button>'
    : state.fast ? '<button type="button" class="button button-light" data-action="stop-fast">Terminar ayuno</button>'
    : `<button type="button" class="button button-light" data-action="start-fast"${state.duration && !fastingSafety(state.profile) ? '' : ' disabled'}>Iniciar ahora</button>`;
}

function fastHistoryMarkup() {
  const history = state.fastHistory.slice(0, 14);
  return history.length ? `<ul class="fast-history">${history.map(session => `<li><span>${new Date(session.ended).toLocaleDateString('es-VE', {day: 'numeric', month: 'short'})} · ${session.completed ? 'Completado' : 'Finalizado'}</span><strong class="tabular">${elapsedTime(session.ended - session.started)}</strong></li>`).join('')}</ul>` : '<p class="empty">Los ayunos iniciados con el temporizador aparecerán aquí al terminar.</p>';
}

function renderFastPage() {
  const duration = state.demo ? 14 : state.duration;
  const safety = fastingSafety(state.profile);
  document.querySelector('#fast-content').innerHTML = `<div class="sub-grid">
    <div class="sub-stack"><article class="card fast-card fast-settings">
      <header class="card-heading"><div class="heading-title">${icon('clock', 'card-icon')}<h2>Temporizador</h2></div><span class="fast-badge" data-fast="plan"></span></header>
      <div class="fast-body"><div class="timer" data-fast="ring"><div class="timer-dial"></div><div class="timer-reading"><small data-fast="timer-label"></small><strong data-fast="elapsed"></strong><span data-fast="duration"></span></div></div>
        <div class="fast-details"><div class="fast-status"><i></i><span data-fast="status"></span></div><p data-fast="event"></p><strong data-fast="event-time"></strong><div id="fast-action">${fastActionMarkup()}</div></div></div>
      <footer class="fast-footer"><span>${icon('sun')} Ventana de comida</span><strong data-fast="schedule"></strong></footer>
    </article>
    <article class="card sub-card"><h2>Ayunos registrados</h2><div id="fast-history">${fastHistoryMarkup()}</div></article></div>
    <article class="card sub-card"><h2>Horario habitual</h2><form id="fast-form">
      <div class="fields"><label class="field">Ventana diaria<select name="duration">${(safety ? [0] : [0, 12, 14, 16]).map(hours => `<option value="${hours}"${hours === duration ? ' selected' : ''}>${hours ? `${planLabel(hours)} · ${hours} h de ayuno` : 'Sin ayuno'}</option>`).join('')}</select></label>
      <label class="field">Cierre de la ventana de comida<input type="time" name="start" value="${state.fastStart}" required></label></div>
      <p class="helper" id="schedule-preview"></p>
      <label class="check"><input type="checkbox" name="ready"${state.allowFasting ? ' checked' : ''}><span>Confirmo que tengo 18 años o más y que cumplo las indicaciones de abajo para activar una ventana.</span></label>
      <p class="guide">Evita el ayuno si eres menor de 18 años, estás en embarazo o lactancia, o tienes antecedentes de un trastorno alimentario. Si tienes diabetes, tomas medicamentos que afectan la glucosa o tienes una condición que requiere horarios de comida, consulta primero con tu equipo de salud. Puedes usar el diario con la ventana desactivada. <a href="https://www.hopkinsmedicine.org/health/expert-qa/intermittent-fasting-what-is-it-and-how-does-it-work" target="_blank" rel="noreferrer">Johns Hopkins Medicine</a></p>
      ${state.goal === 'gain' ? `<p class="helper">${goalOptions.gain.tip}</p>` : ''}
      ${safety ? `<p class="guide">${safety}</p>` : ''}
      <a class="text-button" href="#dietas">Ver mi recomendación de ayuno ${icon('arrow')}</a>
      <div class="stack-actions"><button class="button button-primary" type="submit">Guardar horario</button></div>
    </form></article></div>`;
  updateSchedulePreview();
}

function updateSchedulePreview() {
  const form = document.querySelector('#fast-form');
  const duration = Number(form.elements.duration.value);
  const start = form.elements.start.value;
  const description = duration && start ? `Ventana de comida: ${showTime(addHours(start, duration))} – ${showTime(start)}.` : 'El diario queda disponible con horario flexible.';
  document.querySelector('#schedule-preview').textContent = description;
  form.elements.ready.required = Boolean(duration);
}

function endFast(now, completed) {
  if (!state.fast) return;
  state.fastHistory = [{started: state.fast.started, ended: now, completed}, ...state.fastHistory];
  state.fast = null;
  saveState();
}

function updateClock() {
  const now = Date.now();
  if (state.fast && now >= state.fast.ends) {
    endFast(state.fast.ends, true);
    if (view === 'ayuno') {
      document.querySelector('#fast-action').innerHTML = fastActionMarkup();
      document.querySelector('#fast-history').innerHTML = fastHistoryMarkup();
    }
    tell('Terminó el temporizador de ayuno.');
  }
  if (document.querySelector('#date-today').dateTime !== localDate()) renderHeader();
  renderFastReadings();
}

function renderJournal() {
  const day = mealsFor(journalDay);
  document.querySelector('#diary-content').innerHTML = `<div class="sub-grid">
    <article class="card sub-card"><header class="card-heading"><div class="heading-title">${icon('book', 'card-icon')}<h2>Registros</h2></div><input class="diary-date" id="journal-day" type="date" aria-label="Fecha del diario" value="${journalDay}"></header>
      ${mealsMarkup(day, true)}<div class="stack-actions"><button class="text-button" type="button" data-action="scan">Registrar con una foto</button></div></article>
    <article class="card nutrition-card">${nutritionMarkup(day, journalDay === localDate() ? 'Hoy' : 'Día')}</article>
  </div>`;
}

function openDialog(mode, title, subtitle, body, footer = '') {
  dialog.classList.toggle('design-dialog', mode === 'designs');
  dialog.classList.toggle('meal-dialog', mode === 'scan' || mode === 'manual');
  dialogContent.innerHTML = `<div class="dialog-inner"><header class="dialog-header"><div><h2 id="dialog-title">${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div><button type="button" class="icon-button" data-action="close-dialog" aria-label="Cerrar">${icon('x')}</button></header>
    <div class="dialog-body">${body}</div>${footer ? `<footer class="dialog-footer">${footer}</footer>` : ''}</div>`;
  drawIcons(dialogContent);
  if (!dialog.open) dialog.showModal();
}

function openDesigns() {
  openDialog('designs', 'Elige tu diseño', 'Toca un diseño para aplicarlo en toda la app.', `<div class="design-options">${Object.entries(designs).map(([id, [title, copy]]) => `<button class="design-choice" type="button" data-action="theme" data-id="${id}" aria-pressed="${id === state.theme}"><span class="mini-design ${id}" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span><strong>${title}${id === state.theme ? '<em>Activo</em>' : ''}</strong><span>${copy}</span></button>`).join('')}</div>`);
}

function openPersonal() {
  openDialog('personal', 'Tu espacio en Stricto', 'Empieza con tu propio diario. El reloj y las comidas de ejemplo se ocultan al guardar tus primeros datos.', '<div class="stack-actions"><button type="button" class="button button-primary" data-action="enter-personal">Empezar mi espacio</button><button type="button" class="button button-outline" data-action="close-dialog">Seguir explorando</button></div>');
}

function openSources() {
  openDialog('sources', 'Guía y fuentes', '', `<p class="guide">En 12:12 hay 12 horas de ayuno y 12 para tus comidas. Stricto propone un horario opcional según tu perfil. Las medidas sirven para hacer seguimiento y revisar metas.</p>
    <ul class="source-list">
      <li>Precauciones antes de iniciar ayuno. <a href="https://www.hopkinsmedicine.org/health/expert-qa/intermittent-fasting-what-is-it-and-how-does-it-work" target="_blank" rel="noreferrer">Johns Hopkins Medicine</a></li>
      <li>Interpretación orientativa del peso respecto a la estatura. <a href="https://www.nhs.uk/health-assessment-tools/calculate-your-body-mass-index/calculate-bmi-for-adults" target="_blank" rel="noreferrer">NHS</a></li>
      <li>El estudio TIMET observó cambios modestos en adultos con síndrome metabólico durante tres meses. <a href="https://www.nih.gov/news-events/nih-research-matters/time-restricted-eating-metabolic-syndrome" target="_blank" rel="noreferrer">NIH y ensayo TIMET</a></li>
      <li>En un ensayo de doce meses, añadir una ventana horaria a la restricción calórica no cambió significativamente el peso. <a href="https://doi.org/10.1056/NEJMoa2114833" target="_blank" rel="noreferrer">Liu y colaboradores</a></li>
      <li>Ganancia gradual de peso. <a href="https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/healthy-ways-to-gain-weight/" target="_blank" rel="noreferrer">NHS</a></li>
      <li>Proteína y ejercicio durante un déficit energético. <a href="https://pubmed.ncbi.nlm.nih.gov/26817506/" target="_blank" rel="noreferrer">Ensayo de Longland y colaboradores</a></li>
      <li>Consideraciones sobre ayuno y diabetes. <a href="https://www.niddk.nih.gov/health-information/professionals/diabetes-discoveries-practice/patients-intermittent-fasting" target="_blank" rel="noreferrer">NIDDK</a></li>
      <li>Datos genéricos del catálogo. La arepa simple usa una referencia aproximada y varía según receta. <a href="https://fdc.nal.usda.gov/data-documentation/" target="_blank" rel="noreferrer">USDA FoodData Central</a></li>
      <li>La meta de calorías estima primero el gasto en reposo y lo ajusta según la actividad y el objetivo. <a href="https://pubmed.ncbi.nlm.nih.gov/2305711/" target="_blank" rel="noreferrer">Mifflin y St Jeor</a> · <a href="https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner" target="_blank" rel="noreferrer">NIDDK</a></li>
      <li>Estimación nutricional a partir de imágenes. <a href="https://openaccess.thecvf.com/content/CVPR2021/html/Thames_Nutrition5k_Towards_Automatic_Nutritional_Understanding_of_Generic_Food_CVPR_2021_paper.html" target="_blank" rel="noreferrer">Nutrition5k</a></li>
    </ul>`);
}

function newComposer(mode) {
  composer = {image: '', photo: null, sample: false, rows: [], analyzing: false};
  const scanMarkup = mode === 'scan' ? `<div class="scan-upload">${icon('scan')}<div class="stack-actions">
    <button type="button" class="button button-primary" data-action="take-photo">${icon('camera')} Tomar foto</button>
    <button type="button" class="button button-outline" data-action="choose-image">${icon('upload')} Cargar foto</button></div>
    <input type="file" id="camera-file" accept="image/*" capture="environment" hidden>
    <input type="file" id="scan-file" accept="image/*" hidden>
    <button type="button" class="text-button" data-action="sample">Probar con un plato de ejemplo</button>
    <p class="helper">El reconocimiento usa un catálogo limitado y analiza la foto en tu navegador. La primera descarga requiere internet.</p>
  </div><img id="scan-preview" alt="Foto del plato seleccionado" hidden>
  <button type="button" id="analyze-photo" class="button button-outline" data-action="analyze" hidden>Reconocer alimentos</button>
  <p id="scan-status" class="helper" role="status" hidden></p><div id="scan-matches" class="stack-actions" hidden></div>` : '';
  const defaultPeriod = new Date().getHours() < 11 ? 'Desayuno' : new Date().getHours() < 16 ? 'Almuerzo' : 'Cena';
  openDialog(mode, mode === 'scan' ? 'Escáner de alimentos' : 'Registrar comida', mode === 'scan' ? 'Revisa las sugerencias y escribe los gramos de cada alimento que quieras registrar.' : 'Selecciona alimentos y escribe el peso de cada porción.', `${scanMarkup}
    <form id="meal-form" class="form-stack"><label class="field">Nombre de la comida<input name="name" maxlength="70" placeholder="Ej. Arepa con huevo" required></label>
    <div class="fields"><label class="field">Comida<select name="period">${periods.map(period => `<option${period === defaultPeriod ? ' selected' : ''}>${period}</option>`).join('')}</select></label><label class="field">Fecha<input type="date" name="date" value="${view === 'diario' ? journalDay : localDate()}" required></label></div>
    <div class="ingredient-list" id="ingredients"></div>
    <button class="text-button" type="button" data-action="add-food">${icon('plus')} Agregar alimento</button>
    <p class="helper">Incluye aceites, salsas y otros ingredientes que conozcas. Para un alimento fuera del catálogo puedes usar su etiqueta nutricional.</p>
    </form>`, `<div class="scan-totals" aria-live="polite"><strong id="scan-kcal">≈ 0 kcal</strong><small id="scan-macros">0 g proteína · 0 g carbohidratos · 0 g grasa</small></div>
    <button type="submit" form="meal-form" class="button button-primary" id="save-meal" disabled>Guardar comida</button>`);
  if (mode === 'manual') addFood();
}

function addFood(id = '', grams = '') {
  const index = composer.rows.length;
  composer.rows.push({id, grams, customName: '', kcal: '', protein: '', carbs: '', fat: '', active: true});
  const list = document.querySelector('#ingredients');
  list.insertAdjacentHTML('beforeend', `<div class="ingredient" data-index="${index}"><div class="ingredient-row">
    <select aria-label="Alimento ${index + 1}" data-field="id" required><option value="">Elegir alimento</option>${foods.map(food => `<option value="${food.id}"${food.id === id ? ' selected' : ''}>${food.name}</option>`).join('')}<option value="custom">Otro alimento (etiqueta)</option></select>
    <label class="field"><input aria-label="Peso en gramos del alimento ${index + 1}" placeholder="Peso" data-field="grams" type="number" min="0.1" max="3000" step="0.1" value="${grams}" required><span>g</span></label>
    <button type="button" class="icon-button" data-action="remove-food" data-index="${index}" aria-label="Quitar alimento ${index + 1}">${icon('x')}</button>
  </div><div class="custom-food" hidden>${[['customName', 'Alimento (nombre)'], ['kcal', 'kcal por 100 g'], ['protein', 'Proteína por 100 g'], ['carbs', 'Carbohidratos por 100 g'], ['fat', 'Grasa por 100 g']].map(([key, name]) => `<label class="field">${name}<input data-field="${key}" type="${key === 'customName' ? 'text" maxlength="50' : `number" min="0" max="${key === 'kcal' ? 1000 : 100}" step="0.1`}" disabled required></label>`).join('')}</div></div>`);
  drawIcons(list);
  renderMealEstimate();
}

function setPhoto(url, file) {
  if (composer.photo && composer.image) URL.revokeObjectURL(composer.image);
  composer.image = url;
  composer.photo = file;
  const preview = document.querySelector('#scan-preview');
  document.querySelector('.scan-upload').classList.add('has-photo');
  preview.src = url;
  preview.hidden = false;
  const recognize = document.querySelector('#analyze-photo');
  recognize.hidden = !file;
  recognize.disabled = false;
}

function renderScanStatus(message, matches = []) {
  const status = document.querySelector('#scan-status');
  const options = document.querySelector('#scan-matches');
  status.hidden = !message;
  status.textContent = message;
  options.hidden = !matches.length;
  options.innerHTML = matches.map(id => `<button type="button" class="button button-outline" data-action="match" data-id="${id}">${icon('plus')} ${foods.find(food => food.id === id).name}</button>`).join('');
  drawIcons(options);
}

function loadSample() {
  composer.sample = true;
  composer.rows = [];
  composer.analyzing = false;
  document.querySelector('#ingredients').replaceChildren();
  setPhoto('assets/bowl-stricto.jpg', null);
  document.querySelector('#meal-form').elements.name.value = 'Bowl de pollo y aguacate';
  document.querySelector('#meal-form').elements.period.value = 'Almuerzo';
  for (const [id, grams] of examplePlate) addFood(id, grams);
  renderScanStatus('Ejemplo con ingredientes precargados. Cambia los gramos para ver cómo varía el cálculo.');
}

function loadPhoto(file) {
  if (!file) return;
  if (file.type && !file.type.startsWith('image/')) {
    renderScanStatus('Selecciona un archivo de imagen, como JPG, PNG o WebP.');
    return;
  }
  if (file.size > 20 * 1024 * 1024) {
    renderScanStatus('Selecciona una imagen de hasta 20 MB.');
    return;
  }
  if (composer.sample) {
    composer.rows = [];
    document.querySelector('#ingredients').replaceChildren();
    document.querySelector('#meal-form').elements.name.value = '';
    renderMealEstimate();
  }
  composer.sample = false;
  composer.analyzing = false;
  setPhoto(URL.createObjectURL(file), file);
  renderScanStatus('Foto lista. Puedes reconocer alimentos o agregarlos manualmente.');
}

function scanWithWorker(file, candidates, report) {
  if (location.protocol === 'file:' || typeof Worker === 'undefined') return analyzeFoodPhoto(file, candidates, report);
  visionWorker ??= new Worker('vision.js');
  const worker = visionWorker;
  const id = ++scanRequestId;
  return new Promise((resolve, reject) => {
    function cleanup() {
      worker.removeEventListener('message', receive);
      worker.removeEventListener('error', fail);
    }
    function receive({data}) {
      if (data.id !== id) return;
      if (data.progress) {
        report(data.progress);
        return;
      }
      cleanup();
      if (data.error) reject(new Error(data.error));
      else resolve(data.result);
    }
    function fail(error) {
      cleanup();
      worker.terminate();
      visionWorker = undefined;
      reject(error);
    }
    worker.addEventListener('message', receive);
    worker.addEventListener('error', fail);
    worker.postMessage({id, blob: file, candidates});
  });
}

async function recognizePhoto() {
  const current = composer;
  const file = current.photo;
  if (!file || current.analyzing) return;
  current.analyzing = true;
  const stillOpen = () => dialog.open && composer === current && current.photo === file;
  const button = document.querySelector('#analyze-photo');
  button.disabled = true;
  const candidates = foods.filter(food => food.visual).map(({id, visual}) => ({id, visual}));
  try {
    const matches = await scanWithWorker(file, candidates, progress => {
      if (stillOpen()) renderScanStatus(progress);
    });
    if (stillOpen()) {
      renderScanStatus(matches.length ? 'Posibles alimentos. Selecciona los que estén realmente en tu plato y añade los gramos.' : 'El modelo no encontró candidatos claros. Puedes agregar los alimentos manualmente.', matches);
    }
  } catch (error) {
    console.warn('Reconocimiento de alimentos:', error);
    if (stillOpen()) renderScanStatus('El análisis no se pudo ejecutar. Comprueba la conexión y vuelve a intentar, o agrega los alimentos manualmente.');
  } finally {
    if (stillOpen()) {
      current.analyzing = false;
      button.disabled = false;
    }
  }
}

function completeRows() {
  return composer.rows.filter(row => row.active && row.id && Number(row.grams) > 0 && (row.id !== 'custom' || (row.customName.trim() && ['kcal', 'protein', 'carbs', 'fat'].every(key => row[key] !== ''))));
}

function ingredientData(row) {
  if (row.id === 'custom') return {...row, name: row.customName.trim()};
  return foods.find(food => food.id === row.id);
}

function renderMealEstimate() {
  const complete = completeRows();
  const ingredients = complete.map(row => {
    const food = ingredientData(row);
    const scale = Number(row.grams) / 100;
    return {name: food.name, grams: Number(row.grams), kcal: food.kcal * scale, protein: food.protein * scale, carbs: food.carbs * scale, fat: food.fat * scale};
  });
  const total = totals(ingredients);
  document.querySelector('#scan-kcal').textContent = `≈ ${number(total.kcal)} kcal`;
  document.querySelector('#scan-macros').textContent = `${number(total.protein, 1)} g proteína · ${number(total.carbs, 1)} g carbohidratos · ${number(total.fat, 1)} g grasa`;
  document.querySelector('#save-meal').disabled = complete.length === 0;
  return {total, ingredients};
}

function showMeal(id) {
  const meal = mealsFor(journalDay).find(item => item.id === id);
  if (!meal) return;
  const details = meal.ingredients ? `<ul class="details-list">${meal.ingredients.map(item => `<li>${escapeHtml(item.name)} · ${number(item.grams, 1)} g · ${number(item.kcal)} kcal</li>`).join('')}</ul>` : '<p class="helper">Comida de la vista de ejemplo.</p>';
  openDialog('meal', escapeHtml(meal.name), `${meal.period} · ${showTime(meal.time)}`, `<div><div class="scan-totals"><strong>≈ ${number(meal.kcal)} kcal</strong><small>${number(meal.protein, 1)} g proteína · ${number(meal.carbs, 1)} g carbohidratos · ${number(meal.fat, 1)} g grasa</small></div>${details}</div>
    ${meal.ingredients ? `<div><button type="button" class="button button-outline" data-action="confirm-delete-meal" data-id="${meal.id}">${icon('trash')} Eliminar comida</button></div>` : ''}`);
}

const actionHandlers = {
  scan: () => newComposer('scan'),
  manual: () => newComposer('manual'),
  designs: openDesigns,
  profiles: openProfilePicker,
  'new-profile': openCreateProfile,
  'switch-profile': button => activateProfile(button.dataset.id),
  personal: openPersonal,
  recipe: button => showDietRecipe(button.dataset.id, button.hasAttribute('data-plan-recipe')),
  'diet-catalog-page': button => stepDietCatalog(Number(button.dataset.step)),
  'show-diet-section': button => showDietSection(button.getAttribute('aria-controls')),
  'download-profile': downloadDietProfile,
  'download-plan-pdf': downloadDietPlanPDF,
  'apply-diet-fast': applyDietFasting,
  sources: openSources,
  'close-dialog': () => dialog.close(),
  'enter-personal': () => {
    leaveDemo();
    saveState();
    dialog.close();
    renderPage();
    tell('Tu espacio está listo.');
  },
  theme: button => {
    state.theme = button.dataset.id;
    applyTheme();
    saveState();
    dialog.close();
    tell(`Aplicaste el diseño ${designs[state.theme][0]}.`);
  },
  'start-fast': () => {
    if (!state.allowFasting || !state.duration || state.fast || fastingSafety(state.profile)) return;
    const started = Date.now();
    state.fast = {started, ends: started + state.duration * hour};
    saveState();
    renderPage();
    tell('Temporizador iniciado.');
  },
  'stop-fast': () => {
    if (!state.fast) return;
    const now = Date.now();
    endFast(Math.min(now, state.fast.ends), now >= state.fast.ends);
    renderPage();
    tell('Ayuno registrado.');
  },
  'take-photo': () => document.querySelector('#camera-file').click(),
  'choose-image': () => document.querySelector('#scan-file').click(),
  'add-food': () => {
    addFood();
    document.querySelector('#ingredients .ingredient:last-child select').focus();
  },
  'remove-food': button => {
    composer.rows[Number(button.dataset.index)].active = false;
    button.closest('.ingredient').remove();
    renderMealEstimate();
  },
  sample: loadSample,
  analyze: recognizePhoto,
  match: button => {
    if (!composer.rows.some(row => row.active && row.id === button.dataset.id)) addFood(button.dataset.id);
    document.querySelector(`#ingredients select option[value="${button.dataset.id}"]:checked`)?.closest('.ingredient')?.querySelector('[data-field="grams"]')?.focus();
  },
  'meal-details': button => showMeal(button.dataset.id),
  'confirm-delete-meal': button => openDialog('delete', '¿Eliminar esta comida?', 'Se quitará del diario y del resumen de ese día.', `<div class="stack-actions"><button type="button" class="button button-danger" data-action="delete-meal" data-id="${button.dataset.id}">Eliminar comida</button><button type="button" class="button button-outline" data-action="meal-details" data-id="${button.dataset.id}">Cancelar</button></div>`),
  'delete-meal': button => {
    state.meals = state.meals.filter(item => item.id !== button.dataset.id);
    saveState();
    dialog.close();
    renderPage();
    tell('Comida eliminada.');
  },
};

document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (button && !button.disabled) actionHandlers[button.dataset.action]?.(button);
});

document.addEventListener('input', event => {
  const element = event.target;
  if (element.name === 'query' && element.closest('#diet-catalog-filters')) updateDietCatalogFilter(element);
  if (element.closest('#fast-form') && ['start', 'duration'].includes(element.name)) updateSchedulePreview();
  if (!composer || !element.dataset.field) return;
  const container = element.closest('.ingredient');
  const row = composer.rows[Number(container.dataset.index)];
  row[element.dataset.field] = element.value;
  if (element.dataset.field === 'id') {
    const fields = container.querySelector('.custom-food');
    fields.hidden = element.value !== 'custom';
    for (const input of fields.querySelectorAll('input')) input.disabled = fields.hidden;
  }
  if (element.dataset.field === 'customName') element.setCustomValidity(element.value.trim() ? '' : 'Escribe un nombre para el alimento.');
  renderMealEstimate();
});

document.addEventListener('change', event => {
  const input = event.target;
  if (input.form?.id === 'profile-form' && input.name === 'mealSchedule') {
    document.querySelector('#profile-dinner-time').hidden = input.value === 'twoEarly';
  }
  if (input.matches('#diet-catalog-filters select')) updateDietCatalogFilter(input);
  if (input.id === 'diet-recipe-goal') updateDietRecipePortions(input);
  if (input.id === 'journal-day' && input.value) {
    journalDay = input.value;
    renderJournal();
    drawIcons();
  }
  if (input.id === 'scan-file' || input.id === 'camera-file') {
    loadPhoto(input.files[0]);
    input.value = '';
  }
});

const formHandlers = {
  'fast-form': ({duration, start, ready}) => {
    const hours = Number(duration.value);
    if (hours && (!ready.checked || fastingSafety(state.profile))) return;
    leaveDemo();
    state.duration = hours;
    state.fastStart = start.value;
    state.allowFasting = ready.checked;
    if (!hours && state.fast) endFast(Math.min(Date.now(), state.fast.ends), Date.now() >= state.fast.ends);
    tell('Horario guardado.');
  },
  'targets-form': elements => {
    leaveDemo();
    for (const key of Object.keys(state.targets)) state.targets[key] = elements[key].value;
    tell('Metas guardadas.');
  },
  'profile-form': saveDietProfile,
  'new-profile-form': createProfile,
  'meal-form': ({name, period, date}) => {
    const {total, ingredients} = renderMealEstimate();
    name.setCustomValidity(name.value.trim() ? '' : 'Escribe un nombre para la comida.');
    if (!ingredients.length || !name.reportValidity()) return;
    leaveDemo();
    const mealIcon = {Desayuno: 'coffee', Colación: 'apple'}[period.value] ?? 'bowl';
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    state.meals.push({id, name: name.value.trim(), period: period.value, date: date.value, time: localTime(), ...total, ingredients, icon: mealIcon});
    journalDay = date.value;
    dialog.close();
    tell('Comida guardada en tu diario.');
  },
};

document.addEventListener('submit', event => {
  const form = event.target;
  if (!(form.id in formHandlers)) return;
  event.preventDefault();
  formHandlers[form.id](form.elements);
  saveState();
  if (form.id !== 'meal-form' || !dialog.open) renderPage();
});

dialog.addEventListener('input', ({target}) => {
  if (target.name === 'name') target.setCustomValidity('');
});

dialog.addEventListener('close', () => {
  if (dialog.open) return;
  if (composer?.photo && composer.image) URL.revokeObjectURL(composer.image);
  composer = null;
});

window.addEventListener('hashchange', () => {
  if (workspaceOpen) showRoute();
});
setInterval(() => {
  if (workspaceOpen) updateClock();
}, 1000);

if (navigator.serviceWorker && window.isSecureContext && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./service-worker.js').catch(error => {
    console.warn('Modo sin conexión de Stricto:', error);
  });
}
