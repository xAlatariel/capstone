// src/components/user/ReservationDetail.jsx
import React from "react";

const ReservationDetail = ({ reservation }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-2">
      <div className="mb-3">
        <h5>Data</h5>
        <p>{formatDate(reservation.reservationDate)}</p>
      </div>

      <div className="mb-3">
        <h5>Orario</h5>
        <p>{reservation.reservationTime.substring(0, 5)}</p>
      </div>

      <div className="mb-3">
        <h5>Numero di persone</h5>
        <p>{reservation.numberOfPeople}</p>
      </div>

      <div className="mb-3">
        <h5>Area</h5>
        <p>
          {reservation.reservationArea === "INDOOR" ? "Interno" : "Esterno"}
        </p>
      </div>

      <div className="mb-3">
        <h5>ID Prenotazione</h5>
        <p>{reservation.id}</p>
      </div>

      <div className="alert alert-info mt-3">
        Se hai bisogno di modificare o annullare questa prenotazione, puoi farlo
        fino a 24 ore prima dell'orario prenotato.
      </div>
    </div>
  );
};

export default ReservationDetail;
