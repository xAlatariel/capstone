import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, user, logout, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (token && apiService.isTokenExpired()) {
      console.log("Token scaduto, logout automatico");
      logout();
    }
  }, [token, logout]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    console.log("Utente non autenticato, reindirizzo alla home");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log(`Accesso negato: ruolo richiesto ${requiredRole}, ruolo utente ${user?.role}`);
    return <Navigate to="/" state={{ error: "Accesso non autorizzato" }} replace />;
  }

  console.log("Accesso consentito"); // Debug
  return children; 
};

export default ProtectedRoute;