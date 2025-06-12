import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const NotFoundPage = () => {
  return (
    <Container className="text-center" style={{ marginTop: '150px', minHeight: '60vh' }}>
      <Row>
        <Col>
          <h1 style={{ fontSize: '120px', color: '#5D4037', marginBottom: '0' }}>
            404
          </h1>
          <h2 style={{ color: '#8D6E63', marginBottom: '30px' }}>
            Pagina Non Trovata
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>
            Ops! La pagina che stai cercando non esiste.
          </p>
          <Link to="/">
            <Button 
              variant="primary" 
              size="lg"
              style={{ 
                backgroundColor: '#5D4037', 
                borderColor: '#5D4037',
                padding: '10px 30px'
              }}
            >
              Torna alla Home
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;