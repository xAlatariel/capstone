// src/services/reservationService.js
// ---------------------- INIZIO MODIFICHE SICUREZZA ----------------------
import apiService from './apiService';

// Funzioni di validazione delle prenotazioni
export const validateReservation = (reservationData) => {
  const errors = [];
  
  // Validazione data
  if (!reservationData.reservationDate) {
    errors.push('La data è obbligatoria');
  } else {
    const selectedDate = new Date(reservationData.reservationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.push('La data deve essere futura');
    }
  }
  
  // Validazione orario
  if (!reservationData.reservationTime) {
    errors.push('L\'orario è obbligatorio');
  }
  
  // Validazione numero di persone
  if (!reservationData.numberOfPeople) {
    errors.push('Il numero di persone è obbligatorio');
  } else if (reservationData.numberOfPeople < 1) {
    errors.push('Deve essere presente almeno 1 persona');
  } else if (reservationData.numberOfPeople > 20) {
    errors.push('Il numero massimo di persone è 20');
  }
  
  // Validazione area
  if (!reservationData.reservationArea) {
    errors.push('L\'area è obbligatoria');
  } else if (!['INDOOR', 'OUTDOOR'].includes(reservationData.reservationArea)) {
    errors.push('L\'area deve essere INDOOR o OUTDOOR');
  }
  
  return errors;
};
// ---------------------- FINE MODIFICHE SICUREZZA ----------------------

export const fetchAllReservations = async () => {
  // ---------------------- INIZIO MODIFICHE SICUREZZA ----------------------
  try {
    return await apiService.fetchWithAuth('/reservations');
  } catch (error) {
    console.error('Errore nel recupero delle prenotazioni:', error);
    throw error;
  }
  // ---------------------- FINE MODIFICHE SICUREZZA ----------------------
};

export const deleteReservation = async (id) => {
  // ---------------------- INIZIO MODIFICHE SICUREZZA ----------------------
  try {
    return await apiService.fetchWithAuth(`/reservations/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error(`Errore nella cancellazione della prenotazione ${id}:`, error);
    throw error;
  }
  // ---------------------- FINE MODIFICHE SICUREZZA ----------------------
};

export const getReservationsByDate = async (date) => {
  // ---------------------- INIZIO MODIFICHE SICUREZZA ----------------------
  try {
    return await apiService.fetchWithAuth(`/reservations/date/${date}`);
  } catch (error) {
    console.error(`Errore nel recupero delle prenotazioni per la data ${date}:`, error);
    throw error;
  }
  // ---------------------- FINE MODIFICHE SICUREZZA ----------------------
};