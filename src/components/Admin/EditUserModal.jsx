// src/components/Admin/EditUserModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { FaEdit, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import adminUserService from '../../services/adminUserService';

const EditUserModal = ({ show, onHide, user, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    enabled: true,
    emailVerified: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        enabled: user.enabled || false,
        emailVerified: user.emailVerified || false
      });
      setError('');
      setValidationErrors({});
    }
  }, [user]);

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
    if (!user) return;
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const updatedUser = await adminUserService.updateUser(user.id, formData);
      onUserUpdated(updatedUser);
      onHide();
    } catch (err) {
      setError(err.message || 'Errore nell\'aggiornamento dell\'utente');
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
    setError('');
    setValidationErrors({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaEdit className="me-2" />
          Modifica Utente: {user?.name} {user?.surname}
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
          
          <Alert variant="info">
            <FaInfoCircle className="me-2" />
            <strong>ID Utente:</strong> #{user?.id} | 
            <strong> Ruolo:</strong> {user?.role} | 
            <strong> Registrato:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('it-IT') : 'N/A'}
          </Alert>
          
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
            <Form.Text className="text-muted">
              Attenzione: modificare l'email richiederà una nuova verifica
            </Form.Text>
          </Form.Group>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stato Account</Form.Label>
                <div className="mt-2">
                  <Form.Check
                    type="checkbox"
                    name="enabled"
                    id="enabled"
                    label="Account attivo"
                    checked={formData.enabled}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Disabilitare impedirà all'utente di accedere
                  </Form.Text>
                </div>
              </Form.Group>
            </Col>
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
                  <Form.Text className="text-muted">
                    Forza la verifica dell'email dell'utente
                  </Form.Text>
                </div>
              </Form.Group>
            </Col>
          </Row>
          
          {user?.role === 'ADMIN' && (
            <Alert variant="warning">
              <FaExclamationTriangle className="me-2" />
              <strong>Attenzione:</strong> Stai modificando un account amministratore. 
              Alcune modifiche potrebbero richiedere privilegi elevati.
            </Alert>
          )}
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
                Aggiornamento...
              </>
            ) : (
              <>
                <FaEdit className="me-2" />
                Aggiorna Utente
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditUserModal;