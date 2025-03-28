import React, { useState, useEffect } from "react";
import {
  fetchAllReservations,
  deleteReservation,
  getReservationsByDate,
} from "../services/reservationService";
import { useAuth } from "../context/AuthContext";
import {
  Modal,
  Button,
  Spinner,
  Card,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminPanel = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadReservations();
  }, [selectedDate]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getReservationsByDate(selectedDate);
      setReservations(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa prenotazione?")) {
      return;
    }

    try {
      await deleteReservation(id);
      setReservations(reservations.filter((res) => res.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSelectedReservation(null);
    }, 300);
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
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center mb-4">Pannello Amministratore</h1>

        <Form className="mb-4">
          <Form.Group>
            <Form.Label className="fw-bold">Seleziona una data:</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="mb-2"
            />
          </Form.Group>
        </Form>

        {error && (
          <motion.div
            className="alert alert-danger mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Caricamento prenotazioni...</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {reservations.length === 0 ? (
              <motion.div
                className="alert alert-info text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Nessuna prenotazione trovata per questa data.
              </motion.div>
            ) : (
              <Row>
                {reservations.map((reservation) => (
                  <Col key={reservation.id} md={4} className="mb-4">
                    <motion.div variants={cardVariants}>
                      <Card className="h-100 shadow-sm">
                        <Card.Header className="bg-primary text-white">
                          <h5 className="mb-0">
                            Prenotazione #{reservation.id}
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <p>
                            <strong>Data:</strong> {reservation.reservationDate}
                          </p>
                          <p>
                            <strong>Ora:</strong> {reservation.reservationTime}
                          </p>
                          <p>
                            <strong>Persone:</strong>{" "}
                            {reservation.numberOfPeople}
                          </p>
                          <p>
                            <strong>Area:</strong>{" "}
                            {reservation.reservationArea === "INDOOR"
                              ? "Interno"
                              : "Esterno"}
                          </p>
                          <p>
                            <strong>Cliente:</strong> {reservation.userFullName}
                          </p>
                        </Card.Body>
                        <Card.Footer className="bg-white">
                          <div className="d-flex justify-content-between">
                            <motion.button
                              className="btn btn-info me-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewDetails(reservation)}
                            >
                              Dettagli
                            </motion.button>
                            <motion.button
                              className="btn btn-danger"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(reservation.id)}
                            >
                              Elimina
                            </motion.button>
                          </div>
                        </Card.Footer>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </motion.div>
        )}
      </motion.div>

      <Modal show={showModal} onHide={closeModal} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Dettagli Prenotazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReservation && (
            <div>
              <p>
                <strong>ID:</strong> {selectedReservation.id}
              </p>
              <p>
                <strong>Data:</strong> {selectedReservation.reservationDate}
              </p>
              <p>
                <strong>Ora:</strong> {selectedReservation.reservationTime}
              </p>
              <p>
                <strong>Persone:</strong> {selectedReservation.numberOfPeople}
              </p>
              <p>
                <strong>Area:</strong>{" "}
                {selectedReservation.reservationArea === "INDOOR"
                  ? "Interno"
                  : "Esterno"}
              </p>
              <p>
                <strong>Cliente:</strong> {selectedReservation.userFullName}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {selectedReservation.userEmail || "Non disponibile"}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPanel;
