import React, { createContext, useState, useContext } from "react";

import apiService from "../services/apiService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("jwtToken") || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Errore nel parsing dei dati dell'utente:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const checkTokenValidity = () => {
      if (token && apiService.isTokenExpired()) {
        logout();
      }
      setLoading(false);
    };

    checkTokenValidity();
    
    const intervalId = setInterval(() => {
      if (token) {
        checkTokenValidity();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [token]);

  const isAdmin = user?.role === "ADMIN";

  const login = (newToken, userData) => {
    if (!newToken) {
      console.error("Token mancante durante il login");
      return;
    }

    localStorage.setItem("jwtToken", newToken);
    setToken(newToken);

    if (userData) {

      const sanitizedUser = {
        email: userData.email,
        role: userData.role
      };
      
      localStorage.setItem("user", JSON.stringify(sanitizedUser));
      setUser(sanitizedUser);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const contextValue = {
    token,
    user,
    login,
    logout,
    isAdmin,
    isAuthenticated: !!token,
    loading
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve essere usato all'interno di un AuthProvider");
  }
  return context;
};

export default AuthContext;