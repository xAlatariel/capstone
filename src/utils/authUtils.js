// ---------------------- INIZIO MODIFICHE SICUREZZA ----------------------
/**
 * Utility per la gestione sicura dell'autenticazione
 */

// Decodifica il payload di un token JWT
export const decodeJWT = (token) => {
    if (!token) return null;
    
    try {
      // Dividi il token nelle sue 3 parti e prendi la parte centrale (payload)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
  
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Errore nella decodifica del token:', error);
      return null;
    }
  };
  
  // Verifica se un token è scaduto
  export const isTokenExpired = (token) => {
    const decoded = decodeJWT(token);
    
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    // exp è in secondi, Date.now() è in millisecondi
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    
    return currentTime >= expirationTime;
  };
  
  // Estrae il ruolo dell'utente dal token
  export const getUserRoleFromToken = (token) => {
    const decoded = decodeJWT(token);
    return decoded?.role || 'USER';
  };
  
  // Sanitizza i dati utente per la memorizzazione sicura
  export const sanitizeUserData = (userData) => {
    if (!userData) return null;
    
    // Includi solo le proprietà necessarie
    return {
      email: userData.email || '',
      role: userData.role || 'USER'
    };
  };
  
  // Cancella tutti i dati di autenticazione
  export const clearAuthData = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    
    // Pulisci eventuali cookie relativi all'autenticazione
    document.cookie.split(";").forEach(cookie => {
      const [name] = cookie.trim().split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  };
  
  // Verifica se l'utente ha un ruolo specifico
  export const hasRole = (user, requiredRole) => {
    if (!user || !user.role) return false;
    
    if (requiredRole === 'ADMIN') {
      return user.role === 'ADMIN';
    }
    
    // Altri controlli di ruolo possono essere aggiunti qui
    
    return true;
  };
  // ---------------------- FINE MODIFICHE SICUREZZA ----------------------