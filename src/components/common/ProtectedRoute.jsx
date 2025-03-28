import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, user } = useAuth();
  console.log('Token:', token); // Debug
  console.log('Ruolo utente:', user?.role); // Debug

  if (!token) {
    console.log("Utente non autenticato, reindirizzo alla home"); // Debug
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log(`Accesso negato: ruolo richiesto ${requiredRole}, ruolo utente ${user?.role}`); // Debug
    return <Navigate to="/" replace />;
  }

  console.log("Accesso consentito"); // Debug
  return children; 
};

export default ProtectedRoute;