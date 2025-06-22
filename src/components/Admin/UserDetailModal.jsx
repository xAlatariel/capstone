// src/components/Admin/UserDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Card, 
  Row, 
  Col, 
  Badge, 
  Spinner, 
  Button, 
  Table,
  Alert,
  Tab,
  Tabs
} from 'react-bootstrap';
import { 
  FaEye, 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaPhone,
  FaUserShield,
  FaUsers,
  FaCheck,
  FaTimes,
  FaClock,
  FaHistory,
  FaChartBar,
  FaExclamationTriangle
} from 'react-icons/fa';
import adminUserService from '../../services/adminUserService';

const UserDetailModal = ({ show, onHide, user }) => {
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activitiesError, setActivitiesError] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (show && user) {
      loadUserActivities();
    }
    // Reset tab quando il modal si chiude
    if (!show) {
      setActiveTab('info');
    }
  }, [show, user]);

  const loadUserActivities = async () => {
    try {
      setLoadingActivities(true);
      setActivitiesError('');
      const response = await adminUserService.getUserActivities(user.id, 0, 10);
      setActivities(response.content || []);
    } catch (err) {
      console.error('Errore nel caricamento delle attività:', err);
      setActivitiesError('Errore nel caricamento delle attività utente');
    } finally {
      setLoadingActivities(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Mai';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRoleBadge = (role) => {
    return (
      <Badge bg={role === 'ADMIN' ? 'danger' : 'primary'} className="fs-6">
        {role === 'ADMIN' ? (
          <>
            <FaUserShield className="me-1" />
            Amministratore
          </>
        ) : (
          <>
            <FaUser className="me-1" />
            Utente
          </>
        )}
      </Badge>
    );
  };

  const getStatusBadge = (enabled) => {
    return (
      <Badge bg={enabled ? 'success' : 'danger'} className="fs-6">
        {enabled ? (
          <>
            <FaCheck className="me-1" />
            Attivo
          </>
        ) : (
          <>
            <FaTimes className="me-1" />
            Disabilitato
          </>
        )}
      </Badge>
    );
  };

  const getEmailVerifiedBadge = (verified) => {
    return (
      <Badge bg={verified ? 'success' : 'warning'} className="fs-6">
        {verified ? (
          <>
            <FaCheck className="me-1" />
            Verificata
          </>
        ) : (
          <>
            <FaClock className="me-1" />
            Non verificata
          </>
        )}
      </Badge>
    );
  };

  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaEye className="me-2" />
          Dettagli Utente: {user.name} {user.surname}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-0">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-0"
          fill
        >
          {/* TAB INFORMAZIONI GENERALI */}
          <Tab eventKey="info" title={<><FaUser className="me-2" />Informazioni</>}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">
                  <FaUser className="me-2" />
                  Informazioni Personali
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong className="text-muted">Nome Completo:</strong>
                      <div className="mt-1">
                        <FaUser className="text-primary me-2" />
                        {user.name} {user.surname}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <strong className="text-muted">Email:</strong>
                      <div className="mt-1">
                        <FaEnvelope className="text-primary me-2" />
                        {user.email}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <strong className="text-muted">Ruolo:</strong>
                      <div className="mt-1">
                        {getRoleBadge(user.role)}
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="mb-3">
                      <strong className="text-muted">Stato Account:</strong>
                      <div className="mt-1">
                        {getStatusBadge(user.enabled)}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <strong className="text-muted">Email Verificata:</strong>
                      <div className="mt-1">
                        {getEmailVerifiedBadge(user.emailVerified)}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <strong className="text-muted">Data Registrazione:</strong>
                      <div className="mt-1">
                        <FaCalendarAlt className="text-primary me-2" />
                        {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </Col>
                </Row>
                
                <hr />
                
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong className="text-muted">Ultimo Accesso:</strong>
                      <div className="mt-1">
                        <FaClock className="text-warning me-2" />
                        {formatDate(user.lastLoginAt)}
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="mb-3">
                      <strong className="text-muted">Ultimo Aggiornamento:</strong>
                      <div className="mt-1">
                        <FaHistory className="text-info me-2" />
                        {formatDate(user.updatedAt)}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>

          {/* TAB ATTIVITÀ */}
          <Tab eventKey="activities" title={<><FaHistory className="me-2" />Attività</>}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-info text-white">
                <h6 className="mb-0">
                  <FaHistory className="me-2" />
                  Cronologia Attività (Ultime 10)
                </h6>
              </Card.Header>
              <Card.Body>
                {loadingActivities ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Caricamento...</span>
                    </Spinner>
                    <p className="mt-2 text-muted">Caricamento attività...</p>
                  </div>
                ) : activitiesError ? (
                  <Alert variant="danger">
                    <FaExclamationTriangle className="me-2" />
                    {activitiesError}
                  </Alert>
                ) : activities.length === 0 ? (
                  <div className="text-center py-4">
                    <FaHistory size={50} className="text-muted mb-3" />
                    <p className="text-muted">Nessuna attività registrata</p>
                  </div>
                ) : (
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Azione</th>
                        <th>Dettagli</th>
                        <th>Eseguita da</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity, index) => (
                        <tr key={index}>
                          <td>
                            <small className="text-muted">
                              {formatDate(activity.timestamp)}
                            </small>
                          </td>
                          <td>
                            <Badge bg="secondary">
                              {activity.action}
                            </Badge>
                          </td>
                          <td>
                            <small>{activity.details || 'N/A'}</small>
                          </td>
                          <td>
                            <small>
                              {activity.performedByUserName ? (
                                <span className="text-primary">
                                  <FaUserShield className="me-1" />
                                  {activity.performedByUserName}
                                </span>
                              ) : (
                                <span className="text-muted">
                                  <FaUser className="me-1" />
                                  Sistema
                                </span>
                              )}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Tab>

          {/* TAB PRENOTAZIONI */}
          <Tab eventKey="reservations" title={<><FaCalendarAlt className="me-2" />Prenotazioni</>}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-success text-white">
                <h6 className="mb-0">
                  <FaCalendarAlt className="me-2" />
                  Storico Prenotazioni
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-4">
                  <FaCalendarAlt size={50} className="text-muted mb-3" />
                  <p className="text-muted">
                    Funzionalità prenotazioni in sviluppo
                  </p>
                  <small className="text-muted">
                    Qui verranno mostrate tutte le prenotazioni dell'utente
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          {/* TAB STATISTICHE */}
          <Tab eventKey="stats" title={<><FaChartBar className="me-2" />Statistiche</>}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-warning text-dark">
                <h6 className="mb-0">
                  <FaChartBar className="me-2" />
                  Statistiche Utente
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Card className="mb-3 border-primary">
                      <Card.Body className="text-center">
                        <FaCalendarAlt size={30} className="text-primary mb-2" />
                        <h5 className="mb-1">{user.totalReservations || 0}</h5>
                        <small className="text-muted">Prenotazioni Totali</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6}>
                    <Card className="mb-3 border-success">
                      <Card.Body className="text-center">
                        <FaClock size={30} className="text-success mb-2" />
                        <h5 className="mb-1">{user.lastLoginDaysAgo || 'N/A'}</h5>
                        <small className="text-muted">Giorni dall'ultimo accesso</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Card className="mb-3 border-info">
                      <Card.Body className="text-center">
                        <FaEnvelope size={30} className="text-info mb-2" />
                        <h5 className="mb-1">{user.emailsSent || 0}</h5>
                        <small className="text-muted">Email inviate</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6}>
                    <Card className="mb-3 border-warning">
                      <Card.Body className="text-center">
                        <FaHistory size={30} className="text-warning mb-2" />
                        <h5 className="mb-1">{activities.length}</h5>
                        <small className="text-muted">Attività registrate</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Modal.Body>
      
      <Modal.Footer className="d-flex justify-content-between">
        <div>
          <small className="text-muted">
            ID Utente: #{user.id} | 
            Registrato il {formatDateOnly(user.createdAt)}
          </small>
        </div>
        <Button variant="secondary" onClick={onHide}>
          <FaTimes className="me-2" />
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailModal;