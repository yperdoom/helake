const TOKEN_KEY = 'helake_token';
const ROLE_KEY = 'helake_role';
const NAME_KEY = 'helake_name';

export function setSession({ token, role, name }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role ?? 'user');
  localStorage.setItem(NAME_KEY, name ?? '');
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(NAME_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function getName() {
  return localStorage.getItem(NAME_KEY);
}

export async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(path, { ...options, headers });

  if (response.status === 401) {
    clearSession();
    if (location.pathname !== '/login') location.assign('/login');
    throw new Error('Unauthorized');
  }

  return response;
}
