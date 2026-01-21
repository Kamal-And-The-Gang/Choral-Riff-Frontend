// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { jwtDecode } from "jwt-decode";

interface EnsembleRole {
  ensembleId: string;
  role: "admin" | "moderator" | "member";
}
export const canModify = (role?: string | null) =>
  role === "admin" || role === "moderator";
export const canDelete = (role?: string | null) => role === "admin";

export const isCreator = (creator?: boolean | null) => !!creator;

// === Nouveau helper pour gérer les morceaux ===
export const canCreateMorceau = (
  user: DecodedUser | null,
  ensemble: {
    typeEnsemble: string;
    userRole?: string;
    creator?: boolean;
  } | null,
) => {
  if (!user || !ensemble) return false;

  // Créateur ou admin classique
  if (ensemble.creator || ensemble.userRole === "admin") return true;

  // Cas groupe restreint : QUATUOR ou BAND, tous les membres deviennent admin
  if (
    (ensemble.typeEnsemble === "QUATUOR" || ensemble.typeEnsemble === "BAND") &&
    ensemble.userRole === "member"
  ) {
    return true;
  }

  return false;
};

interface DecodedUser {
  id: number;
  sub: string;
  nom?: string;
  prenom?: string;
  email?: string;
  ensembleRoles?: EnsembleRole[]; // <-- tableau des rôles par ensemble
  [key: string]: any;
}

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: DecodedUser | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  updateUserRole: (
    ensembleId: string,
    newRole: "admin" | "moderator" | "member",
  ) => void; // <-- corrigé
  updateUser: (updatedUser: Partial<DecodedUser>) => void; // <-- ajouté
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedUser | null>(null);
  const updateUser = (updatedUser: Partial<DecodedUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : prev));
  };

  const [loading, setLoading] = useState(true);

  const updateUserRoleForEnsemble = (
    ensembleId: string,
    newRole: "admin" | "moderator" | "member",
  ) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedRoles = prev.ensembleRoles ? [...prev.ensembleRoles] : [];
      const index = updatedRoles.findIndex((r) => r.ensembleId === ensembleId);
      const newRoleObj = { ensembleId, role: newRole };
      if (index >= 0) {
        // remplace l’objet entier au lieu de muter
        updatedRoles[index] = newRoleObj;
      } else {
        updatedRoles.push(newRoleObj);
      }
      return { ...prev, ensembleRoles: updatedRoles };
    });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) {
      return;
    }

    setToken(storedToken);

    try {
      const decoded = jwtDecode<DecodedUser>(storedToken);

      // Vérifier et convertir userId
      let userId: number | null = null;
      if (decoded.id && !isNaN(Number(decoded.id))) {
        userId = Number(decoded.id);
      } else if (decoded.sub && !isNaN(Number(decoded.sub))) {
        userId = Number(decoded.sub);
      }

      if (!userId) {
        console.error(
          "Impossible de récupérer un userId valide depuis le token",
        );
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      setUser({
        id: userId,
        prenom: decoded.prenom ?? "",
        nom: decoded.nom ?? "",
        email: decoded.email ?? "",
        sub: decoded.sub ?? "",
        ensembleRoles: decoded.ensembleRoles ?? [],
      });
    } catch (err) {
      console.error("Erreur de décodage du token :", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);

    try {
      const decoded = jwtDecode<DecodedUser>(newToken);

      let userId: number | null = null;
      if (decoded.id && !isNaN(Number(decoded.id))) {
        userId = Number(decoded.id);
      } else if (decoded.sub && !isNaN(Number(decoded.sub))) {
        userId = Number(decoded.sub);
      }

      if (!userId) {
        console.error(
          "Impossible de récupérer un userId valide depuis le token",
        );
        setUser(null);
        setToken(null);
        return;
      }

      setUser({
        id: userId,
        prenom: decoded.prenom ?? "",
        nom: decoded.nom ?? "",
        email: decoded.email ?? "",
        sub: decoded.sub ?? "",
        ensembleRoles: decoded.ensembleRoles ?? [],
      });
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
      value={{
        token,
        isAuthenticated: !!token,
        user,
        loading,
        login,
        logout,
        updateUserRole: updateUserRoleForEnsemble,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
