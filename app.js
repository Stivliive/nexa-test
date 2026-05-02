const STORAGE_KEYS = {
  user: 'nexaUser',
  customPlans: 'nexaCustomPlans',
  joinedPlans: 'nexaJoinedPlans'
};

const recommendedPlan = {
  title: 'Picnic y recreatividad en bosque popular el prado',
  place: 'Bosque Popular El Prado',
  time: 'Hoy, 3:30 PM',
  category: 'Naturaleza',
  description: 'Un encuentro tranquilo al aire libre para conversar, leer y compartir snacks.',
  bg: 'linear-gradient(135deg, #1f7a5f, #5430a8)'
};

const basePlans = [
  {
    title: 'Tarde cultural en Plaza de Bolívar',
    place: 'Plaza de Bolívar',
    time: '4:00 PM',
    category: 'Lectura',
    description: 'Recorrido suave por el centro con conversación y lectura breve.',
    bg: 'linear-gradient(135deg, #7c3aed, #c4b5fd)'
  },
  {
    title: 'Caminata suave por Parque Caldas',
    place: 'Parque Caldas',
    time: '5:30 PM',
    category: 'Naturaleza',
    description: 'Caminar sin prisa, tomar aire y conectar con personas afines.',
    bg: 'linear-gradient(135deg, #10b981, #a7f3d0)'
  },
  {
    title: 'Café y lectura cerca del Cable',
    place: 'Sector El Cable',
    time: '6:00 PM',
    category: 'Lectura',
    description: 'Un plan pequeño para leer, comentar libros y tomar café.',
    bg: 'linear-gradient(135deg, #f59e0b, #fde68a)'
  },
  {
    title: 'Película tranquila con grupo pequeño',
    place: 'Fundadores',
    time: '7:15 PM',
    category: 'Peliculas',
    description: 'Cine y conversación corta después de la función.',
    bg: 'linear-gradient(135deg, #3b82f6, #bfdbfe)'
  }
];

const legalContent = {
  terms: {
    title: 'Términos de uso',
    eyebrow: 'Uso responsable',
    paragraphs: [
      'Nexa es una experiencia local para descubrir y organizar planes sociales. Los planes creados en esta versión se guardan en este navegador.',
      'Al usar Nexa aceptas publicar solo información verdadera, respetuosa y segura. No compartas datos sensibles, direcciones privadas ni contenido ofensivo.',
      'Puedes unirte o salir de una actividad en cualquier momento. En esta versión inicial no hay pagos, reservas externas ni verificación real de asistencia.'
    ]
  },
  privacy: {
    title: 'Política de privacidad',
    eyebrow: 'Datos locales',
    paragraphs: [
      'Tu nombre, correo, usuario, personalidad, foto de perfil y actividades se guardan localmente en este navegador mediante localStorage.',
      'La foto de perfil no se sube a ningún servidor; queda almacenada como dato local del navegador que estás usando.',
      'Puedes cambiar tus datos desde Perfil. Para borrar todo, limpia los datos del sitio en el navegador o avísame y agregamos un botón de borrar cuenta.'
    ]
  }
};

const state = {
  category: 'Todos',
  query: '',
  joinedPlans: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.joinedPlans) || '[]')),
  plans: [...JSON.parse(localStorage.getItem(STORAGE_KEYS.customPlans) || '[]'), ...basePlans]
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function getUser() {
  const fallback = {
    name: 'Usuario',
    fullName: 'Usuario',
    username: '',
    email: '',
    personality: 'tranquilo',
    photo: ''
  };
  const saved = { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || '{}') };
  if (!saved.username) {
    saved.username = `@${(saved.name || saved.fullName || 'usuario').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w]+/g, '')}`;
  }
  return saved;
}

function saveUser(user) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

function getAllPlans() {
  return [recommendedPlan, ...state.plans];
}

function getInitialsSource(user) {
  return user.name || user.fullName || user.username?.replace('@', '') || 'U';
}

function renderAvatar(target, user) {
  target.innerHTML = '';
  if (user.photo) {
    const image = document.createElement('img');
    image.src = user.photo;
    image.alt = '';
    target.appendChild(image);
    return;
  }
  target.textContent = getInitialsSource(user).slice(0, 1).toUpperCase();
}

function setUserHeader() {
  const user = getUser();
  $('#userGreeting').textContent = `Hola, ${user.name || 'Usuario'}`;
  renderAvatar($('#userAvatar'), user);
}

