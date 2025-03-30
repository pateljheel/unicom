import infra_config from '../infra_config.json'; // Ensure infra_config is imported to initialize environment variables

const COGNITO_LOGIN_URL = infra_config.cognito_login_url; // Replace with your actual Cognito login URL

const TOKEN_STRING = 'id_token';

const COGNITO_LOGOUT_URL = infra_config.cognito_logout_url; // Replace with your actual Cognito logout URL

export function logout() {
  localStorage.removeItem(TOKEN_STRING);
  window.location.href = COGNITO_LOGOUT_URL;
}

export function getIdTokenFromUrl() {
  const hash = window.location.hash.substring(1); // remove the '#'
  const params = new URLSearchParams(hash);
  return params.get(TOKEN_STRING);
}

export function storeIdToken(idToken) {
  localStorage.setItem(TOKEN_STRING, idToken);
}

export function getStoredIdToken() {
  return localStorage.getItem(TOKEN_STRING);
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
