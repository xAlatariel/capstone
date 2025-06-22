// src/components/Admin/StatsModal.jsx
import React from 'react';
import { Modal, Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { FaChartBar } from 'react-icons/fa';

const StatsModal = ({ show, onHide, stats }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaChartBar className="me-2" />
          Statistiche Dettagliate
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Utenti per Stato</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <span>Totale Utenti:</span>
                  <Badge bg="primary">{stats.totalUsers || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Utenti Attivi:</span>
                  <Badge bg="success">{stats.activeUsers || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Utenti Disabilitati:</span>
                  <Badge bg="danger">{stats.inactiveUsers || 0}</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Verifica Email</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <span>Email Verificate:</span>
                  <Badge bg="success">{stats.verifiedUsers || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Email Non Verificate:</span>
                  <Badge bg="warning">{stats.unverifiedUsers || 0}</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Ruoli Utenti</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <span>Amministratori:</span>
                  <Badge bg="danger">{stats.adminUsers || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Utenti Normali:</span>
                  <Badge bg="primary">{stats.regularUsers || 0}</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Nuove Registrazioni</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <span>Oggi:</span>
                  <Badge bg="info">{stats.todayRegistrations || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Questa Settimana:</span>
                  <Badge bg="info">{stats.weekRegistrations || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Questo Mese:</span>
                  <Badge bg="info">{stats.monthRegistrations || 0}</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StatsModal;