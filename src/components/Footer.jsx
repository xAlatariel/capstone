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
      padding: '25px 0 15px 0', // Ridotto da 40px 0 20px 0
      marginTop: '30px' // Ridotto da 50px
    }}>
      <Container>
        <Row className="mb-3"> {/* Ridotto margine bottom */}
          {/* Info Ristorante */}
          <Col md={4} className="mb-3"> {/* Ridotto da mb-4 */}
            <h6 className="mb-2 fw-bold">Ristorante Ai Canipai</h6> {/* h5 -> h6, mb-3 -> mb-2 */}
            <p className="mb-1 small"> {/* Aggiunto 'small' per testo più piccolo */}
              <FaMapMarkerAlt className="me-2" size={12} /> {/* Ridotto size icona */}
              Via Roma, 22 - San Romano in Garfagnana
            </p>
            <p className="mb-1 small">
              <FaPhone className="me-2" size={12} />
              <a href="tel:+390583179307" style={{ color: 'white', textDecoration: 'none' }}>
                0583 179 9307
              </a>
            </p>
            <p className="mb-0 small"> {/* mb-0 per eliminare margine finale */}
              <FaEnvelope className="me-2" size={12} />
              <a href="mailto:info@aicanipai.it" style={{ color: 'white', textDecoration: 'none' }}>
                info@aicanipai.it
              </a>
            </p>
          </Col>

          {/* Link Utili */}
          <Col md={4} className="mb-3">
            <h6 className="mb-2 fw-bold">Link Utili</h6>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 0 }}>
              <li className="mb-1"> {/* Ridotto da mb-2 */}
                <Link to="/menu" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                  Menu
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/ReservationPage" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                  Prenota un Tavolo
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/chiSiamo" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                  Chi Siamo
                </Link>
              </li>
              <li className="mb-0">
                <Link to="/contatti" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                  Contatti
                </Link>
              </li>
            </ul>
          </Col>

          {/* Orari e Social - Compattato */}
          <Col md={4} className="mb-3">
            <h6 className="mb-2 fw-bold">Orari & Social</h6>
            <div className="mb-2"> {/* Contenuto orari compattato */}
              <p className="mb-0 small">Mar-Dom: 12:00-15:00 | 19:00-23:00</p>
              <p className="mb-2 small">Lunedì: Chiuso</p>
            </div>
            
            {/* Social Media Icons */}
            <div>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 style={{ color: 'white', fontSize: '20px', marginRight: '12px' }}> {/* Ridotto size e margin */}
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                 style={{ color: 'white', fontSize: '20px' }}>
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>

        {/* Separatore più sottile */}
        <hr style={{ 
          borderColor: 'rgba(255,255,255,0.2)', 
          margin: '15px 0 10px 0', // Ridotto da 30px 0 20px 0
          borderWidth: '1px'
        }} />

        {/* Copyright e Privacy - Compattato */}
        <Row>
          <Col className="text-center">
            <p className="mb-1" style={{ fontSize: '13px' }}> {/* Ridotto font e margin */}
              © {currentYear} Ristorante Ai Canipai - Tutti i diritti riservati
            </p>
            <p className="mb-0" style={{ fontSize: '13px' }}> {/* mb-0 per eliminare margine finale */}
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