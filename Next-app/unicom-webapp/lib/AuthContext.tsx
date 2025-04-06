"use client";

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
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  signedUrlData: SignedUrlData | null;
}

// Shape of signed URL data
interface SignedUrlData {
  "CloudFront-Policy": string;
  "CloudFront-Signature": string;
  "CloudFront-Key-Pair-Id": string;
  expires: number;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [signedUrlData, setSignedUrlData] = useState<SignedUrlData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "https://8p4eqklq5b.execute-api.us-east-1.amazonaws.com";

  useEffect(() => {
    const initializeToken = async () => {
      const urlToken = getIdTokenFromUrl();
      const storedToken = getStoredIdToken();

      if (urlToken) {
        storeIdToken(urlToken);
        setToken(urlToken);
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } else if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
      } else {
        redirectToLogin();
      }

      setIsLoading(false);
    };

    initializeToken();
  }, []);

  useEffect(() => {
    // Fetch signed URL data once we have a valid token
    const fetchSignedUrlData = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/api/signedurl`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch signed URL");
        }

        const data = await response.json();
        localStorage.setItem("signedUrlData", JSON.stringify(data));
        setSignedUrlData(data);
      } catch (error) {
        console.error("Error fetching signed URL data:", error);
      }
    };

    fetchSignedUrlData();
  }, [token]);

  const isAuthenticated = !!token && !isTokenExpired(token);

  const handleSetToken = (newToken: string | null) => {
    if (newToken) {
      storeIdToken(newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("signedUrlData");
      setToken(null);
      setSignedUrlData(null);
      redirectToLogin();
    }
  };

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, setToken: handleSetToken, isAuthenticated, signedUrlData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
