export const fetchUserReservations = async () => {
    const response = await fetch('http://localhost:8080/api/reservations/user', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });
    
    if (!response.ok) {
        throw new Error('Errore nel recupero delle prenotazioni');
    }
    
    return await response.json();
};

export const fetchReservationById = async (id) => {
    const response = await fetch(`http://localhost:8080/api/reservations/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    });
    
    if (!response.ok) {
        throw new Error('Errore nel recupero della prenotazione');
    }
    
    return await response.json();
};

export const updateReservation = async (id, reservationData) => {
    const formattedData = {
        ...reservationData,
        reservationTime: reservationData.reservationTime.includes(':00') 
            ? reservationData.reservationTime 
            : `${reservationData.reservationTime}:00`
    };

    const response = await fetch(`http://localhost:8080/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify(formattedData)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante l\'aggiornamento della prenotazione');
    }
    
    return await response.json();
};