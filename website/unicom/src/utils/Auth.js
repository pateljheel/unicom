const COGNITO_LOGIN_URL = 'https://your-cognito-domain.auth.us-east-1.amazoncognito.com/login?...';

export function getIdTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id_token');
}

export function storeIdToken(idToken) {
  localStorage.setItem('id_token', idToken);
}

export function getStoredIdToken() {
  return localStorage.getItem('id_token');
}

export function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (e) {
    return true;
  }
}

export function redirectToLogin() {
  window.location.href = COGNITO_LOGIN_URL;
}
