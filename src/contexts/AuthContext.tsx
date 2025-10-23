// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedUser {
  sub: string;
  nom?: string;
  prenom?: string;
  email?: string;
  [key: string]: any;
}


interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: DecodedUser | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedUser | null>(null);

useEffect(() => {
  const storedToken = localStorage.getItem("accessToken");
  if (storedToken) {
    setToken(storedToken);
    try {
      const decoded = jwtDecode<DecodedUser>(storedToken);
      // Assurer que les champs existent
      setUser({
        prenom: decoded.prenom ?? "",
        nom: decoded.nom ?? "",
        email: decoded.email ?? "",
        sub: decoded.sub ?? "",
      });
    } catch (err) {
      console.error("Erreur de décodage du token :", err);
    }
  }
}, []);


  const login = (newToken: string) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
    console.log("Token stocké :", localStorage.getItem("accessToken"));
    try {
      const decoded = jwtDecode<DecodedUser>(newToken);
      setUser(decoded);
    } catch (err) {
      console.error("Erreur de décodage du token :", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
