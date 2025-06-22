import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaHome, FaArrowLeft, FaUtensils, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300 }
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ 
        backgroundColor: '#F0EBDE', 
        minHeight: '100vh', 
        paddingTop: '120px',
        paddingBottom: '60px'
      }}
    >
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <motion.div variants={itemVariants}>
              <Card 
                className="text-center shadow-lg border-0"
                style={{ borderRadius: '20px', overflow: 'hidden' }}
              >
                {/* Header con sfondo colorato */}
                <div 
                  style={{ 
                    background: 'linear-gradient(135deg, #5D4037 0%, #8D6E63 100%)',
                    padding: '3rem 2rem 2rem 2rem',
                    color: 'white'
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  >
                    <h1 className="display-1 fw-bold mb-0">404</h1>
                  </motion.div>
                  <motion.h2 
                    variants={itemVariants}
                    className="mt-2 mb-0"
                  >
                    Pagina Non Trovata
                  </motion.h2>
                </div>

                <Card.Body className="p-4">
                  <motion.div variants={itemVariants}>
                    <div className="mb-4">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      >
                        <FaUtensils size={64} style={{ color: '#8D6E63' }} />
                      </motion.div>
                    </div>

                    <h4 className="mb-3" style={{ color: '#5D4037' }}>
                      Oops! Sembra che questa pagina sia andata a farsi una passeggiata in cucina
                    </h4>
                    
                    <p className="text-muted mb-4">
                      La pagina che stai cercando non esiste o è stata spostata. 
                      Non preoccuparti, puoi sempre tornare alla nostra deliziosa home page!
                    </p>

                    {/* Suggerimenti di navigazione */}
                    <div className="bg-light p-3 rounded mb-4">
                      <h6 className="fw-bold mb-3" style={{ color: '#5D4037' }}>
                        Dove vorresti andare?
                      </h6>
                      <div className="d-grid gap-2">
                        <Button
                          variant="outline-primary"
                          onClick={() => navigate('/menu')}
                          className="d-flex align-items-center justify-content-center"
                          style={{ borderColor: '#8D6E63', color: '#5D4037' }}
                        >
                          <FaUtensils className="me-2" />
                          Scopri il nostro Menu
                        </Button>
                        <Button
                          variant="outline-success"
                          onClick={() => navigate('/ReservationPage')}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <FaCalendarAlt className="me-2" />
                          Prenota un Tavolo
                        </Button>
                      </div>
                    </div>

                    {/* Pulsanti di navigazione principali */}
                    <div className="d-flex gap-3 justify-content-center">
                      <Button
                        variant="outline-secondary"
                        onClick={handleGoBack}
                        className="d-flex align-items-center"
                      >
                        <FaArrowLeft className="me-2" />
                        Torna Indietro
                      </Button>
                      
                      <Button
                        variant="primary"
                        onClick={() => navigate('/')}
                        className="d-flex align-items-center"
                        style={{ 
                          backgroundColor: '#8D6E63', 
                          borderColor: '#8D6E63' 
                        }}
                      >
                        <FaHome className="me-2" />
                        Vai alla Home
                      </Button>
                    </div>
                  </motion.div>
                </Card.Body>

                {/* Footer della card */}
                <div 
                  className="p-3 text-center"
                  style={{ backgroundColor: '#F5F5F5' }}
                >
                  <small className="text-muted">
                    Se continui ad avere problemi, 
                    <a href="/contatti" style={{ color: '#8D6E63', textDecoration: 'none' }}>
                      {' '}contattaci
                    </a>
                    {' '}e ti aiuteremo!
                  </small>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </Container>
    </motion.div>
  );
};

export default NotFoundPage;