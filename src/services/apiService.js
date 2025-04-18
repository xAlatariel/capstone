
const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {

    getHeaders(contentType = 'application/json') {
    const headers = {
      'Content-Type': contentType,
    };
    
    const token = localStorage.getItem('jwtToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  isTokenExpired() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return true;
    
    try {

        const payload = JSON.parse(atob(token.split('.')[1]));

        return payload.exp * 1000 < Date.now();
    } catch (e) {
      console.error('Errore nella verifica del token:', e);
      return true;
    }
  }

  async fetchWithAuth(endpoint, options = {}) {
    if (this.isTokenExpired() && endpoint !== '/users/login' && endpoint !== '/users/register') {

        this.handleAuthError();
      throw new Error('Sessione scaduta. Effettua di nuovo il login.');
    }

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          this.handleAuthError();
          throw new Error('Accesso non autorizzato');
        }

        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          const text = await response.text();
          throw new Error(text || `Errore ${response.status}`);
        }

        throw new Error(errorData.message || `Errore ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Errore nella chiamata API a ${endpoint}:`, error);
      throw error;
    }
  }

  handleAuthError() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  async login(credentials) {
    const response = await this.fetchWithAuth('/users/login', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials)
    });
    return response;
  }

  async register(userData) {
    const response = await this.fetchWithAuth('/users/register', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    return response;
  }

  async createReservation(reservationData) {
    const response = await this.fetchWithAuth('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
    return response;
  }

  async getUserReservations() {
    return await this.fetchWithAuth('/reservations/user');
  }

  async getReservationsByDate(date) {
    return await this.fetchWithAuth(`/reservations/date/${date}`);
  }

  async updateReservation(id, reservationData) {
    return await this.fetchWithAuth(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservationData)
    });
  }

  async deleteReservation(id) {
    return await this.fetchWithAuth(`/reservations/${id}`, {
      method: 'DELETE'
    });
  }
}

export default new ApiService();
