import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      backgroundColor: '#5D4037', 
      color: 'white', 
      padding: '40px 0 20px 0',
      marginTop: '50px'
    }}>
      <Container>
        <Row>
          {/* Info Ristorante */}
          <Col md={4} className="mb-4">
            <h5 className="mb-3">Ristorante Ai Canipai</h5>
            <p className="mb-2">
              <FaMapMarkerAlt className="me-2" />
              Via Roma, 22 - San Romano in Garfagnana
            </p>
            <p className="mb-2">
              <FaPhone className="me-2" />
              <a href="tel:+390583179307" style={{ color: 'white', textDecoration: 'none' }}>
                0583 179 9307
              </a>
            </p>
            <p>
              <FaEnvelope className="me-2" />
              <a href="mailto:info@aicanipai.it" style={{ color: 'white', textDecoration: 'none' }}>
                info@aicanipai.it
              </a>
            </p>
          </Col>

          {/* Link Utili */}
          <Col md={4} className="mb-4">
            <h5 className="mb-3">Link Utili</h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li className="mb-2">
                <Link to="/menu" style={{ color: 'white', textDecoration: 'none' }}>Menu</Link>
              </li>
              <li className="mb-2">
                <Link to="/ReservationPage" style={{ color: 'white', textDecoration: 'none' }}>Prenota un Tavolo</Link>
              </li>
              <li className="mb-2">
                <Link to="/chiSiamo" style={{ color: 'white', textDecoration: 'none' }}>Chi Siamo</Link>
              </li>
              <li className="mb-2">
                <Link to="/contatti" style={{ color: 'white', textDecoration: 'none' }}>Contatti</Link>
              </li>
            </ul>
          </Col>

          {/* Orari e Social */}
          <Col md={4} className="mb-4">
            <h5 className="mb-3">Orari di Apertura</h5>
            <p className="mb-1">Martedì - Domenica</p>
            <p className="mb-1">12:00 - 15:00</p>
            <p className="mb-3">19:00 - 23:00</p>
            <p className="mb-2">Lunedì: Chiuso</p>
            
            <div className="mt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 style={{ color: 'white', fontSize: '24px', marginRight: '15px' }}>
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                 style={{ color: 'white', fontSize: '24px' }}>
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>

        <hr style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '30px 0 20px 0' }} />

        {/* Copyright e Privacy */}
        <Row>
          <Col className="text-center">
            <p className="mb-2" style={{ fontSize: '14px' }}>
              © {currentYear} Ristorante Ai Canipai - Tutti i diritti riservati
            </p>
            <p style={{ fontSize: '14px' }}>
              <Link to="/privacy-policy" style={{ color: 'white', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
              {' | '}
              <Link to="/cookie-policy" style={{ color: 'white', textDecoration: 'none' }}>
                Cookie Policy
              </Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;