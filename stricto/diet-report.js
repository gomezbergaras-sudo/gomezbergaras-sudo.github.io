function reportTimeRange(start, hours) {
  const end = addHours(start, hours);
  const nextDay = atMinutes(end) < atMinutes(start) ? ' del día siguiente' : '';
  return `${showTime(start)} a ${showTime(end)}${nextDay}`;
}

function fastingReportRows(plan, savedSchedule) {
  const rows = [plan.status, plan.reason];
  if (plan.hours) {
    rows.push(`Ayuno: ${reportTimeRange(plan.start, plan.hours)}`);
    rows.push(`Comidas: ${reportTimeRange(addHours(plan.start, plan.hours), 24 - plan.hours)}`);
  }
  if (savedSchedule && (plan.hours !== savedSchedule.hours || plan.start !== savedSchedule.start)) {
    const {start, hours} = savedSchedule;
    rows.push(`Horario guardado en Ayuno (${hours} h): ${reportTimeRange(start, hours)}`);
    rows.push(`Comidas en el horario guardado: ${reportTimeRange(addHours(start, hours), 24 - hours)}`);
  }
  return rows;
}

function buildDietPlanPDF({name, date, goal, preference, plan, savedSchedule}) {
  const {jsPDF} = globalThis.jspdf;
  const pdf = new jsPDF({unit: 'mm', format: 'a4', compress: true, putOnlyUsedFonts: true});
  const margin = 16;
  const width = pdf.internal.pageSize.getWidth() - 2 * margin;
  const height = pdf.internal.pageSize.getHeight();
  const ink = '#211825';
  const plum = '#522645';
  const muted = '#635866';
  const portionGoal = plan.tailored ? goal : 'general';
  let y = margin;

  function font(size, weight = 'normal', color = ink) {
    pdf.setFont('helvetica', weight);
    pdf.setFontSize(size);
    pdf.setTextColor(color);
  }

  function pageHeader(continuation = false) {
    pdf.setFillColor(plum);
    pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), 5, 'F');
    font(12, 'bold', plum);
    pdf.text('STRICTO', margin, y);
    font(10, 'normal', muted);
    pdf.text(date, margin + width, y, {align: 'right'});
    y += 11;
    font(continuation ? 16 : 24, 'bold');
    pdf.text(continuation ? 'Menú de un día · continuación' : 'Menú y ventana de ayuno', margin, y);
    y += 8;
  }

  function writeLines(lines, x, leading = 4.4) {
    for (const line of lines) {
      pdf.text(line, x, y);
      y += leading;
    }
  }

  function ensureRoom(needed) {
    if (y + needed <= height - 23) return;
    pdf.addPage();
    y = margin;
    pageHeader(true);
  }

  pdf.setProperties({title: 'Stricto - Menú y ventana de ayuno', creator: 'Stricto'});
  pageHeader();
  font(11);
  const printableName = name.replace(/[^\u0020-\u007e\u00a0-\u00ff]/gu, '').trim() || 'Perfil';
  writeLines(pdf.splitTextToSize(`${printableName} · ${goalOptions[goal].name} · ${preference}`, width), margin);
  font(9, 'normal', muted);
  writeLines(pdf.splitTextToSize(plan.tailored
    ? 'Gramajes orientativos por porción para el objetivo elegido.'
    : 'Gramajes orientativos por porción. Completa tu perfil para obtener opciones según tu objetivo.', width), margin);
  y += 5;

  const fastingRows = fastingReportRows(plan.fasting, savedSchedule);
  font(10);
  const fastingLines = fastingRows.flatMap(line => pdf.splitTextToSize(line, width - 12));
  pdf.setFillColor('#f7edf4');
  pdf.roundedRect(margin, y - 4, width, 12 + fastingLines.length * 4.6, 3, 3, 'F');
  font(12, 'bold', plum);
  pdf.text('Ventanas de ayuno y comida', margin + 6, y + 2);
  y += 8;
  font(10);
  writeLines(fastingLines, margin + 6, 4.6);
  y += 9;

  for (const meal of plan.meals) {
    font(12, 'bold');
    const titles = pdf.splitTextToSize(meal.name, width);
    font(9, 'normal', muted);
    const method = pdf.splitTextToSize(meal.method, width);
    const ingredients = portionIngredients(meal, portionGoal);
    ensureRoom(12 + titles.length * 5.2 + ingredients.length * 5.2 + method.length * 4.1);
    pdf.setDrawColor('#e3d5df');
    pdf.line(margin, y - 4, margin + width, y - 4);
    font(9, 'bold', plum);
    pdf.text(meal.period.toLocaleUpperCase('es'), margin, y);
    y += 5.4;
    font(12, 'bold');
    writeLines(titles, margin, 5.2);
    font(10);
    for (const ingredient of ingredients) {
      pdf.text(ingredient.name, margin + 2, y);
      pdf.text(`${number(ingredient.grams)} g`, margin + width, y, {align: 'right'});
      y += 5.2;
    }
    y += 1;
    font(9, 'normal', muted);
    writeLines(method, margin, 4.1);
    y += 6;
  }

  const pageCount = pdf.getNumberOfPages();
  for (let page = 1; page <= pageCount; page++) {
    pdf.setPage(page);
    font(9, 'normal', muted);
    pdf.text('Stricto · Plan de comidas', margin, height - 11);
    pdf.text(`${page} / ${pageCount}`, margin + width, height - 11, {align: 'right'});
  }
  return pdf;
}

function downloadDietPlanPDF() {
  const plan = currentDietPlan();
  const savedSchedule = state.allowFasting && state.duration && !state.demo && !fastingSafety(state.profile)
    ? {start: state.fastStart, hours: state.duration} : null;
  const name = profileDisplayName(activeProfileId, state);
  const date = localDate();
  try {
    const pdf = buildDietPlanPDF({name, date, goal: state.goal, preference: preferences[state.foodPreference], plan, savedSchedule});
    const slug = dietSearchWords(name).join('-') || 'perfil';
    pdf.save(`stricto-plan-${slug}-${date}.pdf`);
  } catch (error) {
    console.warn('Descarga de plan PDF:', error);
    tell('No se pudo descargar el plan. Vuelve a intentarlo.');
  }
}
