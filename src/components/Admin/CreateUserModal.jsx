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
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Il nome è obbligatorio';
    }
    
    if (!formData.surname.trim()) {
      errors.surname = 'Il cognome è obbligatorio';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'L\'email è obbligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Formato email non valido';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
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
      setValidationErrors({});
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
    
    // Rimuovi errore di validazione per il campo modificato
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      surname: '',
      email: '',
      role: 'USER',
      enabled: true,
      emailVerified: false,
      sendWelcomeEmail: true
    });
    setValidationErrors({});
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
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
                  isInvalid={!!validationErrors.name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.name}
                </Form.Control.Feedback>
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
                  isInvalid={!!validationErrors.surname}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.surname}
                </Form.Control.Feedback>
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
              isInvalid={!!validationErrors.email}
              required
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.email}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Row>
            <Col md={6}>
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
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stato</Form.Label>
                <div className="mt-2">
                  <Form.Check
                    type="checkbox"
                    name="enabled"
                    id="enabled"
                    label="Account attivo"
                    checked={formData.enabled}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Verifica Email</Form.Label>
                <div className="mt-2">
                  <Form.Check
                    type="checkbox"
                    name="emailVerified"
                    id="emailVerified"
                    label="Email verificata"
                    checked={formData.emailVerified}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Notifica</Form.Label>
                <div className="mt-2">
                  <Form.Check
                    type="checkbox"
                    name="sendWelcomeEmail"
                    id="sendWelcomeEmail"
                    label="Invia email di benvenuto"
                    checked={formData.sendWelcomeEmail}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          
          <Alert variant="info" className="mt-3">
            <FaKey className="me-2" />
            <strong>Nota:</strong> Una password temporanea verrà generata automaticamente 
            e inviata all'utente via email se l'opzione "Invia email di benvenuto" è attiva.
          </Alert>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Annulla
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
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