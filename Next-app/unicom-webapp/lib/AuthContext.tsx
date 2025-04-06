"use client"; // Mark as client-side since it uses hooks and browser APIs

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  getIdTokenFromUrl,
  storeIdToken,
  getStoredIdToken,
  isTokenExpired,
  redirectToLogin,
} from "@/lib/auth";

// Define the shape of the context value
interface AuthContextType {
  token: string | null; // The current token, or null if not authenticated
  setToken: (token: string | null) => void; // Allow manual token updates (e.g., for logout)
  isAuthenticated: boolean; // Derived state for convenience
}

// Create the context with an undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap the app or specific sections
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Track initialization state

  useEffect(() => {
    // Function to initialize the token
    const initializeToken = () => {
      // Check URL for a token (e.g., after a redirect from login)
      const urlToken = getIdTokenFromUrl();
      // Check localStorage for an existing token
      const storedToken = getStoredIdToken();

      if (urlToken) {
        // If token is in URL, store it and use it
        storeIdToken(urlToken);
        setToken(urlToken);
        // Clean the URL to remove the token from the query string
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } else if (storedToken && !isTokenExpired(storedToken)) {
        // If token is in storage and valid, use it
        setToken(storedToken);
      } else {
        // No valid token found; redirect to login
        redirectToLogin();
      }

      setIsLoading(false); // Mark initialization as complete
    };

    initializeToken();
  }, []); // Empty dependency array: runs once on mount

  // Derived state for convenience
  const isAuthenticated = !!token && !isTokenExpired(token);

  // Handle token expiration or manual updates
  const handleSetToken = (newToken: string | null) => {
    if (newToken) {
      storeIdToken(newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem("token"); // Assuming "token" is the key
      setToken(null);
      redirectToLogin();
    }
  };

  // Show a loading state while token is being initialized
  if (isLoading) {
    return <div>Loading authentication...</div>; // Or a spinner
  }

  return (
    <AuthContext.Provider value={{ token, setToken: handleSetToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};