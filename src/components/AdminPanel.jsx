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
  Badge,
  Table
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaUtensils, 
  FaCog, 
  FaChartBar,
  FaEye,
  FaTrash,
  FaTachometerAlt,
  FaUserCog,
  FaBookOpen
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
      setStats({
        totalReservations: reservations.length,
        todayReservations: reservations.filter(r => 
          r.reservationDate === new Date().toISOString().split("T")[0]
        ).length,
        totalMenus: 0,
        activeMenus: 0
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
        {/* Header Migliorato */}
        <motion.div variants={cardVariants}>
          <Card className="shadow-lg border-0 mb-4" style={{ background: 'linear-gradient(135deg, #5D4037 0%, #8D6E63 100%)' }}>
            <Card.Header className="text-white border-0" style={{ background: 'transparent' }}>
              <Row className="align-items-center">
                <Col>
                  <div className="d-flex align-items-center">
                    <FaTachometerAlt size={32} className="me-3" />
                    <div>
                      <h2 className="mb-0 fw-bold">Pannello Amministratore</h2>
                      <small className="opacity-75">Benvenuto, {user?.email}</small>
                    </div>
                  </div>
                </Col>
                <Col xs="auto">
                  <Badge bg="warning" text="dark" className="fs-6 px-3 py-2">
                    <FaUserCog className="me-1" />
                    Admin
                  </Badge>
                </Col>
              </Row>
            </Card.Header>
          </Card>
        </motion.div>

        {/* Statistiche Rapide */}
        <motion.div variants={cardVariants}>
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)', color: 'white' }}>
                <Card.Body>
                  <FaCalendarAlt size={32} className="mb-2" />
                  <h4 className="fw-bold">{stats.todayReservations}</h4>
                  <small>Prenotazioni Oggi</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)', color: 'white' }}>
                <Card.Body>
                  <FaUsers size={32} className="mb-2" />
                  <h4 className="fw-bold">{stats.totalReservations}</h4>
                  <small>Totale Prenotazioni</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)', color: 'white' }}>
                <Card.Body>
                  <FaUtensils size={32} className="mb-2" />
                  <h4 className="fw-bold">{stats.activeMenus}</h4>
                  <small>Menu Attivi</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)', color: 'white' }}>
                <Card.Body>
                  <FaBookOpen size={32} className="mb-2" />
                  <h4 className="fw-bold">{stats.totalMenus}</h4>
                  <small>Totale Menu</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* Azioni Amministrative Migliorate */}
        // Nel tuo file src/components/AdminPanel.jsx
// Trova la sezione "Azioni Amministrative" e sostituisci TUTTA questa parte:

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
          <div className="position-relative">
            <Button
              variant="primary"
              size="lg"
              className="w-100 d-flex align-items-center justify-content-center"
              onClick={() => alert('Funzionalità in sviluppo')}
              style={{ opacity: 0.7 }}
            >
              <FaCalendarAlt className="me-2" />
              Gestione Prenotazioni
            </Button>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
              Presto
            </span>
          </div>
        </Col>
        
        <Col md={6} lg={4} className="mb-3">
          <div className="position-relative">
            <Button
              variant="warning"
              size="lg"
              className="w-100 d-flex align-items-center justify-content-center"
              onClick={() => alert('Funzionalità in sviluppo')}
              style={{ opacity: 0.7, color: 'white' }}
            >
              <FaUsers className="me-2" />
              Gestione Utenti
            </Button>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
              Presto
            </span>
          </div>
        </Col>
      </Row>
    </Card.Body>
  </Card>
