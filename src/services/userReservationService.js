import apiService from "./apiService";
import { validateReservation } from "./reservationService";

export const fetchUserReservations = async () => {
  try {
    return await apiService.fetchWithAuth("/reservations/user");
  } catch (error) {
    console.error("Errore nel recupero delle prenotazioni utente:", error);
    throw new Error("Errore nel recupero delle prenotazioni");
  }
};

export const fetchReservationById = async (id) => {
  if (!id) {
    throw new Error("ID prenotazione mancante");
  }

  try {
    return await apiService.fetchWithAuth(`/reservations/${id}`);
  } catch (error) {
    console.error(`Errore nel recupero della prenotazione ${id}:`, error);
    throw new Error("Errore nel recupero della prenotazione");
  }
};

export const updateReservation = async (id, reservationData) => {
  if (!id) {
    throw new Error("ID prenotazione mancante");
  }

  // Valida i dati della prenotazione prima dell'invio
  const validationErrors = validateReservation(reservationData);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(", "));
  }

  // Formatta i dati della prenotazione
  const formattedData = {
    ...reservationData,
    reservationTime: reservationData.reservationTime.includes(":00")
      ? reservationData.reservationTime
      : `${reservationData.reservationTime}:00`,
  };

  try {
    return await apiService.fetchWithAuth(`/reservations/${id}`, {
      method: "PUT",
      body: JSON.stringify(formattedData),
    });
  } catch (error) {
    console.error(
      `Errore durante l'aggiornamento della prenotazione ${id}:`,
      error
    );
    throw new Error(
      error.message || "Errore durante l'aggiornamento della prenotazione"
    );
  }
};

// Funzione per verificare se una prenotazione è futura
export const isUpcomingReservation = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return false;

  try {
    const [year, month, day] = dateStr.split("-");
    const [hours, minutes] = timeStr.split(":");
    const reservationDate = new Date(year, month - 1, day, hours, minutes);
    return reservationDate > new Date();
  } catch (error) {
    console.error("Errore nel controllo della data di prenotazione:", error);
    return false;
  }
};
