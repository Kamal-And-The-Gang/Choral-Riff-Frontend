
// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   type ReactNode,
// } from "react";

// import { jwtDecode } from "jwt-decode";

// interface EnsembleRole {
//   ensembleId: string;
//   role: "OWNER" | "MODERATEUR" | "MEMBRE";
// }
// export const canModify = (role?: string | null) =>
//   role === "OWNER" || role === "MODERATEUR";
// export const canDelete = (role?: string | null) => role === "OWNER";

// export const isCreator = (creator?: boolean | null) => !!creator;

// // === Helper pour gérer les morceaux ===
// export const canCreateMorceau = (
//   user: DecodedUser | null,
//   ensemble: {
//     typeEnsemble: string;
//     userRole?: string;
//     creator?: boolean;
//   } | null,
// ) => {
//   if (!user || !ensemble) return false;

//   // Créateur ou OWNER classique
//   if (ensemble.creator || ensemble.userRole === "OWNER") return true;

//   // Cas groupe restreint : QUATUOR ou BAND, tous les membres deviennent OWNER
//   if (
//     (ensemble.typeEnsemble === "QUATUOR" || ensemble.typeEnsemble === "BAND") &&
//     ensemble.userRole === "MEMBRE"
//   ) {
//     return true;
//   }

//   return false;
// };

// interface DecodedUser {
//   id: number;
//   sub: string;
//   nom?: string;
//   prenom?: string;
//   email?: string;
//   ensembleRoles?: EnsembleRole[];
//   [key: string]: any;
// }

// interface AuthContextType {
//   token: string | null;
//   isAuthenticated: boolean;
//   user: DecodedUser | null;
//   loading: boolean;
//   login: (token: string, refreshToken: string) => void;
//   logout: () => void;
//   updateUserRole: (
//     ensembleId: string,
//     newRole: "OWNER" | "MODERATEUR" | "MEMBRE",
//   ) => void;
//   updateUser: (updatedUser: Partial<DecodedUser>) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Décodage du token (utilisé par le useEffect et par login)
// const buildUserFromToken = (accessToken: string): DecodedUser | null => {
//   try {
//     const decoded = jwtDecode<DecodedUser>(accessToken);

//     let userId: number | null = null;
//     if (decoded.id && !isNaN(Number(decoded.id))) {
//       userId = Number(decoded.id);
//     } else if (decoded.sub && !isNaN(Number(decoded.sub))) {
//       userId = Number(decoded.sub);
//     }

//     if (!userId) {
//       console.error("Impossible de récupérer un userId valide depuis le token");
//       return null;
//     }

//     return {
//       id: userId,
//       prenom: decoded.prenom ?? "",
//       nom: decoded.nom ?? "",
//       email: decoded.email ?? "",
//       sub: decoded.sub ?? "",
//       ensembleRoles: decoded.ensembleRoles ?? [],
//     };
//   } catch (err) {
//     console.error("Erreur de décodage du token :", err);
//     return null;
//   }
// };

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [token, setToken] = useState<string | null>(null);
//   const [user, setUser] = useState<DecodedUser | null>(null);
//   const [loading, setLoading] = useState(true);

//   const updateUser = (updatedUser: Partial<DecodedUser>) => {
//     setUser((prev) => (prev ? { ...prev, ...updatedUser } : prev));
//   };

//   const updateUserRoleForEnsemble = (
//     ensembleId: string,
//     newRole: "OWNER" | "MODERATEUR" | "MEMBRE",
//   ) => {
//     setUser((prev) => {
//       if (!prev) return null;
//       const updatedRoles = prev.ensembleRoles ? [...prev.ensembleRoles] : [];
//       const index = updatedRoles.findIndex((r) => r.ensembleId === ensembleId);
//       const newRoleObj = { ensembleId, role: newRole };
//       if (index >= 0) {
//         updatedRoles[index] = newRoleObj;
//       } else {
//         updatedRoles.push(newRoleObj);
//       }
//       return { ...prev, ensembleRoles: updatedRoles };
//     });
//   };

//   // Au chargement de l'appli : relire le token stocké
  
//   useEffect(() => {
//     const storedToken = localStorage.getItem("accessToken");

//     if (storedToken) {
//       const u = buildUserFromToken(storedToken);
//       if (u) {
//         setToken(storedToken);
//         setUser(u);
//       }
//     }

//     setLoading(false); // toujours, avec ou sans token
//   }, []);

//   const login = (newToken: string, newRefreshToken: string) => {
//     const u = buildUserFromToken(newToken);
//     if (!u) return;

//     localStorage.setItem("accessToken", newToken);
//     localStorage.setItem("refreshToken", newRefreshToken);
//     setToken(newToken);
//     setUser(u);
//     setLoading(false);
//   };

