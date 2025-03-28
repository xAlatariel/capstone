import React, { useState } from "react";
import { Card, Button, Row, Col, Modal } from "react-bootstrap";
import { deleteReservation } from "../../services/reservationService";
import ReservationDetail from "./ReservationDetail";
import EditReservationForm from "./EditReservationForm.jsx";
import { motion } from "framer-motion";

const themeColor = "#01796F";

const UserReservationsList = ({ reservations, onReservationDeleted }) => {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState("");

  const handleView = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetailModal(true);
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questa prenotazione?")) {
      try {
        await deleteReservation(id);
        onReservationDeleted(id);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedReservation(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedReservation(null);
  };

  const isUpcoming = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split("-");
    const [hours, minutes] = timeStr.split(":");
    const reservationDate = new Date(year, month - 1, day, hours, minutes);
    return reservationDate > new Date();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <>
      {error && (
        <motion.div
          className="alert alert-danger"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Row>
          {reservations.map((reservation) => {
            const upcoming = isUpcoming(
              reservation.reservationDate,
              reservation.reservationTime
            );

            return (
              <Col key={reservation.id} md={6} lg={4} className="mb-4">
                <motion.div variants={cardVariants}>
                  <Card
                    style={{
                      borderColor: upcoming ? themeColor : "#dee2e6",
                      maxWidth: "95%",
                      margin: "0 auto",
                      boxShadow: upcoming
                        ? "0 4px 6px rgba(1, 121, 111, 0.1)"
                        : "none",
                      borderRadius: "8px",
                    }}
                  >
                    <Card.Header
                      style={{
                        backgroundColor: upcoming ? themeColor : "#f8f9fa",
                        color: upcoming ? "white" : "inherit",
                        fontWeight: upcoming ? "500" : "normal",
                        borderTopLeftRadius: "7px",
                        borderTopRightRadius: "7px",
                      }}
                    >
                      {upcoming
                        ? "Prenotazione futura"
                        : "Prenotazione passata"}
                    </Card.Header>
                    <Card.Body>
                      <Card.Title className="mb-3">
                        {new Date(
                          reservation.reservationDate
                        ).toLocaleDateString("it-IT", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Card.Title>
                      <Card.Text>
                        <strong>Ora:</strong>{" "}
                        {reservation.reservationTime.substring(0, 5)}
                        <br />
                        <strong>Persone:</strong> {reservation.numberOfPeople}
                        <br />
                        <strong>Zona:</strong>{" "}
                        {reservation.reservationArea === "INDOOR"
                          ? "Interno"
                          : "Esterno"}
                      </Card.Text>

                      <div className="d-flex justify-content-between mt-3">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleView(reservation)}
                          style={{
                            borderColor: themeColor,
                            color: themeColor,
                            borderRadius: "4px",
                          }}
                          className="btn-hover-effect"
                        >
                          Dettagli
                        </Button>

                        {upcoming && (
                          <>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleEdit(reservation)}
                              style={{
                                borderColor: themeColor,
                                color: themeColor,
                                borderRadius: "4px",
                              }}
                              className="btn-hover-effect"
                            >
                              Modifica
                            </Button>

                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(reservation.id)}
                              style={{
                                borderRadius: "4px",
                              }}
                            >
                              Elimina
                            </Button>
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            );
          })}
        </Row>
      </motion.div>

      {/* Modale Dettagli */}
      <Modal show={showDetailModal} onHide={closeDetailModal}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: themeColor, color: "white" }}
        >
          <Modal.Title>Dettagli Prenotazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReservation && (
            <ReservationDetail reservation={selectedReservation} />
          )}
        </Modal.Body>
      </Modal>

      {/* Modale Modifica */}
      <Modal show={showEditModal} onHide={closeEditModal}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: themeColor, color: "white" }}
        >
          <Modal.Title>Modifica Prenotazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReservation && (
            <EditReservationForm
              reservation={selectedReservation}
              onSave={(updatedReservation) => {
                closeEditModal();
                if (onReservationDeleted && updatedReservation) {
                  onReservationDeleted(null, updatedReservation);
                } else {
                  window.location.reload();
                }
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .btn-hover-effect:hover {
          background-color: ${themeColor} !important;
          color: white !important;
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default UserReservationsList;
