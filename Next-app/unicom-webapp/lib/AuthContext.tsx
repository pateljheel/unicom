"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  getIdTokenFromUrl,
  storeIdToken,
  getStoredIdToken,
  isTokenExpired,
  redirectToLogin,
} from "@/lib/auth";

// Shape of signed URL data
interface SignedUrlData {
  "CloudFront-Policy": string;
  "CloudFront-Signature": string;
  "CloudFront-Key-Pair-Id": string;
  expires: number;
}

// Shape of User object decoded from id_token
interface User {
  email: string;
  sub: string;
  [key: string]: any; // To allow other attributes like `name`, `phone_number`, etc.
}

// Define the shape of the context value
interface AuthContextType {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  signedUrlData: SignedUrlData | null;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
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
        parseUserFromToken(urlToken);
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } else if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        parseUserFromToken(storedToken);
      } else {
        redirectToLogin();
      }

      setIsLoading(false);
    };

    initializeToken();
  }, []);

  const parseUserFromToken = (idToken: string) => {
    try {
      const payloadBase64 = idToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      setUser({
        email: decodedPayload.email,
        sub: decodedPayload.sub,
        ...decodedPayload, // Include all other attributes just in case
      });
    } catch (err) {
      console.error("Failed to decode token:", err);
      setUser(null);
    }
  };

  useEffect(() => {
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
      parseUserFromToken(newToken);
    } else {
      localStorage.removeItem("id_token");
      localStorage.removeItem("signedUrlData");
      setToken(null);
      setUser(null);
      setSignedUrlData(null);
      redirectToLogin();
    }
  };

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, user, setToken: handleSetToken, isAuthenticated, signedUrlData }}>
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