//   const logout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         isAuthenticated: !!token,
//         user,
//         loading,
//         login,
//         logout,
//         updateUserRole: updateUserRoleForEnsemble,
//         updateUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };



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
  role: "OWNER" | "MODERATEUR" | "MEMBRE";
}

export const canModify = (role?: string | null) =>
  role === "OWNER" || role === "MODERATEUR";

export const canDelete = (role?: string | null) => role === "OWNER";

export const isCreator = (creator?: boolean | null) => !!creator;

// Gestion des morceaux
export const canCreateMorceau = (
  user: DecodedUser | null,
  ensemble: {
    typeEnsemble: string;
    userRole?: string;
    creator?: boolean;
  } | null,
) => {
  if (!user || !ensemble) return false;

  if (ensemble.creator || ensemble.userRole === "OWNER") return true;

  if (
    (ensemble.typeEnsemble === "QUATUOR" ||
      ensemble.typeEnsemble === "BAND") &&
    ensemble.userRole === "MEMBRE"
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
  photoProfil?: string;
  ensembleRoles?: EnsembleRole[];
  [key: string]: any;
}

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: DecodedUser | null;
  loading: boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  updateUserRole: (
    ensembleId: string,
    newRole: "OWNER" | "MODERATEUR" | "MEMBRE",
  ) => void;
  updateUser: (updatedUser: Partial<DecodedUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Décodage du token
const buildUserFromToken = (accessToken: string): DecodedUser | null => {
  try {
    const decoded = jwtDecode<DecodedUser>(accessToken);

    let userId: number | null = null;

    if (decoded.id && !isNaN(Number(decoded.id))) {
      userId = Number(decoded.id);
    } else if (decoded.sub && !isNaN(Number(decoded.sub))) {
      userId = Number(decoded.sub);
    }

    if (!userId) {
      console.error("Impossible de récupérer un userId valide depuis le token");
      return null;
    }

    return {
      id: userId,
      prenom: decoded.prenom ?? "",
      nom: decoded.nom ?? "",
      email: decoded.email ?? "",
      sub: decoded.sub ?? "",
      ensembleRoles: decoded.ensembleRoles ?? [],
    };
  } catch (err) {
    console.error("Erreur de décodage du token :", err);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Mettre à jour les informations de l'utilisateur
  const updateUser = (updatedUser: Partial<DecodedUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : prev));
  };

  // Mettre à jour le rôle dans un ensemble
  const updateUserRoleForEnsemble = (
    ensembleId: string,
    newRole: "OWNER" | "MODERATEUR" | "MEMBRE",
  ) => {
    setUser((prev) => {
      if (!prev) return null;

      const updatedRoles = prev.ensembleRoles
        ? [...prev.ensembleRoles]
        : [];

      const index = updatedRoles.findIndex(
        (role) => role.ensembleId === ensembleId,
      );

      const newRoleObj = { ensembleId, role: newRole };

      if (index >= 0) {
        updatedRoles[index] = newRoleObj;
      } else {
        updatedRoles.push(newRoleObj);
      }

      return { ...prev, ensembleRoles: updatedRoles };
    });
  };

  // Récupérer le profil complet depuis le backend
  const fetchCurrentUser = async (accessToken: string) => {
    const response = await fetch(
      "http://localhost:8080/api/utilisateur/me",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Erreur lors du chargement du profil : ${response.status}`,
      );
    }

    const userData = await response.json();

    setUser((prev) => ({
      ...prev,
      ...userData,
      id: Number(userData.id),
      sub: userData.email ?? prev?.sub ?? "",
      email: userData.email ?? prev?.email ?? "",
      ensembleRoles:
        userData.ensembleRoles ?? prev?.ensembleRoles ?? [],
    }));
  };

  // Au démarrage : récupérer le token et le profil complet
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("accessToken");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // Vérifier que le token est décodable
        const decodedUser = buildUserFromToken(storedToken);

        if (!decodedUser) {
          throw new Error("Token invalide");
        }

        setToken(storedToken);
        setUser(decodedUser);

        // Récupérer les informations complètes depuis la base
        await fetchCurrentUser(storedToken);

      } catch (error) {
        console.error("Erreur de chargement de l'utilisateur :", error);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setToken(null);
        setUser(null);

      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Connexion
  const login = (newToken: string, newRefreshToken: string) => {
    const decodedUser = buildUserFromToken(newToken);

    if (!decodedUser) return;

    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    setToken(newToken);
    setUser(decodedUser);
    setLoading(true);

    // Charger le véritable profil après connexion
    fetchCurrentUser(newToken)
      .catch((error) => {
        console.error("Erreur de récupération du profil :", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setToken(null);
    setUser(null);
    setLoading(false);
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

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
