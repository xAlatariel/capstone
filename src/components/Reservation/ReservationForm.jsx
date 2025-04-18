import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
// ---------------------- INIZIO MODIFICHE SICUREZZA ----------------------
import { validateReservation } from "../../services/reservationService";
import apiService from "../../services/apiService";
import Alert from "../common/Allert";
// ---------------------- FINE MODIFICHE SICUREZZA ----------------------

const ReservationForm = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reservationDate: "",
    reservationTime: "",
    numberOfPeople: 1,
    reservationArea: "INDOOR",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // ---------------------- INIZIO MODIFICHE SICUREZZA ----------------------
    // Reset degli errori quando l'utente modifica i dati
    setError("");
    // ---------------------- FINE MODIFICHE SICUREZZA ----------------------
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!token) {
        throw new Error("Effettua il login per prenotare un tavolo.");
      }

      // ---------------------- INIZIO MODIFICHE SICUREZZA ----------------------
      // Validazione dei dati di prenotazione
      const validationErrors = validateReservation(formData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(". "));
      }

      // Controllo aggiuntivo per verificare che la data/ora selezionata sia futura
      const selectedDate = new Date(formData.reservationDate);
      const timeParts = formData.reservationTime.split(":");
      const selectedDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        parseInt(timeParts[0]),
        parseInt(timeParts[1])
      );

      if (selectedDateTime < new Date()) {
        throw new Error("Seleziona una data/ora futura");
      }
      // ---------------------- FINE MODIFICHE SICUREZZA ----------------------

      const requestBody = {
        reservationDate: formData.reservationDate,
        reservationTime: formData.reservationTime + ":00",
        numberOfPeople: parseInt(formData.numberOfPeople),
        reservationArea: formData.reservationArea.toUpperCase(),
        role: user?.role || "USER",
      };

      console.log("Dati inviati:", JSON.stringify(requestBody, null, 2));

      // ---------------------- INIZIO MODIFICHE SICUREZZA ----------------------
      await apiService.createReservation(requestBody);
      // ---------------------- FINE MODIFICHE SICUREZZA ----------------------

      setSuccess(true);
      setTimeout(() => {
        setFormData({
          reservationDate: "",
          reservationTime: "",
          numberOfPeople: 1,
          reservationArea: "INDOOR",
        });
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isLunchTime = () => {
    const hour = formData.reservationTime
      ? parseInt(formData.reservationTime.split(":")[0])
      : 0;
    return hour >= 12 && hour < 15;
  };

  const isDinnerTime = () => {
    const hour = formData.reservationTime
      ? parseInt(formData.reservationTime.split(":")[0])
      : 0;
    return hour >= 18 && hour <= 23;
  };

  if (!token) {
    return (
      <div className="auth-alert">
        <p>Effettua il login per prenotare un tavolo</p>
      </div>
    );
  }

  return (
    <div
      className="container my-4"
      style={{ display: "flex", alignItems: "center" }}
    >
      <div
        className="card shadow border"
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "auto",
          marginTop: "20px",
        }}
      >
        <div className="card-body p-4">
          <h2 className="reservation-title text-center mb-4">
            Prenota un Tavolo
          </h2>

          {/* ---------------------- INIZIO MODIFICHE SICUREZZA ---------------------- */}
          <Alert type="danger" message={error} onClose={() => setError("")} />

          <Alert
            type="success"
            message={success ? "Prenotazione confermata!" : ""}
          />
          {/* ---------------------- FINE MODIFICHE SICUREZZA ---------------------- */}

          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="mb-3">
              <label htmlFor="reservationDate" className="form-label">
                Data:
              </label>
              <input
                type="date"
                id="reservationDate"
                name="reservationDate"
                value={formData.reservationDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="form-control"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Orario:</label>
              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  value={isLunchTime() ? formData.reservationTime : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleChange({
                      target: { name: "reservationTime", value: value || "" },
                    });
                  }}
                  required={!formData.reservationTime}
                  disabled={loading}
                >
                  <option value="">Pranzo</option>
                  {["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"].map(
                    (time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    )
                  )}
                </select>

                <select
                  className="form-select"
                  value={isDinnerTime() ? formData.reservationTime : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleChange({
                      target: { name: "reservationTime", value: value || "" },
                    });
                  }}
                  required={!formData.reservationTime}
                  disabled={loading}
                >
                  <option value="">Cena</option>
                  {[
                    "19:00",
                    "19:30",
                    "20:00",
                    "20:30",
                    "21:00",
                    "21:30",
                    "22:00",
                    "22:30",
                  ].map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Ospiti:</label>
              <div className="d-flex justify-content-center">
                <div className="input-group" style={{ maxWidth: "350px" }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() =>
                      formData.numberOfPeople > 1 &&
                      setFormData({
                        ...formData,
                        numberOfPeople: formData.numberOfPeople - 1,
                      })
                    }
                    disabled={formData.numberOfPeople <= 1 || loading}
                    style={{ width: "60px" }}
                  >
                    <i className="bi bi-dash-lg">-</i>
                  </button>
                  <input
                    type="text"
                    className="form-control text-center fw-bold"
                    value={
                      formData.numberOfPeople +
                      (formData.numberOfPeople === 1 ? " persona" : " persone")
                    }
                    readOnly
                    style={{ minWidth: "200px" }}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() =>
                      formData.numberOfPeople < 20 &&
                      setFormData({
                        ...formData,
                        numberOfPeople: formData.numberOfPeople + 1,
                      })
                    }
                    disabled={formData.numberOfPeople >= 20 || loading}
                    style={{ width: "60px" }}
                  >
                    <i className="bi bi-plus-lg">+</i>
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Zona</label>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`btn ${
                    formData.reservationArea === "INDOOR"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  } flex-grow-1`}
                  onClick={() =>
                    handleChange({
                      target: { name: "reservationArea", value: "INDOOR" },
                    })
                  }
                  disabled={loading}
                >
                  Interno
                </button>
                <button
                  type="button"
                  className={`btn ${
                    formData.reservationArea === "OUTDOOR"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  } flex-grow-1`}
                  onClick={() =>
                    handleChange({
                      target: { name: "reservationArea", value: "OUTDOOR" },
                    })
                  }
                  disabled={loading}
                >
                  Esterno
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  <span>Prenotazione in corso...</span>
                </>
              ) : (
                "Conferma Prenotazione"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
