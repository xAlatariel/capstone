// src/components/Admin/EditUserModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { FaEdit, FaExclamationTriangle } from 'react-icons/fa';
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

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        enabled: user.enabled || false,
        emailVerified: user.emailVerified || false
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
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
  };

  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaEdit className="me-2" />
          Modifica Utente
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
            {formData.email !== user.email && (
              <Form.Text className="text-warning">
                <FaExclamationTriangle className="me-1" />
                Cambiando l'email, la verifica verrà resettata
              </Form.Text>
            )}
          </Form.Group>
          
          <Row>
            <Col md={6}>
              <Form.Check
                type="checkbox"
                name="enabled"
                label="Account Attivo"
                checked={formData.enabled}
                onChange={handleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="checkbox"
                name="emailVerified"
                label="Email Verificata"
                checked={formData.emailVerified}
                onChange={handleChange}
                disabled={formData.email !== user.email}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Annulla
          </Button>
          <Button 
            type="submit" 
            variant="primary"
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