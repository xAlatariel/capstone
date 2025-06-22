// src/components/Admin/CreateUserModal.jsx
import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { FaUserPlus, FaExclamationTriangle, FaKey } from 'react-icons/fa';
import adminUserService from '../../services/adminUserService';

const CreateUserModal = ({ show, onHide, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    role: 'USER',
    enabled: true,
    emailVerified: false,
    sendWelcomeEmail: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const newUser = await adminUserService.createUser(formData);
      onUserCreated(newUser);
      onHide();
      
      // Reset form
      setFormData({
        name: '',
        surname: '',
        email: '',
        role: 'USER',
        enabled: true,
        emailVerified: false,
        sendWelcomeEmail: true
      });
    } catch (err) {
      setError(err.message || 'Errore nella creazione dell\'utente');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaUserPlus className="me-2" />
          Nuovo Utente
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger">
              <FaExclamationTriangle className="me-2" />
              {error}
            </Alert>
          )}
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nome *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cognome *</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Ruolo</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">Utente</option>
              <option value="ADMIN">Amministratore</option>
            </Form.Select>
          </Form.Group>
          
          <Row>
            <Col md={4}>
              <Form.Check
                type="checkbox"
                name="enabled"
                label="Account Attivo"
                checked={formData.enabled}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Check
                type="checkbox"
                name="emailVerified"
                label="Email Verificata"
                checked={formData.emailVerified}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Check
                type="checkbox"
                name="sendWelcomeEmail"
                label="Invia Email di Benvenuto"
                checked={formData.sendWelcomeEmail}
                onChange={handleChange}
              />
            </Col>
          </Row>
          
          <Alert variant="info" className="mt-3">
            <FaKey className="me-2" />
            Verrà generata una password temporanea che sarà inviata via email all'utente.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Annulla
          </Button>
          <Button 
            type="submit" 
            variant="success"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Creazione...
              </>
            ) : (
              <>
                <FaUserPlus className="me-2" />
                Crea Utente
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;