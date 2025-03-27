const COGNITO_LOGIN_URL = 'https://unicom-dev-userpool-domain.auth.us-east-2.amazoncognito.com/login?client_id=3la4d8muaa4k2p6j4aom5ddpoh&response_type=token&scope=email+openid+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000';

const TOKEN_STRING = 'id_token';

const COGNITO_LOGOUT_URL =
  'https://unicom-dev-userpool-domain.auth.us-east-2.amazoncognito.com/logout?' +
  'client_id=3la4d8muaa4k2p6j4aom5ddpoh&' +
  'logout_uri=http%3A%2F%2Flocalhost%3A3000';

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