function fillProfileForm() {
  const user = getUser();
  $('#profileDisplayName').textContent = user.username || user.fullName || user.name;
  $('#profileFullName').value = user.fullName || '';
  $('#profileUsername').value = user.username || '';
  $('#profileEmail').value = user.email || '';
  $('#profilePersonality').value = user.personality || 'tranquilo';
  $('#profilePhotoInitial').textContent = getInitialsSource(user).slice(0, 1).toUpperCase();
  $('#profilePhotoPreview').hidden = !user.photo;
  $('#profilePhotoInitial').hidden = Boolean(user.photo);
  if (user.photo) $('#profilePhotoPreview').src = user.photo;
}

function showToast(message) {
  const toast = $('#appToast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function planMatches(plan) {
  const query = state.query.toLowerCase();
  const matchesCategory = state.category === 'Todos' || plan.category === state.category;
  const searchable = `${plan.title} ${plan.place} ${plan.category} ${plan.description || ''}`.toLowerCase();
  return matchesCategory && (!query || searchable.includes(query));
}

function isJoined(planTitle) {
  return state.joinedPlans.has(planTitle);
}

function renderHeroJoin() {
  const button = $('#heroJoinBtn');
  button.textContent = isJoined(recommendedPlan.title) ? 'Salir' : 'Unirse';
}

function renderPopularPlans() {
  const grid = $('#plansGrid');
  const filteredPlans = state.plans.filter(planMatches);

  grid.innerHTML = filteredPlans.map((plan) => {
    const joined = isJoined(plan.title);
    return `
      <article class="plan-card" data-plan-card data-category="${escapeHtml(plan.category)}" data-title="${escapeHtml(`${plan.title} ${plan.place}`)}">
        <div class="plan-card-media" style="--card-bg: ${escapeHtml(plan.bg)}"></div>
        <div class="plan-card-body">
          <h3>${escapeHtml(plan.title)}</h3>
          <p>${escapeHtml(plan.place)}</p>
          <div class="plan-card-footer">
            <span>${escapeHtml(plan.time)}</span>
            <button class="plan-link" type="button" data-plan-action="${escapeHtml(plan.title)}">${joined ? 'Salir' : 'Unirse'}</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  $('#emptyState').hidden = filteredPlans.length > 0;
  renderHeroJoin();
  renderJoinedActivities();
}

function renderJoinedActivities() {
  const list = $('#joinedList');
  if (!list) return;

  const joined = getAllPlans().filter((plan) => state.joinedPlans.has(plan.title));
  if (!joined.length) {
    list.innerHTML = '<p class="empty-state">Todavía no te has unido a ninguna actividad.</p>';
    return;
  }

  list.innerHTML = joined.map((plan) => `
    <div class="joined-item">
      <div>
        <h3>${escapeHtml(plan.title)}</h3>
        <p>${escapeHtml(plan.place)} · ${escapeHtml(plan.time)}</p>
      </div>
      <button class="leave-btn" type="button" data-leave-plan="${escapeHtml(plan.title)}">Salir</button>
    </div>
  `).join('');
}

function persistJoinedPlans() {
  localStorage.setItem(STORAGE_KEYS.joinedPlans, JSON.stringify([...state.joinedPlans]));
}

function togglePlan(planName) {
  if (state.joinedPlans.has(planName)) {
    state.joinedPlans.delete(planName);
    persistJoinedPlans();
    renderPopularPlans();
    showToast('Saliste de la actividad.');
    return;
  }

  state.joinedPlans.add(planName);
  persistJoinedPlans();
  renderPopularPlans();
  showToast(`Te uniste a "${planName}".`);
}

function leavePlan(planName) {
  state.joinedPlans.delete(planName);
  persistJoinedPlans();
  renderPopularPlans();
  showToast('Saliste de la actividad.');
}

function setCategory(category) {
  state.category = category;
  $$('.category-chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.category === category);
  });
  renderPopularPlans();
}

function showHomeSections(showProfile = false) {
  $('#profilePanel').hidden = !showProfile;
  $$('[data-section], [aria-labelledby="popularTitle"]').forEach((section) => {
    section.hidden = showProfile;
  });
  $('.recommended').hidden = showProfile;
}

function setNav(view) {
  $$('.nav-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.view === view);
  });

  if (view === 'profile') {
    fillProfileForm();
    renderJoinedActivities();
    showHomeSections(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  showHomeSections(false);

  if (view === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (view === 'explore') {
    $('#categoriesTitle').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  showToast('Mensajes estará disponible pronto.');
}

function openDialog(dialog) {
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
}

function closeDialog(dialog) {
  if (typeof dialog.close === 'function') {
    dialog.close();
  } else {
    dialog.removeAttribute('open');
  }
}

function openCreateModal() {
  openDialog($('#createModal'));
}

function closeCreateModal() {
  closeDialog($('#createModal'));
}

function saveCustomPlan(event) {
  event.preventDefault();
  const title = $('#planName').value.trim();
  const place = $('#planPlace').value.trim();
  const category = $('#planCategory').value;
  const time = $('#planTime').value.trim();
  const description = $('#planDescription').value.trim();

  if (!title || !place || !time || !description) {
    showToast('Completa todos los datos de la actividad.');
    return;
  }

  const customPlan = {
    title,
    place,
    category,
    time,
    description,
    bg: 'linear-gradient(135deg, #7c3aed, #42d7a5)'
  };
  const customPlans = JSON.parse(localStorage.getItem(STORAGE_KEYS.customPlans) || '[]');
  customPlans.unshift(customPlan);
  localStorage.setItem(STORAGE_KEYS.customPlans, JSON.stringify(customPlans));

  state.plans.unshift(customPlan);
  $('#createPlanForm').reset();
  closeCreateModal();
  setCategory('Todos');
  showToast('Actividad creada y agregada a populares.');
}

function saveProfile(event) {
  event.preventDefault();
  const current = getUser();
  const fullName = $('#profileFullName').value.trim() || 'Usuario';
  const username = $('#profileUsername').value.trim();
  const normalizedUsername = username ? (username.startsWith('@') ? username : `@${username}`) : '@usuario';
  const nextUser = {
    ...current,
    fullName,
    name: fullName.split(/\s+/)[0],
    username: normalizedUsername,
    email: $('#profileEmail').value.trim(),
    personality: $('#profilePersonality').value
  };

  saveUser(nextUser);
  setUserHeader();
  fillProfileForm();
  showToast('Perfil actualizado.');
}

function handleProfilePhoto(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const user = { ...getUser(), photo: reader.result };
    saveUser(user);
    setUserHeader();
    fillProfileForm();
    showToast('Foto de perfil actualizada.');
  });
  reader.readAsDataURL(file);
}

function openLegal(type) {
  const content = legalContent[type];
  $('#legalEyebrow').textContent = content.eyebrow;
  $('#legalTitle').textContent = content.title;
  $('#legalCopy').innerHTML = content.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
  openDialog($('#legalModal'));
}

function bindEvents() {
  $('#searchInput').addEventListener('input', (event) => {
    state.query = event.target.value.trim();
    renderPopularPlans();
  });

  $('#categoryRow').addEventListener('click', (event) => {
    const chip = event.target.closest('[data-category]');
    if (chip) setCategory(chip.dataset.category);
  });

  document.addEventListener('click', (event) => {
    const planAction = event.target.closest('[data-plan-action]');
    if (planAction) {
      togglePlan(planAction.dataset.planAction);
      return;
    }

    const leaveButton = event.target.closest('[data-leave-plan]');
    if (leaveButton) {
      leavePlan(leaveButton.dataset.leavePlan);
      return;
    }

    const legalButton = event.target.closest('[data-legal]');
    if (legalButton) {
      openLegal(legalButton.dataset.legal);
      return;
    }

    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'notifications') showToast('No tienes notificaciones nuevas.');
    if (action === 'profile') setNav('profile');
    if (action === 'home') setNav('home');
    if (action === 'show-all') {
      $('#searchInput').value = '';
      state.query = '';
      setCategory('Todos');
      showToast('Mostrando todos los planes.');
    }
    if (action === 'open-create') openCreateModal();
    if (action === 'close-create') closeCreateModal();
    if (action === 'close-legal') closeDialog($('#legalModal'));
    if (action === 'pick-photo') $('#profilePhotoInput').click();

    const navButton = event.target.closest('[data-view]');
    if (navButton) setNav(navButton.dataset.view);
  });

  $('#createPlanForm').addEventListener('submit', saveCustomPlan);
  $('#profileForm').addEventListener('submit', saveProfile);
  $('#profilePhotoInput').addEventListener('change', (event) => {
    handleProfilePhoto(event.target.files?.[0]);
  });
  $('#createModal').addEventListener('click', (event) => {
    if (event.target.id === 'createModal') closeCreateModal();
  });
  $('#legalModal').addEventListener('click', (event) => {
    if (event.target.id === 'legalModal') closeDialog($('#legalModal'));
  });
}

function init() {
  setUserHeader();
  fillProfileForm();
  renderPopularPlans();
  bindEvents();
}

document.addEventListener('DOMContentLoaded', init);
