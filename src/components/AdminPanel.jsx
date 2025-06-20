// =================================================================
// SOSTITUZIONE COMPLETA per src/components/AdminPanel.jsx
// =================================================================

import React, { useState, useEffect } from "react";
import {
  fetchAllReservations,
  deleteReservation,
  getReservationsByDate,
} from "../services/reservationService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Spinner,
  Card,
  Container,
  Row,
  Col,
  Form,
  Alert,
  Badge
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaUtensils, 
  FaCog, 
  FaChartBar,
  FaEye,
  FaTrash
} from "react-icons/fa";
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
  const [stats, setStats] = useState({
    totalReservations: 0,
    todayReservations: 0,
    totalMenus: 0,
    activeMenus: 0
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadReservations();
    loadStats();
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

  const loadStats = async () => {
    try {
      // Qui potresti aggiungere chiamate API per le statistiche
      // Per ora uso valori placeholder
      setStats({
        totalReservations: reservations.length,
        todayReservations: reservations.filter(r => 
          r.reservationDate === new Date().toISOString().split("T")[0]
        ).length,
        totalMenus: 0, // Da implementare con API
        activeMenus: 0 // Da implementare con API
      });
    } catch (err) {
      console.error("Errore caricamento statistiche:", err);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa prenotazione?"))
      return;

    try {
      await deleteReservation(id);
      setReservations(reservations.filter((r) => r.id !== id));
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
    setSelectedReservation(null);
  };

  // Animazioni
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ backgroundColor: '#F0EBDE', minHeight: '100vh', paddingTop: '2rem' }}
    >
      <Container>
        {/* Header */}
        <motion.div variants={cardVariants}>
          <Card className="shadow-lg border-0 mb-4">
            <Card.Header className="bg-primary text-white">
              <Row className="align-items-center">
                <Col>
                  <h2 className="mb-0">Pannello Amministratore</h2>
                  <small>Benvenuto, {user?.name}</small>
                </Col>
                <Col xs="auto">
                  <Badge bg="success" className="fs-6">
                    Admin
                  </Badge>
                </Col>
              </Row>
            </Card.Header>
          </Card>
        </motion.div>

        {/* Statistiche */}
        <motion.div variants={cardVariants}>
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="bg-primary text-white border-0 shadow">
                <Card.Body className="text-center">
                  <FaCalendarAlt size={30} className="mb-2" />
                  <h4>{stats.todayReservations}</h4>
                  <small>Prenotazioni Oggi</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="bg-success text-white border-0 shadow">
                <Card.Body className="text-center">
                  <FaUsers size={30} className="mb-2" />
                  <h4>{stats.totalReservations}</h4>
                  <small>Totale Prenotazioni</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="bg-warning text-white border-0 shadow">
                <Card.Body className="text-center">
                  <FaUtensils size={30} className="mb-2" />
                  <h4>{stats.activeMenus}</h4>
                  <small>Menu Attivi</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="bg-info text-white border-0 shadow">
                <Card.Body className="text-center">
                  <FaChartBar size={30} className="mb-2" />
                  <h4>{stats.totalMenus}</h4>
                  <small>Totale Menu</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* Azioni Amministrative */}
        <motion.div variants={cardVariants}>
          <Card className="shadow-lg border-0 mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <FaCog className="me-2" />
                Azioni Amministrative
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} lg={4} className="mb-3">
                  <Button
                    variant="success"
                    size="lg"
                    className="w-100 d-flex align-items-center justify-content-center"
                    onClick={() => navigate('/admin/menus')}
                  >
                    <FaUtensils className="me-2" />
                    Gestione Menu
                  </Button>
                </Col>
                <Col md={6} lg={4} className="mb-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 d-flex align-items-center justify-content-center"
                    onClick={() => navigate('/admin/reservations')}
                    disabled
                  >
                    <FaCalendarAlt className="me-2" />
                    Gestione Prenotazioni
                  </Button>
                </Col>
                <Col md={6} lg={4} className="mb-3">
                  <Button
                    variant="warning"
                    size="lg"
                    className="w-100 d-flex align-items-center justify-content-center"
                    onClick={() => navigate('/admin/users')}
                    disabled
                  >
                    <FaUsers className="me-2" />
                    Gestione Utenti
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Sezione Prenotazioni */}
        <motion.div variants={cardVariants}>
          <Card className="shadow-lg border-0 mb-4">
            <Card.Header className="bg-light">
              <Row className="align-items-center">
                <Col>
                  <h5 className="mb-0">
                    <FaCalendarAlt className="me-2" />
                    Prenotazioni per Data
                  </h5>
                </Col>
                <Col xs="auto">
                  <Form.Group className="mb-0">
                    <Form.Control
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Caricamento prenotazioni...</p>
                </div>
              ) : (
                <motion.div variants={containerVariants}>
                  {reservations.length === 0 ? (
                    <Alert variant="info" className="text-center">
                      <FaCalendarAlt size={48} className="mb-3" />
                      <h5>Nessuna prenotazione</h5>
                      <p>Non ci sono prenotazioni per la data selezionata.</p>
                    </Alert>
                  ) : (
                    <Row>
                      {reservations.map((reservation) => (
                        <Col md={6} lg={4} key={reservation.id} className="mb-3">
                          <motion.div
                            variants={cardVariants}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Card className="h-100 border-0 shadow-sm">
                              <Card.Header className={`text-white ${
                                reservation.reservationArea === "INDOOR" 
                                  ? "bg-primary" 
                                  : "bg-success"
                              }`}>
                                <Row className="align-items-center">
                                  <Col>
                                    <strong>#{reservation.id}</strong>
                                  </Col>
                                  <Col xs="auto">
                                    <Badge bg="light" text="dark">
                                      {reservation.reservationTime}
                                    </Badge>
                                  </Col>
                                </Row>
                              </Card.Header>
                              
                              <Card.Body>
                                <p className="mb-2">
                                  <strong>Persone:</strong> {reservation.numberOfPeople}
                                </p>
                                <p className="mb-2">
                                  <strong>Area:</strong>{" "}
                                  {reservation.reservationArea === "INDOOR"
                                    ? "Interno"
                                    : "Esterno"}
                                </p>
                                <p className="mb-0">
                                  <strong>Cliente:</strong> {reservation.userFullName}
                                </p>
                              </Card.Body>
                              
                              <Card.Footer className="bg-white border-top-0">
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleViewDetails(reservation)}
                                    className="flex-fill"
                                  >
                                    <FaEye className="me-1" />
                                    Dettagli
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(reservation.id)}
                                  >
                                    <FaTrash />
                                  </Button>
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
            </Card.Body>
          </Card>
        </motion.div>
      </Container>

      {/* Modal Dettagli Prenotazione */}
      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCalendarAlt className="me-2" />
            Dettagli Prenotazione #{selectedReservation?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReservation && (
            <Row>
              <Col md={6}>
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h6 className="text-primary mb-3">Informazioni Prenotazione</h6>
                    <p><strong>Data:</strong> {selectedReservation.reservationDate}</p>
                    <p><strong>Ora:</strong> {selectedReservation.reservationTime}</p>
                    <p><strong>Persone:</strong> {selectedReservation.numberOfPeople}</p>
                    <p><strong>Area:</strong>{" "}
                      <Badge bg={selectedReservation.reservationArea === "INDOOR" ? "primary" : "success"}>
                        {selectedReservation.reservationArea === "INDOOR" ? "Interno" : "Esterno"}
                      </Badge>
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h6 className="text-primary mb-3">Informazioni Cliente</h6>
                    <p><strong>Nome:</strong> {selectedReservation.userFullName}</p>
                    <p><strong>Email:</strong> {selectedReservation.userEmail || "Non disponibile"}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

export default AdminPanel;