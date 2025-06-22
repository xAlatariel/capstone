// src/services/adminUserService.js
import apiService from './apiService';

class AdminUserService {
  
  // ===================================================================
  // RECUPERO UTENTI
  // ===================================================================
  
 async getAllUsers(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    // Aggiungi solo parametri validi
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDir) queryParams.append('sortDir', params.sortDir);
    if (params.search && params.search.trim()) queryParams.append('search', params.search);
    if (params.role && params.role !== 'all') queryParams.append('role', params.role);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    
    // FIX CRITICO: emailVerified solo se è boolean
    if (typeof params.emailVerified === 'boolean') {
      queryParams.append('emailVerified', params.emailVerified);
    }
    
    const endpoint = `/admin/users?${queryParams.toString()}`;
    console.log('🌐 AdminUserService chiamata:', endpoint);
    
    const response = await apiService.fetchWithAuth(endpoint);
    console.log('✅ AdminUserService risposta completa:', response);
    
    // ✅ FIX: Il backend restituisce {status, message, data}
    // Restituiamo direttamente response.data se esiste, altrimenti response
    if (response.data) {
      console.log('📊 AdminUserService - Dati estratti:', response.data);
      return response.data;
    }
    
    // Fallback per compatibilità
    return response;
    
  } catch (error) {
    console.error('❌ AdminUserService errore:', error);
    throw new Error(error.message || 'Errore nel caricamento degli utenti');
  }
}
  async getUserStats() {
    try {
      const response = await apiService.fetchWithAuth('/admin/users/stats');
      return response || {};
    } catch (error) {
      console.error('Errore recupero statistiche:', error);
      throw new Error(error.message || 'Errore nel caricamento delle statistiche');
    }
  }

  // ===================================================================
  // CREAZIONE UTENTE
  // ===================================================================
  
  async createUser(userData) {
    try {
      const response = await apiService.fetchWithAuth('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      console.log('✅ Utente creato:', response);
      return response;
    } catch (error) {
      console.error('❌ Errore creazione utente:', error);
      throw new Error(error.message || 'Errore nella creazione dell\'utente');
    }
  }

  // ===================================================================
  // AGGIORNAMENTO UTENTE
  // ===================================================================
  
  async updateUser(id, userData) {
    try {
      const response = await apiService.fetchWithAuth(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      console.log('✅ Utente aggiornato:', response);
      return response;
    } catch (error) {
      console.error('❌ Errore aggiornamento utente:', error);
      throw new Error(error.message || 'Errore nell\'aggiornamento dell\'utente');
    }
  }

  async updateUserStatus(id, enabled) {
    try {
      const response = await apiService.fetchWithAuth(`/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ enabled })
      });
      console.log('✅ Stato utente aggiornato:', response);
      return response;
    } catch (error) {
      console.error('❌ Errore aggiornamento stato utente:', error);
      throw new Error(error.message || 'Errore nell\'aggiornamento dello stato utente');
    }
  }

  async updateUserRole(id, role) {
    try {
      const response = await apiService.fetchWithAuth(`/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role })
      });
      console.log('✅ Ruolo utente aggiornato:', response);
      return response;
    } catch (error) {
      console.error('❌ Errore aggiornamento ruolo utente:', error);
      throw new Error(error.message || 'Errore nell\'aggiornamento del ruolo utente');
    }
  }

  // ===================================================================
  // GESTIONE PASSWORD
  // ===================================================================
  
  async resetUserPassword(id) {
    try {
      const response = await apiService.fetchWithAuth(`/admin/users/${id}/reset-password`, {
        method: 'POST'
      });
      console.log('✅ Password utente resettata:', response);
      return response;
    } catch (error) {
      console.error('❌ Errore reset password:', error);
      throw new Error(error.message || 'Errore nel reset della password');
    }
  }

  // ===================================================================
  // GESTIONE EMAIL
  // ===================================================================
  
  async resendVerificationEmail(id) {
    try {
      const response = await apiService.fetchWithAuth(`/admin/users/${id}/resend-verification`, {
        method: 'POST'
      });
      console.log('✅ Email di verifica inviata:', response);
      return response;
    } catch (error) {
      console.error('❌ Errore invio email verifica:', error);
      throw new Error(error.message || 'Errore nell\'invio dell\'email di verifica');
    }
  }
  
  async verifyUserEmail(id) {
    try {
      const response = await apiService.fetchWithAuth(`/admin/users/${id}/verify-email`, {
        method: 'PATCH'
      });
      console.log('✅ Email utente verificata:', response);
      return response;
    } catch (error) {
      console.error('❌ Errore verifica email:', error);
      throw new Error(error.message || 'Errore nella verifica dell\'email');
    }
  }
  
  // ===================================================================
  // ELIMINAZIONE
  // ===================================================================
  
  async deleteUser(id) {
    try {
      const response = await apiService.fetchWithAuth(`/admin/users/${id}`, {
        method: 'DELETE'
      });
      console.log('✅ Utente eliminato:', response);
      return response;
    } catch (error) {
      console.error('❌ Errore eliminazione utente:', error);
      throw new Error(error.message || 'Errore nell\'eliminazione dell\'utente');
    }
  }
  
  // ===================================================================
  // ATTIVITÀ E AUDIT
  // ===================================================================
  
  async getUserActivities(id, page = 0, size = 10) {
    try {
      const response = await apiService.fetchWithAuth(`/admin/users/${id}/activities?page=${page}&size=${size}`);
      return response || { content: [], totalElements: 0, totalPages: 0 };
    } catch (error) {
      console.error('❌ Errore recupero attività utente:', error);
      // Restituisci un oggetto vuoto invece di lanciare errore per evitare crash del modal
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  }
  
  async getAdminActivities(page = 0, size = 20) {
    try {
      const response = await apiService.fetchWithAuth(`/admin/users/activities/admin?page=${page}&size=${size}`);
      return response || { content: [], totalElements: 0, totalPages: 0 };
    } catch (error) {
      console.error('❌ Errore recupero attività admin:', error);
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  }
  
  // ===================================================================
  // EXPORT E REPORT
  // ===================================================================
  
  async exportUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.role && params.role !== 'all') queryParams.append('role', params.role);
      if (params.status && params.status !== 'all') queryParams.append('status', params.status);
      
      const response = await apiService.fetchWithAuth(`/admin/users/export?${queryParams.toString()}`);
      return response || [];
    } catch (error) {
      console.error('❌ Errore export utenti:', error);
      throw new Error(error.message || 'Errore nell\'export degli utenti');
    }
  }

  // ===================================================================
  // METODI DI UTILITÀ
  // ===================================================================

  /**
   * Formatta i dati utente per la visualizzazione
   */
  formatUserData(user) {
    if (!user) return null;
    
    return {
      ...user,
      fullName: `${user.name} ${user.surname}`.trim(),
      statusText: user.enabled ? 'Attivo' : 'Disabilitato',
      emailVerifiedText: user.emailVerified ? 'Verificata' : 'Non verificata',
      roleText: user.role === 'ADMIN' ? 'Amministratore' : 'Utente',
      createdAtFormatted: user.createdAt ? new Date(user.createdAt).toLocaleDateString('it-IT') : 'N/A',
      lastLoginFormatted: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('it-IT') : 'Mai'
    };
  }

  /**
   * Valida i dati utente prima dell'invio
   */
  validateUserData(userData) {
    const errors = {};
    
    if (!userData.name?.trim()) {
      errors.name = 'Il nome è obbligatorio';
    }
    
    if (!userData.surname?.trim()) {
      errors.surname = 'Il cognome è obbligatorio';
    }
    
    if (!userData.email?.trim()) {
      errors.email = 'L\'email è obbligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Formato email non valido';
    }
    
    if (userData.role && !['USER', 'ADMIN'].includes(userData.role)) {
      errors.role = 'Ruolo non valido';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Genera parametri di ricerca standardizzati
   */
  buildSearchParams(filters = {}) {
    const params = {
      page: filters.page || 0,
      size: filters.size || 10,
      sortBy: filters.sortBy || 'createdAt',
      sortDir: filters.sortDir || 'desc'
    };

    if (filters.search?.trim()) {
      params.search = filters.search.trim();
    }

    if (filters.role && filters.role !== 'all') {
      params.role = filters.role;
    }

    if (filters.status && filters.status !== 'all') {
      params.status = filters.status;
    }

    if (typeof filters.emailVerified === 'boolean') {
      params.emailVerified = filters.emailVerified;
    }

    return params;
  }

  /**
   * Calcola statistiche base da una lista di utenti
   */
  calculateStats(users = []) {
    const stats = {
      totalUsers: users.length,
      activeUsers: 0,
      inactiveUsers: 0,
      verifiedUsers: 0,
      unverifiedUsers: 0,
      adminUsers: 0,
      standardUsers: 0
    };

    users.forEach(user => {
      if (user.enabled) {
        stats.activeUsers++;
      } else {
        stats.inactiveUsers++;
      }

      if (user.emailVerified) {
        stats.verifiedUsers++;
      } else {
        stats.unverifiedUsers++;
      }

      if (user.role === 'ADMIN') {
        stats.adminUsers++;
      } else {
        stats.standardUsers++;
      }
    });

    return stats;
  }

  /**
   * Gestisce gli errori API in modo standardizzato
   */
  handleApiError(error, defaultMessage = 'Si è verificato un errore') {
    console.error('AdminUserService API Error:', error);
    
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return defaultMessage;
  }

  /**
   * Verifica se l'utente corrente può modificare l'utente target
   */
  canModifyUser(currentUser, targetUser) {
    if (!currentUser || !targetUser) return false;
    
    // Admin può modificare tutti tranne se stesso (per evitare auto-lock)
    if (currentUser.role === 'ADMIN') {
      return currentUser.id !== targetUser.id;
    }
    
    return false;
  }

  /**
   * Genera un nome file per l'export
   */
  generateExportFilename(type = 'users', format = 'csv') {
    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
    return `${type}_${date}_${timestamp}.${format}`;
  }
}

export default new AdminUserService();