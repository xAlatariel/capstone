// src/services/reservations.js
const API_URL = 'http://localhost:8080/api/reservations';

export const fetchAllReservations = async () => {
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });
    if (!response.ok) throw new Error('Errore nel recupero delle prenotazioni');
    return await response.json();
};

export const deleteReservation = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });
    if (!response.ok) throw new Error('Errore nella cancellazione della prenotazione');
};

export const getReservationsByDate = async (date) => {
    const response = await fetch(`http://localhost:8080/api/reservations/date/${date}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });
    if (!response.ok) throw new Error('Errore nel recupero delle prenotazioni');
    return await response.json();
};