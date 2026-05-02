const PASSWORD_ICONS = {
  hidden: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  visible: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
};

const SOCIAL_PROVIDERS = ['Google', 'Apple'];
const USER_STORAGE_KEY = 'nexaUser';

const translations = {
  es: {
    langLabel: 'EN',
    panel: {
      headline: 'Conecta sin presión social',
      desc: 'Descubre planes auténticos, filtra por tu personalidad y sal al mundo a tu propio ritmo.',
      f1: 'Lugares verificados y seguros',
      f2: '100% alineado a tu personalidad',
      f3: 'Sin ansiedad social, sin presión'
    },
    form: {
      title: 'Bienvenido de nuevo',
      sub: 'Ingresa tus datos para continuar'
    },
    tab: {
      login: 'Iniciar sesión',
      register: 'Registrarse'
    },
    label: {
      email: 'Correo electrónico',
      password: 'Contraseña',
      forgot: '¿Olvidaste tu contraseña?',
      name: 'Nombre completo',
      terms: 'Acepto los',
      tos: 'Términos de uso',
      and: 'y la',
      privacy: 'Política de privacidad'
    },
    placeholder: {
      email: 'tu@correo.com',
      password: 'Ingresa tu contraseña',
      name: 'Tu nombre completo',
      newpass: 'Crea una contraseña segura'
    },
    btn: {
      login: 'Entrar',
      register: 'Crear cuenta'
    },
    divider: 'o continúa con',
    dividerRegister: 'o regístrate con',
    strength: {
      empty: '',
      weak: 'Muy débil',
      fair: 'Débil',
      good: 'Buena',
      strong: 'Excelente'
    },
    toast: {
      invalidEmail: 'Ingresa un correo válido',
      shortPasswordLogin: 'La contraseña es muy corta',
      shortPasswordRegister: 'La contraseña debe tener mínimo 8 caracteres',
      missingName: 'Ingresa tu nombre',
      acceptTerms: 'Acepta los términos para continuar',
      welcomeBack: 'Bienvenido de vuelta',
      accountCreated: 'Cuenta creada con éxito',
      social: 'Conectando con {provider}...'
    }
  },
  en: {
    langLabel: 'ES',
    panel: {
      headline: 'Connect without social pressure',
      desc: 'Discover authentic plans, filter by your personality, and go out at your own pace.',
      f1: 'Verified and safe places',
      f2: '100% aligned with your personality',
      f3: 'No social anxiety, no pressure'
    },
    form: {
      title: 'Welcome back',
      sub: 'Enter your details to continue'
    },
    tab: {
      login: 'Log in',
      register: 'Sign up'
    },
    label: {
      email: 'Email address',
      password: 'Password',
      forgot: 'Forgot your password?',
      name: 'Full name',
      terms: 'I agree to the',
      tos: 'Terms of Use',
      and: 'and the',
      privacy: 'Privacy Policy'
    },
    placeholder: {
      email: 'you@email.com',
      password: 'Enter your password',
      name: 'Your full name',
      newpass: 'Create a secure password'
    },
    btn: {
      login: 'Enter',
      register: 'Create account'
    },
    divider: 'or continue with',
    dividerRegister: 'or sign up with',
    strength: {
      empty: '',
      weak: 'Very weak',
      fair: 'Weak',
      good: 'Good',
      strong: 'Strong'
    },
    toast: {
      invalidEmail: 'Enter a valid email',
      shortPasswordLogin: 'Password is too short',
      shortPasswordRegister: 'Password must be at least 8 characters',
      missingName: 'Enter your name',
      acceptTerms: 'Accept the terms to continue',
      welcomeBack: 'Welcome back',
      accountCreated: 'Account created successfully',
      social: 'Connecting with {provider}...'
    }
  }
};

