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
            <FaUsers className="me-1" />
            Utente Standard
          </>
        )}
      </Badge>
    );
  };

  const getStatusBadge = (user) => {
    if (!user.enabled) {
      return (
        <Badge bg="danger" className="fs-6">
          <FaTimes className="me-1" />
          Account Disabilitato
        </Badge>
      );
    }
    if (!user.emailVerified) {
      return (
        <Badge bg="warning" className="fs-6">
          <FaEnvelope className="me-1" />
          Email Non Verificata
        </Badge>
      );
    }
    return (
      <Badge bg="success" className="fs-6">
        <FaCheck className="me-1" />
        Account Attivo
      </Badge>
    );
  };

  const getActivityTypeIcon = (activityType) => {
    switch (activityType) {
      case 'LOGIN':
        return <FaCheck className="text-success" />;
      case 'LOGOUT':
        return <FaTimes className="text-muted" />;
      case 'PASSWORD_CHANGED':
        return <FaUserShield className="text-warning" />;
      case 'EMAIL_VERIFIED':
        return <FaEnvelope className="text-success" />;
      case 'PROFILE_UPDATED':
        return <FaUser className="text-info" />;
      case 'RESERVATION_CREATED':
        return <FaCalendarAlt className="text-primary" />;
      case 'RESERVATION_CANCELLED':
        return <FaTimes className="text-danger" />;
      default:
        return <FaClock className="text-muted" />;
    }
  };

  const getActivityTypeLabel = (activityType) => {
    const labels = {
      'LOGIN': 'Accesso',
      'LOGOUT': 'Disconnessione',
      'PASSWORD_CHANGED': 'Password Cambiata',
      'EMAIL_VERIFIED': 'Email Verificata',
      'PROFILE_UPDATED': 'Profilo Aggiornato',
      'RESERVATION_CREATED': 'Prenotazione Creata',
      'RESERVATION_CANCELLED': 'Prenotazione Cancellata',
      'USER_CREATED': 'Utente Creato',
      'USER_UPDATED': 'Utente Aggiornato',
      'USER_DELETED': 'Utente Eliminato',
      'USER_STATUS_CHANGED': 'Stato Cambiato',
      'ROLE_CHANGED': 'Ruolo Cambiato',
      'PASSWORD_RESET': 'Password Resettata',
      'VERIFICATION_EMAIL_SENT': 'Email Verifica Inviata',
      'EMAIL_VERIFIED_BY_ADMIN': 'Email Verificata da Admin'
    };
    return labels[activityType] || activityType.replace(/_/g, ' ');
  };

  const calculateAccountAge = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} giorni`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} mesi`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} anni${remainingMonths > 0 ? ` e ${remainingMonths} mesi` : ''}`;
    }
  };

  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaEye className="me-2" />
          Dettagli Utente - {user.name} {user.surname}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          {/* TAB INFORMAZIONI GENERALI */}
          <Tab eventKey="info" title={<><FaUser className="me-2" />Informazioni</>}>
            <Row>
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">
                      <FaUser className="me-2" />
                      Informazioni Personali
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>
                        <FaUser className="me-2 text-muted" />
                        Nome Completo:
                      </strong>
                      <div className="mt-1">{user.name} {user.surname}</div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>
                        <FaEnvelope className="me-2 text-muted" />
                        Email:
                      </strong>
                      <div className="mt-1">{user.email}</div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>
                        <FaUserShield className="me-2 text-muted" />
                        Ruolo:
                      </strong>
                      <div className="mt-2">
                        {getRoleBadge(user.role)}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>
                        <FaCheck className="me-2 text-muted" />
                        Stato Account:
                      </strong>
                      <div className="mt-2">
                        {getStatusBadge(user)}
                      </div>
                    </div>

                    <div className="mb-3">
                      <strong>
                        <FaEnvelope className="me-2 text-muted" />
                        Verifica Email:
                      </strong>
                      <div className="mt-1">
                        {user.emailVerified ? (
                          <span className="text-success">
                            <FaCheck className="me-1" />
                            Verificata
                          </span>
                        ) : (
                          <span className="text-warning">
                            <FaExclamationTriangle className="me-1" />
                            Non Verificata
                          </span>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Header className="bg-info text-white">
                    <h6 className="mb-0">
                      <FaChartBar className="me-2" />
                      Statistiche Account
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>
                        <FaCalendarAlt className="me-2 text-muted" />
                        Data Registrazione:
                      </strong>
                      <div className="mt-1">{formatDateOnly(user.createdAt)}</div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>
                        <FaClock className="me-2 text-muted" />
                        Età Account:
                      </strong>
                      <div className="mt-1">{calculateAccountAge(user.createdAt)}</div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>
                        <FaClock className="me-2 text-muted" />
                        Ultimo Accesso:
                      </strong>
                      <div className="mt-1">
                        {user.lastLogin ? (
                          formatDate(user.lastLogin)
                        ) : (
                          <span className="text-muted">
                            <FaExclamationTriangle className="me-1" />
                            Mai effettuato l'accesso
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>
                        <FaCalendarAlt className="me-2 text-muted" />
                        Prenotazioni Totali:
                      </strong>
                      <div className="mt-2">
                        <Badge bg="info" className="fs-6">
                          {user.reservationsCount} prenotazioni
                        </Badge>
                      </div>
                    </div>

                    {user.updatedAt && (
                      <div className="mb-3">
                        <strong>
                          <FaClock className="me-2 text-muted" />
                          Ultimo Aggiornamento:
                        </strong>
                        <div className="mt-1">{formatDate(user.updatedAt)}</div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* TAB ATTIVITÀ */}
          <Tab eventKey="activities" title={<><FaHistory className="me-2" />Attività</>}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-secondary text-white">
                <h6 className="mb-0">
                  <FaHistory className="me-2" />
                  Attività Recenti ({activities.length})
                </h6>
              </Card.Header>
              <Card.Body className="p-0">
                {loadingActivities ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <div className="mt-2">Caricamento attività...</div>
                  </div>
                ) : activitiesError ? (
                  <Alert variant="danger" className="m-3">
                    <FaExclamationTriangle className="me-2" />
                    {activitiesError}
                  </Alert>
                ) : activities.length === 0 ? (
                  <div className="text-center py-5">
                    <FaHistory size={50} className="text-muted mb-3" />
                    <p className="text-muted">Nessuna attività registrata</p>
                  </div>
                ) : (
                  <Table responsive hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th width="50px">Tipo</th>
                        <th>Attività</th>
                        <th>Descrizione</th>
                        <th width="150px">Data/Ora</th>
                        <th width="120px">Eseguita da</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            {getActivityTypeIcon(activity.activityType)}
                          </td>
                          <td>
                            <strong>{getActivityTypeLabel(activity.activityType)}</strong>
                          </td>
                          <td>
                            <small className="text-muted">
                              {activity.description || 'Nessuna descrizione'}
                            </small>
                          </td>
                          <td>
                            <small>{formatDate(activity.createdAt)}</small>
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