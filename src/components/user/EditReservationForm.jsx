// src/components/user/EditReservationForm.jsx
import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { updateReservation } from "../../services/userReservationService";

const EditReservationForm = ({ reservation, onSave }) => {
  const [formData, setFormData] = useState({
    reservationDate: "",
    reservationTime: "",
    numberOfPeople: 1,
    reservationArea: "INDOOR",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (reservation) {
      setFormData({
        reservationDate: reservation.reservationDate,
        reservationTime: reservation.reservationTime.substring(0, 5),
        numberOfPeople: reservation.numberOfPeople,
        reservationArea: reservation.reservationArea,
      });
    }
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
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

      await updateReservation(reservation.id, formData);

      const updatedReservation = {
        ...reservation,
        ...formData,
        id: reservation.id,
      };

      setSuccess(true);

      setTimeout(() => {
        if (onSave) onSave(updatedReservation);
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

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">Prenotazione aggiornata con successo!</Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Data</Form.Label>
          <Form.Control
            type="date"
            name="reservationDate"
            value={formData.reservationDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            required
            disabled={loading || success}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Orario</Form.Label>
          <div className="d-flex gap-2">
            <Form.Select
              name="reservationTime"
              value={isLunchTime() ? formData.reservationTime : ""}
              onChange={(e) => {
                const value = e.target.value;
                handleChange({
                  target: { name: "reservationTime", value: value || "" },
                });
              }}
              disabled={loading || success}
            >
              <option value="">Pranzo</option>
              {["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"].map(
                (time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                )
              )}
            </Form.Select>

            <Form.Select
              name="reservationTime"
              value={isDinnerTime() ? formData.reservationTime : ""}
              onChange={(e) => {
                const value = e.target.value;
                handleChange({
                  target: { name: "reservationTime", value: value || "" },
                });
              }}
              disabled={loading || success}
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
            </Form.Select>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ospiti</Form.Label>
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
                disabled={formData.numberOfPeople <= 1 || loading || success}
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
                disabled={formData.numberOfPeople >= 20 || loading || success}
                style={{ width: "60px" }}
              >
                <i className="bi bi-plus-lg">+</i>
              </button>
            </div>
          </div>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Zona</Form.Label>
          <div className="d-flex gap-2">
            <Button
              type="button"
              variant={
                formData.reservationArea === "INDOOR"
                  ? "primary"
                  : "outline-primary"
              }
              className="flex-grow-1"
              onClick={() =>
                setFormData({ ...formData, reservationArea: "INDOOR" })
              }
              disabled={loading || success}
            >
              Interno
            </Button>
            <Button
              type="button"
              variant={
                formData.reservationArea === "OUTDOOR"
                  ? "primary"
                  : "outline-primary"
              }
              className="flex-grow-1"
              onClick={() =>
                setFormData({ ...formData, reservationArea: "OUTDOOR" })
              }
              disabled={loading || success}
            >
              Esterno
            </Button>
          </div>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100 mt-3"
          disabled={loading || success}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Salvataggio in corso...
            </>
          ) : success ? (
            "Salvato"
          ) : (
            "Salva Modifiche"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default EditReservationForm;
