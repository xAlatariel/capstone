// =================================================================
// SOSTITUZIONE COMPLETA per src/services/menuService.js
// =================================================================

import apiService from './apiService';

class MenuService {
  
  // ===================================================================
  // METODI PUBBLICI (per tutti gli utenti)
  // ===================================================================
  
  /**
   * Recupera tutti i menu attivi per la visualizzazione pubblica
   */
  async getAllActiveMenus() {
    try {
      const response = await apiService.fetchWithAuth('/menus/active');
      return response.data || [];
    } catch (error) {
      console.error('Errore recupero menu attivi:', error);
      throw new Error('Impossibile recuperare i menu. Riprova più tardi.');
    }
  }

  /**
   * Recupera il menu del giorno corrente
   */
  async getTodaysDailyMenu() {
    try {
      const response = await apiService.fetchWithAuth('/menus/daily/today');
      return response.data;
    } catch (error) {
      console.error('Errore recupero menu del giorno:', error);
      if (error.status === 404) {
        throw new Error('Nessun menu del giorno disponibile per oggi.');
      }
      throw new Error('Impossibile recuperare il menu del giorno.');
    }
  }

  /**
   * Recupera il menu stagionale corrente
   */
  async getCurrentSeasonalMenu() {
    try {
      const response = await apiService.fetchWithAuth('/menus/seasonal/current');
      return response.data;
    } catch (error) {
      console.error('Errore recupero menu stagionale:', error);
      if (error.status === 404) {
        throw new Error('Nessun menu stagionale disponibile.');
      }
      throw new Error('Impossibile recuperare il menu stagionale.');
    }
  }

