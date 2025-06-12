import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Card, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaEnvelope } from 'react-icons/fa';
import apiService from '../services/apiService';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationState, setVerificationState] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setVerificationState('error');
      setMessage('Token di verifica mancante. Controlla il link nella tua email.');
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      console.log('Verifica token:', verificationToken);
      const response = await apiService.verifyEmail(verificationToken);
      
      console.log('Risposta verifica:', response);
      
      if (response.status === 'SUCCESS') {
        setVerificationState('success');
        setMessage('Email verificata con successo! Puoi ora effettuare il login.');
        
        // Reindirizza al login dopo 3 secondi
        setTimeout(() => {
          navigate('/', { state: { showLogin: true, message: 'Account verificato! Puoi ora accedere.' } });
        }, 3000);
      } else {
        throw new Error(response.message || 'Errore durante la verifica');
      }
    } catch (error) {
      console.error('Errore verifica email:', error);
      setVerificationState('error');
      setMessage(error.message || 'Token non valido o scaduto. Richiedi un nuovo link di verifica.');
    }
  };

  const handleResendEmail = async () => {
    if (!email.trim()) {
      alert('Inserisci la tua email per richiedere un nuovo link di verifica');
      return;
    }

    setIsResending(true);
    try {
      await apiService.resendVerificationEmail(email);
      alert('Nuovo link di verifica inviato! Controlla la tua email.');
      setEmail('');
    } catch (error) {
      console.error('Errore reinvio email:', error);
      alert('Errore durante l\'invio. Riprova più tardi.');
    } finally {
      setIsResending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        delay: 0.2
      }
    }
  };

  return (
    <Container 
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '70vh', paddingTop: '100px' }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        <Card className="shadow-lg border-0">
          <Card.Body className="text-center p-5">
            {verificationState === 'loading' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Spinner 
                    animation="border" 
                    variant="primary" 
                    style={{ width: '4rem', height: '4rem', marginBottom: '20px' }}
                  />
                </motion.div>
                <h3 className="mb-3" style={{ color: '#5D4037' }}>
                  Verifica in corso...
                </h3>
                <p className="text-muted">
                  Stiamo verificando il tuo account. Attendere prego.
                </p>
              </>
            )}

            {verificationState === 'success' && (
              <>
                <motion.div
                  variants={iconVariants}
                  className="mb-4"
                >
                  <FaCheckCircle 
                    size={80} 
                    style={{ color: '#28a745' }}
                  />
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-3"
                  style={{ color: '#28a745' }}
                >
                  ✅ Verifica Completata!
                </motion.h3>
                <Alert variant="success" className="mb-4">
                  {message}
                </Alert>
                <p className="text-muted">
                  Sarai reindirizzato alla pagina di login tra pochi secondi...
                </p>
                <Button 
                  variant="outline-success"
                  onClick={() => navigate('/', { state: { showLogin: true } })}
                  className="mt-3"
                >
                  Vai al Login
                </Button>
              </>
            )}

            {verificationState === 'error' && (
              <>
                <motion.div
                  variants={iconVariants}
                  className="mb-4"
                >
                  <FaTimesCircle 
                    size={80} 
                    style={{ color: '#dc3545' }}
                  />
                </motion.div>
                <h3 className="mb-3" style={{ color: '#dc3545' }}>
                  ❌ Verifica Fallita
                </h3>
                <Alert variant="danger" className="mb-4">
                  {message}
                </Alert>
                
                <Card className="bg-light">
                  <Card.Body>
                    <h5 className="mb-3">
                      <FaEnvelope className="me-2" />
                      Richiedi nuovo link
                    </h5>
                    <Form onSubmit={(e) => { e.preventDefault(); handleResendEmail(); }}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="email"
                          placeholder="Inserisci la tua email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Button 
                        type="submit"
                        variant="primary"
                        disabled={isResending}
                        className="w-100"
                      >
                        {isResending ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              className="me-2"
                            />
                            Invio in corso...
                          </>
                        ) : (
                          'Invia nuovo link'
                        )}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
                
                <Button 
                  variant="outline-secondary"
                  onClick={() => navigate('/')}
                  className="mt-3"
                >
                  Torna alla Home
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default EmailVerificationPage;