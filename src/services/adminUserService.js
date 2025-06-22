// src/services/adminUserService.js
import apiService from './apiService';

class AdminUserService {
  
  // ===================================================================
  // RECUPERO UTENTI
  // ===================================================================
  
  async getAllUsers(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDir) queryParams.append('sortDir', params.sortDir);
    if (params.search) queryParams.append('search', params.search);
    if (params.role && params.role !== 'all') queryParams.append('role', params.role);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.emailVerified !== undefined) queryParams.append('emailVerified', params.emailVerified);
    
    return await apiService.fetchWithAuth(`/admin/users?${queryParams.toString()}`);
  }
  
  async getUserById(id) {
    return await apiService.fetchWithAuth(`/admin/users/${id}`);
  }
  
  async getUserStats() {
    return await apiService.fetchWithAuth('/admin/users/stats');
  }
  
  // ===================================================================
  // CREAZIONE E MODIFICA
  // ===================================================================
  
  async createUser(userData) {
    return await apiService.fetchWithAuth('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
  
  async updateUser(id, userData) {
    return await apiService.fetchWithAuth(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }
  
  // ===================================================================
  // GESTIONE STATO E RUOLI
  // ===================================================================
  
  async updateUserStatus(id, enabled, reason = '') {
    return await apiService.fetchWithAuth(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled, reason })
    });
  }
  
  async updateUserRole(id, role, reason = '') {
    return await apiService.fetchWithAuth(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role, reason })
    });
  }
  
  async resetUserPassword(id) {
    return await apiService.fetchWithAuth(`/admin/users/${id}/password-reset`, {
      method: 'PATCH'
    });
  }
  
  // ===================================================================
  // EMAIL E VERIFICHE
  // ===================================================================
  
  async resendVerificationEmail(id) {
    return await apiService.fetchWithAuth(`/admin/users/${id}/resend-verification`, {
      method: 'POST'
    });
  }
  
  async verifyUserEmail(id) {
    return await apiService.fetchWithAuth(`/admin/users/${id}/verify-email`, {
      method: 'PATCH'
    });
  }
  
  // ===================================================================
  // ELIMINAZIONE
  // ===================================================================
  
  async deleteUser(id) {
    return await apiService.fetchWithAuth(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  }
  
  // ===================================================================
  // ATTIVITÀ E EXPORT
  // ===================================================================
  
  async getUserActivities(id, page = 0, size = 10) {
    return await apiService.fetchWithAuth(`/admin/users/${id}/activities?page=${page}&size=${size}`);
  }
  
  async getAdminActivities(page = 0, size = 20) {
    return await apiService.fetchWithAuth(`/admin/users/activities/admin?page=${page}&size=${size}`);
  }
  
  async exportUsers(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.role && params.role !== 'all') queryParams.append('role', params.role);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    
    return await apiService.fetchWithAuth(`/admin/users/export?${queryParams.toString()}`);
  }
}

export default new AdminUserService();