  /**
   * Recupera un menu specifico per data (per menu del giorno)
   */
  async getDailyMenuByDate(date) {
    try {
      const response = await apiService.fetchWithAuth(`/menus/daily/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('Errore recupero menu per data:', error);
      if (error.status === 404) {
        throw new Error('Nessun menu disponibile per la data selezionata.');
      }
      throw new Error('Impossibile recuperare il menu per la data specificata.');
    }
  }

  // ===================================================================
  // METODI ADMIN - GESTIONE COMPLETA
  // ===================================================================

  /**
   * Recupera tutti i menu (solo admin)
   */
  async getAllMenus() {
    try {
      const response = await apiService.fetchWithAuth('/admin/menus');
      return response.data || [];
    } catch (error) {
      console.error('Errore recupero tutti i menu:', error);
      throw new Error('Impossibile recuperare i menu. Verifica i permessi.');
    }
  }

  /**
   * Recupera un menu specifico per ID (solo admin)
   */
  async getMenuById(id) {
    try {
      const response = await apiService.fetchWithAuth(`/admin/menus/${id}`);
      return response.data;
    } catch (error) {
      console.error('Errore recupero menu per ID:', error);
      if (error.status === 404) {
        throw new Error('Menu non trovato.');
      }
      throw new Error('Impossibile recuperare il menu specificato.');
    }
  }

  /**
   * Crea un nuovo menu (solo admin)
   */
  async createMenu(menuData) {
    try {
      this.validateMenuData(menuData);
      const response = await apiService.fetchWithAuth('/admin/menus', {
        method: 'POST',
        body: JSON.stringify(menuData)
      });
      return response.data;
    } catch (error) {
      console.error('Errore creazione menu:', error);
      throw new Error(error.message || 'Errore nella creazione del menu.');
    }
  }

  /**
   * Aggiorna un menu esistente (solo admin)
   */
  async updateMenu(id, menuData) {
    try {
      this.validateMenuData(menuData);
      const response = await apiService.fetchWithAuth(`/admin/menus/${id}`, {
        method: 'PUT',
        body: JSON.stringify(menuData)
      });
      return response.data;
    } catch (error) {
      console.error('Errore aggiornamento menu:', error);
      throw new Error(error.message || 'Errore nell\'aggiornamento del menu.');
    }
  }

  /**
   * Elimina un menu (solo admin)
   */
  async deleteMenu(id) {
    try {
      await apiService.fetchWithAuth(`/admin/menus/${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Errore eliminazione menu:', error);
      throw new Error(error.message || 'Errore nell\'eliminazione del menu.');
    }
  }

  /**
   * Attiva/Disattiva un menu (solo admin)
   */
  async toggleMenuStatus(id, isActive) {
    try {
      const response = await apiService.fetchWithAuth(`/admin/menus/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive })
      });
      return response.data;
    } catch (error) {
      console.error('Errore modifica stato menu:', error);
      throw new Error('Errore nella modifica dello stato del menu.');
    }
  }

  /**
   * Duplica un menu esistente (solo admin)
   */
  async duplicateMenu(id) {
    try {
      const response = await apiService.fetchWithAuth(`/admin/menus/${id}/duplicate`, {
        method: 'POST'
      });
      return response.data;
    } catch (error) {
      console.error('Errore duplicazione menu:', error);
      throw new Error('Errore nella duplicazione del menu.');
    }
  }

  // ===================================================================
  // METODI DI VALIDAZIONE E UTILITY
  // ===================================================================

  /**
   * Valida i dati del menu prima dell'invio
   */
  validateMenuData(menuData) {
    if (!menuData.name || menuData.name.trim().length < 3) {
      throw new Error('Il nome del menu deve essere di almeno 3 caratteri.');
    }

    if (!menuData.menuType) {
      throw new Error('Il tipo di menu è obbligatorio.');
    }

    if (!menuData.dishes || menuData.dishes.length === 0) {
      throw new Error('Il menu deve contenere almeno un piatto.');
    }

    // Validazione specifica per menu del giorno
    if (menuData.menuType === 'DAILY') {
      this.validateDailyMenuStructure(menuData.dishes);
    }

    // Validazione piatti
    menuData.dishes.forEach((dish, index) => {
      this.validateDish(dish, index + 1);
    });
  }

  /**
   * Valida la struttura del menu del giorno (3 primi, 3 secondi, 3 contorni)
   */
  validateDailyMenuStructure(dishes) {
    const primiCount = dishes.filter(d => d.category === 'PRIMI').length;
    const secondiCount = dishes.filter(d => d.category === 'SECONDI').length;
    const contorniCount = dishes.filter(d => d.category === 'CONTORNI').length;

    if (primiCount !== 3) {
      throw new Error('Il menu del giorno deve avere esattamente 3 primi piatti.');
    }
    if (secondiCount !== 3) {
      throw new Error('Il menu del giorno deve avere esattamente 3 secondi piatti.');
    }
    if (contorniCount !== 3) {
      throw new Error('Il menu del giorno deve avere esattamente 3 contorni.');
    }
  }

  /**
   * Valida un singolo piatto
   */
  validateDish(dish, position) {
    if (!dish.name || dish.name.trim().length < 2) {
      throw new Error(`Il piatto #${position} deve avere un nome di almeno 2 caratteri.`);
    }

    if (!dish.category) {
      throw new Error(`Il piatto #${position} deve avere una categoria.`);
    }

    if (dish.price && (isNaN(dish.price) || dish.price <= 0)) {
      throw new Error(`Il prezzo del piatto #${position} deve essere un numero maggiore di 0.`);
    }
  }

  /**
   * Formatta il prezzo per la visualizzazione
   */
  formatPrice(price) {
    if (!price) return 'Prezzo da definire';
    return `€ ${parseFloat(price).toFixed(2)}`;
  }

  /**
   * Raggruppa i piatti per categoria
   */
  groupDishesByCategory(dishes) {
    const grouped = {
      ANTIPASTI: [],
      PRIMI: [],
      SECONDI: [],
      CONTORNI: [],
      DOLCI: []
    };

    dishes.forEach(dish => {
      if (grouped[dish.category]) {
        grouped[dish.category].push(dish);
      }
    });

    // Ordina per displayOrder e poi per nome
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return (a.displayOrder || 999) - (b.displayOrder || 999);
        }
        return a.name.localeCompare(b.name);
      });
    });

    return grouped;
  }

  /**
   * Ottieni le categorie disponibili in italiano
   */
  getCategoryDisplayNames() {
    return {
      ANTIPASTI: 'Antipasti',
      PRIMI: 'Primi Piatti',
      SECONDI: 'Secondi Piatti',
      CONTORNI: 'Contorni',
      DOLCI: 'Dolci'
    };
  }

  /**
   * Ottieni i tipi di menu disponibili
   */
  getMenuTypes() {
    return {
      DAILY: 'Menu del Giorno',
      SEASONAL: 'Menu Stagionale'
    };
  }

  /**
   * Crea template per menu del giorno vuoto
   */
  createDailyMenuTemplate() {
    return {
      name: '',
      description: '',
      menuType: 'DAILY',
      menuDate: new Date().toISOString().split('T')[0],
      isActive: false,
      dishes: [
        // 3 Primi
        ...Array(3).fill(null).map((_, i) => ({
          name: '',
          description: '',
          ingredients: '',
          category: 'PRIMI',
          price: '',
          isAvailable: true,
          displayOrder: i + 1
        })),
        // 3 Secondi
        ...Array(3).fill(null).map((_, i) => ({
          name: '',
          description: '',
          ingredients: '',
          category: 'SECONDI',
          price: '',
          isAvailable: true,
          displayOrder: i + 1
        })),
        // 3 Contorni
        ...Array(3).fill(null).map((_, i) => ({
          name: '',
          description: '',
          ingredients: '',
          category: 'CONTORNI',
          price: '',
          isAvailable: true,
          displayOrder: i + 1
        }))
      ]
    };
  }

  /**
   * Crea template per menu stagionale vuoto
   */
  createSeasonalMenuTemplate() {
    return {
      name: '',
      description: '',
      menuType: 'SEASONAL',
      menuDate: null,
      isActive: false,
      dishes: []
    };
  }

  /**
   * Statistiche menu (solo admin)
   */
  async getMenuStats() {
    try {
      const response = await apiService.fetchWithAuth('/admin/menus/stats');
      return response.data;
    } catch (error) {
      console.error('Errore recupero statistiche menu:', error);
      throw new Error('Impossibile recuperare le statistiche.');
    }
  }
}

export default new MenuService();