const state = {
  lang: 'es',
  submitInProgress: false
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function t(path) {
  return path.split('.').reduce((acc, key) => acc?.[key], translations[state.lang]) ?? path;
}

function formatMessage(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

function applyTranslations() {
  document.documentElement.lang = state.lang;
  $$('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  $$('[data-i18n-placeholder]').forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  $('#langLabel').textContent = translations[state.lang].langLabel;
}

function setLanguage(lang) {
  state.lang = translations[lang] ? lang : 'es';
  applyTranslations();
  updatePasswordStrength($('#regPass')?.value || '');
}

function detectLanguage() {
  const browserLang = (navigator.language || navigator.userLanguage || 'es').slice(0, 2).toLowerCase();
  return translations[browserLang] ? browserLang : 'es';
}

function switchTab(tab) {
  const isLogin = tab === 'login';
  $('#tabLogin').classList.toggle('active', isLogin);
  $('#tabRegister').classList.toggle('active', !isLogin);
  $('#tabLogin').setAttribute('aria-selected', String(isLogin));
  $('#tabRegister').setAttribute('aria-selected', String(!isLogin));
  $('#tabIndicator').classList.toggle('right', !isLogin);
  $('#formLogin').classList.toggle('hidden', !isLogin);
  $('#formRegister').classList.toggle('hidden', isLogin);
  restartAnimation(isLogin ? $('#formLogin') : $('#formRegister'));
}

function restartAnimation(element) {
  element.style.animation = 'none';
  requestAnimationFrame(() => {
    element.style.animation = 'fadeUp 0.35s ease both';
  });
}

function showToast(message, type = '') {
  const toast = $('#toast');
  toast.textContent = message;
  toast.className = `toast show${type ? ` ${type}` : ''}`;
  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => {
    toast.className = 'toast';
  }, 2400);
}

function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  button.innerHTML = isHidden ? PASSWORD_ICONS.visible : PASSWORD_ICONS.hidden;
  button.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
}

function updatePasswordStrength(value) {
  const fill = $('#sFill');
  const label = $('#sTxt');
  if (!fill || !label) return;

  if (!value) {
    fill.style.width = '0%';
    fill.style.background = 'transparent';
    label.textContent = t('strength.empty');
    label.style.color = '';
    return;
  }

  const score = [
    value.length >= 8,
    /[A-Z]/.test(value),
    /[0-9]/.test(value),
    /[^A-Za-z0-9]/.test(value)
  ].filter(Boolean).length;

  const levels = [
    { width: '25%', color: '#ef4444', key: 'weak' },
    { width: '50%', color: '#f59e0b', key: 'fair' },
    { width: '75%', color: '#3b82f6', key: 'good' },
    { width: '100%', color: '#10b981', key: 'strong' }
  ];
  const level = levels[Math.max(0, score - 1)];

  fill.style.width = level.width;
  fill.style.background = level.color;
  label.textContent = t(`strength.${level.key}`);
  label.style.color = level.color;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setLoading(btnId, loaderId, loading) {
  const button = document.getElementById(btnId);
  const loader = document.getElementById(loaderId);
  const text = $('.btn-text', button);
  if (!button || !loader || !text) return;

  button.disabled = loading;
  loader.classList.toggle('show', loading);
  text.style.opacity = loading ? '0.5' : '1';
}

function markError(inputId) {
  const input = document.getElementById(inputId);
  const wrap = input?.closest('.field-wrap');
  if (!wrap) return;

  wrap.classList.add('error');
  input.addEventListener('input', () => wrap.classList.remove('error'), { once: true });
}

function validateLogin() {
  const email = $('#loginEmail').value.trim();
  const password = $('#loginPass').value;

  if (!email || !isValidEmail(email)) {
    markError('loginEmail');
    return t('toast.invalidEmail');
  }
  if (!password || password.length < 6) {
    markError('loginPass');
    return t('toast.shortPasswordLogin');
  }
  return '';
}

function validateRegister() {
  const name = $('#regName').value.trim();
  const email = $('#regEmail').value.trim();
  const password = $('#regPass').value;
  const termsAccepted = $('#termsCheck').checked;

  if (!name) {
    markError('regName');
    return t('toast.missingName');
  }
  if (!email || !isValidEmail(email)) {
    markError('regEmail');
    return t('toast.invalidEmail');
  }
  if (!password || password.length < 8) {
    markError('regPass');
    return t('toast.shortPasswordRegister');
  }
  if (!termsAccepted) {
    return t('toast.acceptTerms');
  }
  return '';
}

function getFirstName(name) {
  return name.trim().split(/\s+/)[0] || 'Usuario';
}

function getNameFromEmail(email) {
  const rawName = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  return rawName ? rawName.replace(/\b\w/g, (char) => char.toUpperCase()) : 'Usuario';
}

function saveUserFromForm(type) {
  const isRegister = type === 'register';
  const email = (isRegister ? $('#regEmail') : $('#loginEmail')).value.trim();
  const existingUser = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
  const fullName = isRegister ? $('#regName').value.trim() : existingUser.fullName || getNameFromEmail(email);

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({
    name: isRegister ? getFirstName(fullName) : existingUser.name || getFirstName(fullName),
    fullName,
    email
  }));
}

function submitForm(config) {
  if (state.submitInProgress) return;
  state.submitInProgress = true;

  const error = config.validate();
  if (error) {
    state.submitInProgress = false;
    showToast(error, 'error');
    return;
  }

  saveUserFromForm(config.type);
  setLoading(config.buttonId, config.loaderId, true);
  setTimeout(() => {
    setLoading(config.buttonId, config.loaderId, false);
    state.submitInProgress = false;
    showToast(t(config.successKey), 'success');
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 900);
  }, 900);
}

function socialAuth(provider) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({
    name: provider,
    fullName: `${provider} User`,
    email: `${provider.toLowerCase()}@nexa.local`
  }));
  showToast(formatMessage(t('toast.social'), { provider }));
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 900);
}

function renderSocialButtons() {
  const icons = {
    Google: '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>',
    Apple: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>'
  };

  $$('[data-social-buttons]').forEach((container) => {
    container.innerHTML = SOCIAL_PROVIDERS.map((provider) => (
      `<button class="btn-social" type="button" data-social-provider="${provider}">${icons[provider]}${provider}</button>`
    )).join('');
  });
}

function bindEvents() {
  $('#langBtn').addEventListener('click', () => setLanguage(state.lang === 'es' ? 'en' : 'es'));
  $$('[data-tab]').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });
  $$('[data-password-toggle]').forEach((button) => {
    button.addEventListener('click', () => togglePassword(button.dataset.passwordToggle, button));
  });
  $('#regPass').addEventListener('input', (event) => updatePasswordStrength(event.target.value));
  $('#formLogin').addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm({
      type: 'login',
      validate: validateLogin,
      buttonId: 'btnLogin',
      loaderId: 'loginLoader',
      successKey: 'toast.welcomeBack'
    });
  });
  $('#formRegister').addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm({
      type: 'register',
      validate: validateRegister,
      buttonId: 'btnRegister',
      loaderId: 'registerLoader',
      successKey: 'toast.accountCreated'
    });
  });
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-social-provider]');
    if (button) socialAuth(button.dataset.socialProvider);
  });
}

function init() {
  renderSocialButtons();
  bindEvents();
  setLanguage(detectLanguage());
  switchTab('login');
}

document.addEventListener('DOMContentLoaded', init);
