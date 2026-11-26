const strictoAuthService = 'https://segtpwxfqpvfmzehtdlg.supabase.co';
const strictoPublishableKey = 'sb_publishable_siEMshNiKVGFKlGFL-ARrQ_YZojQT3V';
const strictoAuthRedirect = 'https://gomezbergaras-sudo.github.io/stricto/';
const strictoAuth = globalThis.supabase?.createClient(strictoAuthService, strictoPublishableKey, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: false,
    // GitHub Pages shares its origin with other sites from this owner.
    persistSession: false,
    autoRefreshToken: true,
  },
})?.auth;

const authScreen = document.querySelector('#stricto-auth');
const authForm = document.querySelector('#auth-form');
const authTitle = document.querySelector('#auth-title');
const authDescription = document.querySelector('#auth-description');
const authEmail = document.querySelector('#auth-email');
const authPassword = document.querySelector('#auth-password');
const authPasswordToggle = document.querySelector('#auth-password-toggle');
const authSubmit = document.querySelector('#auth-submit');
const authModeToggle = document.querySelector('#auth-mode-toggle');
const authResend = document.querySelector('#auth-resend');
const authFeedback = document.querySelector('#auth-feedback');
const authGuest = authScreen.querySelector('[data-auth-action="guest"]');
let authMode = 'signin';
let authBusy = false;
let authResendEmail = '';

function setAuthFeedback(message = '', kind = 'info', resendEmail = '') {
  authFeedback.textContent = message;
  authFeedback.dataset.kind = kind;
  authFeedback.hidden = !message;
  authResendEmail = resendEmail;
  authResend.hidden = !resendEmail;
}

function setPasswordVisibility(visible) {
  authPassword.type = visible ? 'text' : 'password';
  authPasswordToggle.textContent = visible ? 'Ocultar' : 'Mostrar';
  authPasswordToggle.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
  authPasswordToggle.setAttribute('aria-pressed', String(visible));
}

function setAuthMode(mode) {
  authMode = mode;
  const creating = mode === 'signup';
  authTitle.textContent = creating ? 'Crea tu cuenta' : 'Iniciar sesión';
  authDescription.textContent = creating ? 'Confirma tu correo para empezar a usar tu cuenta.' : 'Ingresa con tu correo y contraseña.';
  authSubmit.textContent = creating ? 'Registrarme' : 'Entrar';
  authModeToggle.textContent = creating ? 'Ya tengo cuenta' : 'Crear cuenta';
  authPassword.autocomplete = creating ? 'new-password' : 'current-password';
  if (creating) authPassword.minLength = 8;
  else authPassword.removeAttribute('minlength');
  authPassword.value = '';
  setPasswordVisibility(false);
  document.querySelector('#auth-password-hint').hidden = !creating;
  authPassword.setAttribute('aria-describedby', creating ? 'auth-password-hint' : '');
  setAuthFeedback();
}

function setAuthBusy(busy, label = '') {
  authBusy = busy;
  authForm.setAttribute('aria-busy', String(busy));
  authSubmit.disabled = busy || !strictoAuth;
  authModeToggle.disabled = busy || !strictoAuth;
  authResend.disabled = busy || !strictoAuth;
  authGuest.disabled = busy;
  authSubmit.textContent = label || (authMode === 'signup' ? 'Registrarme' : 'Entrar');
}

function authErrorMessage(error) {
  switch (error?.code) {
    case 'invalid_credentials': return 'Revisa el correo y la contraseña.';
    case 'email_not_confirmed': return 'Confirma tu correo antes de iniciar sesión.';
    case 'email_address_not_authorized': return 'El envío de confirmaciones todavía no está disponible para esta dirección.';
    case 'user_already_exists': return 'Prueba a iniciar sesión con ese correo o revisa tu bandeja de entrada.';
    case 'weak_password': return 'Usa una contraseña más larga y difícil de adivinar.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit': return 'Hay demasiados intentos. Espera un momento y vuelve a intentarlo.';
    case 'signup_disabled': return 'Los registros todavía no están habilitados.';
    case 'email_provider_disabled': return 'El ingreso con correo y contraseña todavía no está disponible.';
    default: return 'No se pudo completar la solicitud. Revisa tu conexión y vuelve a intentarlo.';
  }
}

function returnToStrictoLogin() {
  closeStrictoWorkspace();
  authForm.reset();
  setAuthMode('signin');
  authTitle.tabIndex = -1;
  authTitle.focus();
}

authForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (authBusy || !strictoAuth || !authForm.reportValidity()) return;
  const email = authEmail.value.trim();
  const password = authPassword.value;
  const creating = authMode === 'signup';
  setAuthFeedback();
  setAuthBusy(true, creating ? 'Creando cuenta…' : 'Ingresando…');
  try {
    const result = creating
      ? await strictoAuth.signUp({email, password, options: {emailRedirectTo: strictoAuthRedirect}})
      : await strictoAuth.signInWithPassword({email, password});
    if (result.error) {
      setAuthFeedback(authErrorMessage(result.error), 'error', result.error.code === 'email_not_confirmed' ? email : '');
    } else if (creating) {
      if (result.data.session) {
        await strictoAuth.signOut({scope: 'local'});
        setAuthFeedback('La confirmación por correo depende de la configuración del registro. Intenta más tarde.', 'error');
      } else {
        setAuthMode('signin');
        setAuthFeedback('Revisa tu bandeja de entrada y confirma tu correo. Luego vuelve a Stricto para iniciar sesión.', 'info', email);
      }
    } else if (result.data.session && result.data.user?.id && result.data.user.email_confirmed_at) {
      authForm.reset();
      setPasswordVisibility(false);
      openStrictoWorkspace(result.data.user);
    } else {
      setAuthFeedback('Confirma tu correo antes de iniciar sesión.', 'error', email);
    }
  } catch {
    setAuthFeedback(authErrorMessage(), 'error');
  } finally {
    setAuthBusy(false);
  }
});

authModeToggle.addEventListener('click', () => {
  setAuthMode(authMode === 'signup' ? 'signin' : 'signup');
  authEmail.focus();
});
authPasswordToggle.addEventListener('click', () => setPasswordVisibility(authPassword.type === 'password'));

authResend.addEventListener('click', async () => {
  if (!strictoAuth || authBusy || !authResendEmail) return;
  const email = authResendEmail;
  setAuthBusy(true);
  try {
    const {error} = await strictoAuth.resend({type: 'signup', email, options: {emailRedirectTo: strictoAuthRedirect}});
    setAuthFeedback(error ? authErrorMessage(error) : 'Revisa tu bandeja de entrada para confirmar el correo.', error ? 'error' : 'info', email);
  } catch {
    setAuthFeedback(authErrorMessage(), 'error', email);
  } finally {
    setAuthBusy(false);
  }
});

document.addEventListener('click', async event => {
  const button = event.target.closest('[data-auth-action]');
  if (!button || button.disabled || authBusy) return;
  if (button.dataset.authAction === 'guest') {
    authForm.reset();
    setAuthMode('signin');
    openStrictoWorkspace();
  }
  if (button.dataset.authAction === 'signin') returnToStrictoLogin();
  if (button.dataset.authAction === 'signout' && strictoAuth && workspaceAccount) {
    setAuthBusy(true);
    button.disabled = true;
    try {
      const {error} = await strictoAuth.signOut({scope: 'local'});
      if (error) tell('No se pudo cerrar la sesión. Vuelve a intentarlo.');
      else if (workspaceAccount) returnToStrictoLogin();
    } catch {
      tell('No se pudo cerrar la sesión. Vuelve a intentarlo.');
    } finally {
      button.disabled = false;
      setAuthBusy(false);
    }
  }
});

strictoAuth?.onAuthStateChange(event => {
  if (event === 'SIGNED_OUT' && workspaceAccount) returnToStrictoLogin();
});

setAuthBusy(false);
const authReturn = new URL(location.href);
const authFragment = new URLSearchParams(authReturn.hash.slice(1));
const authFragmentError = authFragment.has('error_code') || authFragment.has('error');
const authReturnError = authFragmentError || authReturn.searchParams.has('error_code') || authReturn.searchParams.has('error');
const authReturnHash = authFragmentError || authFragment.has('access_token') || authFragment.has('refresh_token');
if (authReturn.searchParams.has('code') || authReturnError || authReturnHash) {
  for (const key of ['code', 'error', 'error_code', 'error_description']) authReturn.searchParams.delete(key);
  if (authReturnHash) authReturn.hash = '';
  history.replaceState(null, '', authReturn);
  if (authReturnError) {
    setAuthFeedback('Si el enlace venció, solicita otra confirmación desde el formulario de ingreso.', 'error');
  } else {
    setAuthFeedback('Si ya confirmaste tu correo, inicia sesión con tus datos.');
  }
}
if (!strictoAuth) {
  setAuthFeedback('El ingreso con cuenta no está disponible en este momento.', 'error');
}
