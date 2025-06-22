// src/components/Admin/StatsModal.jsx
import React from 'react';
import { Modal, Card, Row, Col, Badge, Button, ProgressBar } from 'react-bootstrap';
import { 
  FaChartBar, 
  FaUsers, 
  FaUserCheck, 
  FaUserTimes, 
  FaEnvelope, 
  FaCalendarAlt,
  FaUserShield,
  FaDownload,
  FaPercent,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const StatsModal = ({ show, onHide, stats }) => {
  
  const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString('it-IT');
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };

  const exportStats = () => {
    const statsData = {
      ...stats,
      generatedAt: new Date().toISOString(),
      generatedBy: 'Admin Panel'
    };
    
    const blob = new Blob([JSON.stringify(statsData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `statistiche_utenti_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaChartBar className="me-2" />
          Statistiche Dettagliate Utenti
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* STATISTICHE GENERALI */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center border-primary">
              <Card.Body>
                <FaUsers size={40} className="text-primary mb-2" />
                <h3 className="mb-1">{formatNumber(stats.totalUsers || 0)}</h3>
                <small className="text-muted">Utenti Totali</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-success">
              <Card.Body>
                <FaUserCheck size={40} className="text-success mb-2" />
                <h3 className="mb-1">{formatNumber(stats.activeUsers || 0)}</h3>
                <small className="text-muted">Utenti Attivi</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-danger">
              <Card.Body>
                <FaUserTimes size={40} className="text-danger mb-2" />
                <h3 className="mb-1">{formatNumber(stats.inactiveUsers || 0)}</h3>
                <small className="text-muted">Utenti Disabilitati</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-warning">
              <Card.Body>
                <FaUserShield size={40} className="text-warning mb-2" />
                <h3 className="mb-1">{formatNumber(stats.adminUsers || 0)}</h3>
                <small className="text-muted">Amministratori</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* DETTAGLI STATO UTENTI */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="h-100">
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">
                  <FaUsers className="me-2" />
                  Distribuzione Utenti per Stato
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Utenti Attivi</span>
                    <span>{calculatePercentage(stats.activeUsers, stats.totalUsers)}%</span>
                  </div>
                  <ProgressBar 
                    variant="success" 
                    now={calculatePercentage(stats.activeUsers, stats.totalUsers)} 
                  />
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Utenti Disabilitati</span>
                    <span>{calculatePercentage(stats.inactiveUsers, stats.totalUsers)}%</span>
                  </div>
                  <ProgressBar 
                    variant="danger" 
                    now={calculatePercentage(stats.inactiveUsers, stats.totalUsers)} 
                  />
                </div>
                
                <hr />
                
                <div className="row text-center">
                  <div className="col">
                    <Badge bg="success" className="fs-6">
                      {stats.activeUsers || 0} Attivi
                    </Badge>
                  </div>
                  <div className="col">
                    <Badge bg="danger" className="fs-6">
                      {stats.inactiveUsers || 0} Inattivi
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="h-100">
              <Card.Header className="bg-info text-white">
                <h6 className="mb-0">
                  <FaEnvelope className="me-2" />
                  Verifica Email
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Email Verificate</span>
                    <span>{calculatePercentage(stats.verifiedUsers, stats.totalUsers)}%</span>
                  </div>
                  <ProgressBar 
                    variant="success" 
                    now={calculatePercentage(stats.verifiedUsers, stats.totalUsers)} 
                  />
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Email Non Verificate</span>
                    <span>{calculatePercentage(stats.unverifiedUsers, stats.totalUsers)}%</span>
                  </div>
                  <ProgressBar 
                    variant="warning" 
                    now={calculatePercentage(stats.unverifiedUsers, stats.totalUsers)} 
                  />
                </div>
                
                <hr />
                
                <div className="row text-center">
                  <div className="col">
                    <Badge bg="success" className="fs-6">
                      {stats.verifiedUsers || 0} Verificate
                    </Badge>
                  </div>
                  <div className="col">
                    <Badge bg="warning" className="fs-6">
                      {stats.unverifiedUsers || 0} Non Verificate
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* RUOLI E REGISTRAZIONI */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="h-100">
              <Card.Header className="bg-secondary text-white">
                <h6 className="mb-0">
                  <FaUserShield className="me-2" />
                  Distribuzione Ruoli
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Amministratori:</span>
                    <div>
                      <Badge bg="danger" className="me-2">{stats.adminUsers || 0}</Badge>
                      <small className="text-muted">
                        ({calculatePercentage(stats.adminUsers, stats.totalUsers)}%)
                      </small>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Utenti Standard:</span>
                    <div>
                      <Badge bg="primary" className="me-2">{stats.standardUsers || 0}</Badge>
                      <small className="text-muted">
                        ({calculatePercentage(stats.standardUsers, stats.totalUsers)}%)
                      </small>
                    </div>
                  </div>
                </div>
                
                <hr />
                
                <div className="text-center">
                  <small className="text-muted">
                    Rapporto Admin/Utenti: 1:{Math.round((stats.standardUsers || 0) / (stats.adminUsers || 1))}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="h-100">
              <Card.Header className="bg-success text-white">
                <h6 className="mb-0">
                  <FaCalendarAlt className="me-2" />
                  Attività Recente
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Registrazioni Oggi:</span>
                    <div>
                      <Badge bg="success" className="me-2">{stats.todayRegistrations || 0}</Badge>
                      {stats.yesterdayRegistrations !== undefined && (
                        <small className="text-muted">
                          {stats.todayRegistrations > stats.yesterdayRegistrations ? (
                            <span className="text-success">
                              <FaArrowUp /> +{stats.todayRegistrations - stats.yesterdayRegistrations}
                            </span>
                          ) : stats.todayRegistrations < stats.yesterdayRegistrations ? (
                            <span className="text-danger">
                              <FaArrowDown /> -{stats.yesterdayRegistrations - stats.todayRegistrations}
                            </span>
                          ) : (
                            <span className="text-muted">= 0</span>
                          )}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Registrazioni Settimana:</span>
                    <Badge bg="info">{stats.weekRegistrations || 0}</Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Registrazioni Mese:</span>
                    <Badge bg="primary">{stats.monthRegistrations || 0}</Badge>
                  </div>
                </div>
                
                <hr />
                
                <div className="text-center">
                  <small className="text-muted">
                    Media giornaliera: {Math.round((stats.monthRegistrations || 0) / 30)} utenti/giorno
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* STATISTICHE AVANZATE */}
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header className="bg-dark text-white">
                <h6 className="mb-0">
                  <FaPercent className="me-2" />
                  Metriche Avanzate
                </h6>
              </Card.Header>
              <Card.Body>
                <Row className="text-center">
                  <Col md={3}>
                    <div className="border-end">
                      <h5 className="text-success">{calculatePercentage(stats.verifiedUsers, stats.totalUsers)}%</h5>
                      <small className="text-muted">Tasso Verifica Email</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="border-end">
                      <h5 className="text-primary">{calculatePercentage(stats.activeUsers, stats.totalUsers)}%</h5>
                      <small className="text-muted">Tasso Utenti Attivi</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="border-end">
                      <h5 className="text-warning">{calculatePercentage(stats.adminUsers, stats.totalUsers)}%</h5>
                      <small className="text-muted">Rapporto Admin</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <h5 className="text-info">{stats.avgDailyLogins || 0}</h5>
                    <small className="text-muted">Login Medi/Giorno</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      
      <Modal.Footer className="d-flex justify-content-between">
        <div>
          <small className="text-muted">
            Ultimo aggiornamento: {new Date().toLocaleString('it-IT')}
          </small>
        </div>
        <div>
          <Button variant="outline-primary" onClick={exportStats} className="me-2">
            <FaDownload className="me-2" />
            Esporta Statistiche
          </Button>
          <Button variant="secondary" onClick={onHide}>
            Chiudi
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default StatsModal;