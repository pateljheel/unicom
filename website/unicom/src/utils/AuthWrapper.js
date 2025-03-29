import React, { useEffect } from 'react';
import {
  getIdTokenFromUrl,
  storeIdToken,
  getStoredIdToken,
  isTokenExpired,
  redirectToLogin
} from './Auth';

function AuthGuard({ children }) {
  useEffect(() => {
    const urlToken = getIdTokenFromUrl();
    const storedToken = getStoredIdToken();

    if (urlToken) {
      storeIdToken(urlToken);
      // Clean the URL
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    const tokenToUse = urlToken || storedToken;

    if (!tokenToUse || isTokenExpired(tokenToUse)) {
      redirectToLogin();
    }
  }, []);

  return <>{children}</>;
}

export default AuthGuard;