</motion.div>

        {/* Sezione Prenotazioni */}
        <motion.div variants={cardVariants}>
          <Card className="shadow-lg border-0 mb-4">
            <Card.Header style={{ backgroundColor: '#5D4037', color: 'white' }}>
              <Row className="align-items-center">
                <Col>
                  <h5 className="mb-0 fw-bold">
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
                      style={{ 
                        borderRadius: '8px',
                        border: '2px solid #8D6E63'
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body style={{ backgroundColor: '#FAFAFA' }}>
              {error && (
                <Alert variant="danger" className="mb-3">
                  <strong>Errore:</strong> {error}
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="lg" />
                  <p className="mt-3 fw-bold">Caricamento prenotazioni...</p>
                </div>
              ) : (
                <motion.div variants={containerVariants}>
                  {reservations.length === 0 ? (
                    <Alert variant="info" className="text-center py-5">
                      <FaCalendarAlt size={64} className="mb-3 opacity-50" />
                      <h5 className="fw-bold">Nessuna prenotazione</h5>
                      <p className="mb-0">Non ci sono prenotazioni per la data selezionata.</p>
                    </Alert>
                  ) : (
                    <div className="table-responsive">
                      <Table striped hover className="mb-0">
                        <thead style={{ backgroundColor: '#8D6E63', color: 'white' }}>
                          <tr>
                            <th>Cliente</th>
                            <th>Email</th>
                            <th>Persone</th>
                            <th>Orario</th>
                            <th>Area</th>
                            <th>Azioni</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations.map((reservation) => (
                            <motion.tr
                              key={reservation.id}
                              variants={cardVariants}
                              whileHover={{ backgroundColor: '#F5F5F5' }}
                            >
                              <td className="fw-bold">{reservation.name}</td>
                              <td>{reservation.email}</td>
                              <td>
                                <Badge bg="primary" className="px-2 py-1">
                                  {reservation.partySize} persone
                                </Badge>
                              </td>
                              <td>{reservation.reservationTime}</td>
                              <td>
                                <Badge 
                                  bg={reservation.reservationArea === "INDOOR" ? "success" : "info"}
                                  className="px-2 py-1"
                                >
                                  {reservation.reservationArea === "INDOOR" ? "Interno" : "Esterno"}
                                </Badge>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleViewDetails(reservation)}
                                  >
                                    <FaEye />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(reservation.id)}
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </motion.div>
              )}
            </Card.Body>
          </Card>
        </motion.div>

        {/* Modal Dettagli Prenotazione */}
        <Modal show={showModal} onHide={closeModal} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#8D6E63', color: 'white' }}>
            <Modal.Title>
              <FaEye className="me-2" />
              Dettagli Prenotazione
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#F9F9F9' }}>
            {selectedReservation && (
              <div>
                <Row className="mb-3">
                  <Col><strong>Nome:</strong></Col>
                  <Col>{selectedReservation.name}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><strong>Email:</strong></Col>
                  <Col>{selectedReservation.email}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><strong>Telefono:</strong></Col>
                  <Col>{selectedReservation.phone}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><strong>Data:</strong></Col>
                  <Col>{selectedReservation.reservationDate}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><strong>Orario:</strong></Col>
                  <Col>{selectedReservation.reservationTime}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><strong>Persone:</strong></Col>
                  <Col>{selectedReservation.partySize}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><strong>Area:</strong></Col>
                  <Col>
                    <Badge 
                      bg={selectedReservation.reservationArea === "INDOOR" ? "success" : "info"}
                    >
                      {selectedReservation.reservationArea === "INDOOR" ? "Interno" : "Esterno"}
                    </Badge>
                  </Col>
                </Row>
                {selectedReservation.specialRequests && (
                  <Row className="mb-3">
                    <Col><strong>Richieste Speciali:</strong></Col>
                    <Col>{selectedReservation.specialRequests}</Col>
                  </Row>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#F9F9F9' }}>
            <Button variant="secondary" onClick={closeModal}>
              Chiudi
            </Button>
            <Button variant="danger" onClick={() => {
              handleDelete(selectedReservation?.id);
              closeModal();
            }}>
              <FaTrash className="me-2" />
              Elimina
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </motion.div>
  );
};

export default AdminPanel;