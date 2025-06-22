import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  Table, 
  Button, 
  Form, 
  Row, 
  Col, 
  Badge, 
  Modal, 
  Alert,
  Spinner,
  InputGroup,
  Dropdown,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaTrash, 
  FaEdit,
  FaUsers,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaDownload,
  FaSyncAlt
} from 'react-icons/fa';
import { 
  fetchAllReservations, 
  getReservationsByDate, 
  deleteReservation
} from '../../services/reservationService';

// Funzione helper per aggiornare lo stato della prenotazione
const updateReservationStatus = async (reservationId, newStatus) => {
  // Per ora simuliamo la chiamata API
  // In futuro questa funzione dovrebbe essere aggiunta al reservationService
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Stati per statistiche
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    indoor: 0,
    outdoor: 0
  });

  useEffect(() => {
    loadReservations();
  }, [selectedDate]);

  useEffect(() => {
    filterReservations();
    updateStats();
  }, [reservations, searchTerm, statusFilter, areaFilter]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError('');
      
      let data;
      if (selectedDate) {
        data = await getReservationsByDate(selectedDate);
      } else {
        data = await fetchAllReservations();
      }
      
      setReservations(data);
    } catch (err) {
      setError(err.message || 'Errore nel caricamento delle prenotazioni');
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = [...reservations];

    // Filtro per termine di ricerca
    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.phone?.includes(searchTerm)
      );
    }

    // Filtro per stato
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => 
        reservation.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filtro per area
    if (areaFilter !== 'all') {
      filtered = filtered.filter(reservation => 
        reservation.reservationArea?.toLowerCase() === areaFilter.toLowerCase()
      );
    }

    setFilteredReservations(filtered);
  };

  const updateStats = () => {
    const total = reservations.length;
    const confirmed = reservations.filter(r => r.status === 'CONFIRMED').length;
    const pending = reservations.filter(r => r.status === 'PENDING').length;
    const cancelled = reservations.filter(r => r.status === 'CANCELLED').length;
    const indoor = reservations.filter(r => r.reservationArea === 'INDOOR').length;
    const outdoor = reservations.filter(r => r.reservationArea === 'OUTDOOR').length;

    setStats({ total, confirmed, pending, cancelled, indoor, outdoor });
  };

  const handleDeleteReservation = async (id) => {
    try {
      await deleteReservation(id);
      setReservations(reservations.filter(r => r.id !== id));
      setShowDeleteModal(false);
      setSelectedReservation(null);
    } catch (err) {
      setError(err.message || 'Errore nell\'eliminazione della prenotazione');
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await updateReservationStatus(reservationId, newStatus);
      setReservations(reservations.map(r => 
        r.id === reservationId ? { ...r, status: newStatus } : r
      ));
    } catch (err) {
      setError(err.message || 'Errore nell\'aggiornamento dello stato');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'CONFIRMED': { bg: 'success', text: 'Confermata' },
      'PENDING': { bg: 'warning', text: 'In Attesa' },
      'CANCELLED': { bg: 'danger', text: 'Cancellata' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getAreaBadge = (area) => {
    return (
      <Badge bg={area === 'INDOOR' ? 'primary' : 'info'}>
        <FaMapMarkerAlt className="me-1" size={10} />
        {area === 'INDOOR' ? 'Interno' : 'Esterno'}
      </Badge>
    );
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Telefono', 'Data', 'Orario', 'Persone', 'Area', 'Stato'];
    const csvContent = [
      headers.join(','),
      ...filteredReservations.map(r => [
        r.name,
        r.email,
        r.phone,
        r.reservationDate,
        r.reservationTime,
        r.partySize,
        r.reservationArea,
        r.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prenotazioni_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      <Container fluid>
        {/* Header */}
        <motion.div variants={cardVariants}>
          <Card className="shadow-lg border-0 mb-4">
            <Card.Header style={{ background: 'linear-gradient(135deg, #5D4037 0%, #8D6E63 100%)', color: 'white' }}>
              <Row className="align-items-center">
                <Col>
                  <h3 className="mb-0 fw-bold">
                    <FaCalendarAlt className="me-2" />
                    Gestione Prenotazioni
                  </h3>
                </Col>
                <Col xs="auto">
                  <div className="d-flex gap-2">
                    <Button 
                      variant="light" 
                      size="sm" 
                      onClick={loadReservations}
                      disabled={loading}
                    >
                      <FaSyncAlt className={loading ? 'fa-spin' : ''} />
                    </Button>
                    <Button 
                      variant="success" 
                      size="sm" 
                      onClick={exportToCSV}
                      disabled={filteredReservations.length === 0}
                    >
                      <FaDownload className="me-1" />
                      Esporta CSV
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Header>
          </Card>
        </motion.div>

        {/* Statistiche */}
        <motion.div variants={cardVariants}>
          <Row className="mb-4">
            <Col md={2} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)', color: 'white' }}>
                <Card.Body className="py-3">
                  <h4 className="fw-bold mb-1">{stats.total}</h4>
                  <small>Totale</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)', color: 'white' }}>
                <Card.Body className="py-3">
                  <h4 className="fw-bold mb-1">{stats.confirmed}</h4>
                  <small>Confermate</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)', color: 'white' }}>
                <Card.Body className="py-3">
                  <h4 className="fw-bold mb-1">{stats.pending}</h4>
                  <small>In Attesa</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)', color: 'white' }}>
                <Card.Body className="py-3">
                  <h4 className="fw-bold mb-1">{stats.cancelled}</h4>
                  <small>Cancellate</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)', color: 'white' }}>
                <Card.Body className="py-3">
                  <h4 className="fw-bold mb-1">{stats.indoor}</h4>
                  <small>Interno</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #00BCD4 0%, #26C6DA 100%)', color: 'white' }}>
                <Card.Body className="py-3">
                  <h4 className="fw-bold mb-1">{stats.outdoor}</h4>
                  <small>Esterno</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* Filtri */}
        <motion.div variants={cardVariants}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <Row className="align-items-end">
                <Col md={3} className="mb-2">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Cerca</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Nome, email o telefono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={2} className="mb-2">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Data</Form.Label>
                    <Form.Control
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="mb-2">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Stato</Form.Label>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Tutti</option>
                      <option value="confirmed">Confermate</option>
                      <option value="pending">In Attesa</option>
                      <option value="cancelled">Cancellate</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2} className="mb-2">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Area</Form.Label>
                    <Form.Select
                      value={areaFilter}
                      onChange={(e) => setAreaFilter(e.target.value)}
                    >
                      <option value="all">Tutte</option>
                      <option value="indoor">Interno</option>
                      <option value="outdoor">Esterno</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-2">
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedDate('');
                        setStatusFilter('all');
                        setAreaFilter('all');
                      }}
                    >
                      <FaFilter className="me-1" />
                      Reset Filtri
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Tabella Prenotazioni */}
        <motion.div variants={cardVariants}>
          <Card className="shadow-lg border-0">
            <Card.Header style={{ backgroundColor: '#8D6E63', color: 'white' }}>
              <h5 className="mb-0 fw-bold">
                Prenotazioni ({filteredReservations.length})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {error && (
                <Alert variant="danger" className="m-3">
                  <strong>Errore:</strong> {error}
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="lg" />
                  <p className="mt-3">Caricamento prenotazioni...</p>
                </div>
              ) : filteredReservations.length === 0 ? (
                <div className="text-center py-5">
                  <FaCalendarAlt size={64} className="text-muted mb-3" />
                  <h5>Nessuna prenotazione trovata</h5>
                  <p className="text-muted">
                    {searchTerm || selectedDate || statusFilter !== 'all' || areaFilter !== 'all' 
                      ? 'Prova a modificare i filtri di ricerca' 
                      : 'Non ci sono prenotazioni al momento'
                    }
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead style={{ backgroundColor: '#F5F5F5' }}>
                      <tr>
                        <th>Cliente</th>
                        <th>Contatti</th>
                        <th>Data & Ora</th>
                        <th>Persone</th>
                        <th>Area</th>
                        <th>Stato</th>
                        <th>Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredReservations.map((reservation) => (
                          <motion.tr
                            key={reservation.id}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            whileHover={{ backgroundColor: '#F8F9FA' }}
                          >
                            <td>
                              <div className="fw-bold">{reservation.name}</div>
                              <small className="text-muted">ID: {reservation.id}</small>
                            </td>
                            <td>
                              <div>
                                <FaEnvelope className="me-1 text-muted" size={12} />
                                <small>{reservation.email}</small>
                              </div>
                              <div>
                                <FaPhone className="me-1 text-muted" size={12} />
                                <small>{reservation.phone}</small>
                              </div>
                            </td>
                            <td>
                              <div className="fw-bold">{reservation.reservationDate}</div>
                              <div>
                                <FaClock className="me-1 text-muted" size={12} />
                                <small>{reservation.reservationTime}</small>
                              </div>
                            </td>
                            <td>
                              <Badge bg="secondary" className="px-2 py-1">
                                <FaUsers className="me-1" size={10} />
                                {reservation.partySize}
                              </Badge>
                            </td>
                            <td>{getAreaBadge(reservation.reservationArea)}</td>
                            <td>
                              <Dropdown>
                                <Dropdown.Toggle 
                                  variant="link" 
                                  className="p-0 border-0"
                                  style={{ textDecoration: 'none' }}
                                >
                                  {getStatusBadge(reservation.status)}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item 
                                    onClick={() => handleStatusChange(reservation.id, 'CONFIRMED')}
                                    disabled={reservation.status === 'CONFIRMED'}
                                  >
                                    Conferma
                                  </Dropdown.Item>
                                  <Dropdown.Item 
                                    onClick={() => handleStatusChange(reservation.id, 'PENDING')}
                                    disabled={reservation.status === 'PENDING'}
                                  >
                                    In Attesa
                                  </Dropdown.Item>
                                  <Dropdown.Item 
                                    onClick={() => handleStatusChange(reservation.id, 'CANCELLED')}
                                    disabled={reservation.status === 'CANCELLED'}
                                  >
                                    Cancella
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Visualizza dettagli</Tooltip>}
                                >
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedReservation(reservation);
                                      setShowDetailModal(true);
                                    }}
                                  >
                                    <FaEye size={12} />
                                  </Button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Elimina prenotazione</Tooltip>}
                                >
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedReservation(reservation);
                                      setShowDeleteModal(true);
                                    }}
                                  >
                                    <FaTrash size={12} />
                                  </Button>
                                </OverlayTrigger>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.div>

        {/* Modal Dettagli Prenotazione */}
        <Modal 
          show={showDetailModal} 
          onHide={() => setShowDetailModal(false)} 
          centered
          size="lg"
        >
          <Modal.Header closeButton style={{ backgroundColor: '#8D6E63', color: 'white' }}>
            <Modal.Title>
              <FaEye className="me-2" />
              Dettagli Prenotazione
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#F9F9F9' }}>
            {selectedReservation && (
              <Container>
                <Row className="mb-3">
                  <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Header className="bg-primary text-white">
                        <FaUsers className="me-2" />
                        Informazioni Cliente
                      </Card.Header>
                      <Card.Body>
                        <p><strong>Nome:</strong> {selectedReservation.name}</p>
                        <p><strong>Email:</strong> {selectedReservation.email}</p>
                        <p><strong>Telefono:</strong> {selectedReservation.phone}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Header className="bg-success text-white">
                        <FaCalendarAlt className="me-2" />
                        Dettagli Prenotazione
                      </Card.Header>
                      <Card.Body>
                        <p><strong>Data:</strong> {selectedReservation.reservationDate}</p>
                        <p><strong>Orario:</strong> {selectedReservation.reservationTime}</p>
                        <p><strong>Persone:</strong> {selectedReservation.partySize}</p>
                        <p><strong>Area:</strong> {getAreaBadge(selectedReservation.reservationArea)}</p>
                        <p><strong>Stato:</strong> {getStatusBadge(selectedReservation.status)}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                {selectedReservation.specialRequests && (
                  <Row>
                    <Col>
                      <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-warning text-dark">
                          <FaEdit className="me-2" />
                          Richieste Speciali
                        </Card.Header>
                        <Card.Body>
                          <p className="mb-0">{selectedReservation.specialRequests}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}
              </Container>
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#F9F9F9' }}>
            <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
              Chiudi
            </Button>
            <Button 
              variant="danger" 
              onClick={() => {
                setShowDetailModal(false);
                setShowDeleteModal(true);
              }}
            >
              <FaTrash className="me-2" />
              Elimina
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Conferma Eliminazione */}
        <Modal 
          show={showDeleteModal} 
          onHide={() => setShowDeleteModal(false)} 
          centered
        >
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>
              <FaTrash className="me-2" />
              Conferma Eliminazione
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReservation && (
              <div>
                <Alert variant="warning">
                  <strong>Attenzione!</strong> Questa azione non può essere annullata.
                </Alert>
                <p>Sei sicuro di voler eliminare la prenotazione di:</p>
                <div className="bg-light p-3 rounded">
                  <strong>{selectedReservation.name}</strong><br />
                  {selectedReservation.email}<br />
                  {selectedReservation.reservationDate} alle {selectedReservation.reservationTime}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Annulla
            </Button>
            <Button 
              variant="danger" 
              onClick={() => handleDeleteReservation(selectedReservation?.id)}
            >
              <FaTrash className="me-2" />
              Elimina Definitivamente
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </motion.div>
  );
};

export default ReservationManagement;