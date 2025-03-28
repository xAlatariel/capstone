import React, { createContext, useState, useContext } from "react";

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

  const isAdmin = user?.role === "ADMIN";

  const login = (newToken, userData) => {
    if (!newToken) {
      console.error("Token mancante durante il login");
      return;
    }

    localStorage.setItem("jwtToken", newToken);

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }

    setToken(newToken);
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
  };

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
