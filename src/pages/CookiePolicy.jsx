import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';

const CookiePolicy = () => {
  return (
    <div style={{ backgroundColor: '#F0EBDE', minHeight: '100vh', paddingTop: '100px' }}>
      <Container className="py-5">
        <Row>
          <Col lg={8} className="mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 
                className="text-center mb-5"
                style={{ 
                  color: '#5D4037',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontWeight: 600
                }}
              >
                Cookie Policy
              </h1>

              <div 
                className="bg-white p-5 rounded-4 shadow-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <h3 style={{ color: '#5D4037', marginBottom: '1.5rem' }}>
                  Informativa sui Cookie
                </h3>
                
                <p className="mb-4">
                  Questa Cookie Policy spiega cosa sono i cookie e come li utilizziamo sul sito web 
                  del Ristorante Ai Canipai per migliorare la tua esperienza di navigazione.
                </p>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  1. Cosa sono i Cookie
                </h4>
                <p>
                  I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando 
                  visiti un sito web. Permettono al sito di ricordare le tue azioni e preferenze 
                  (come login, lingua, dimensioni carattere e altre preferenze di visualizzazione) 
                  per un periodo di tempo.
                </p>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  2. Tipologie di Cookie Utilizzati
                </h4>

                <Table striped bordered hover className="mt-3">
                  <thead style={{ backgroundColor: '#5D4037', color: '#F0EBDE' }}>
                    <tr>
                      <th>Tipologia</th>
                      <th>Finalità</th>
                      <th>Durata</th>
                      <th>Consenso</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Cookie Tecnici</strong></td>
                      <td>Necessari per il funzionamento del sito (autenticazione, sessioni)</td>
                      <td>Sessione</td>
                      <td>Non richiesto</td>
                    </tr>
                    <tr>
                      <td><strong>Cookie di Preferenza</strong></td>
                      <td>Memorizzano le tue preferenze (lingua, layout)</td>
                      <td>1 anno</td>
                      <td>Richiesto</td>
                    </tr>
                    <tr>
                      <td><strong>Cookie Analitici</strong></td>
                      <td>Analisi del traffico e comportamento utenti</td>
                      <td>2 anni</td>
                      <td>Richiesto</td>
                    </tr>
                    <tr>
                      <td><strong>Cookie di Marketing</strong></td>
                      <td>Personalizzazione contenuti e pubblicità</td>
                      <td>1 anno</td>
                      <td>Richiesto</td>
                    </tr>
                  </tbody>
                </Table>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  3. Cookie di Terze Parti
                </h4>
                <p>
                  Il nostro sito può utilizzare cookie di terze parti per:
                </p>
                <ul>
                  <li><strong>Google Analytics:</strong> Per analizzare il traffico del sito</li>
                  <li><strong>Google Maps:</strong> Per mostrare la mappa del ristorante</li>
                  <li><strong>Social Media:</strong> Per i pulsanti di condivisione social</li>
                </ul>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  4. Gestione dei Cookie
                </h4>
                <p>
                  Puoi gestire le tue preferenze sui cookie in qualsiasi momento:
                </p>
                <ul>
                  <li><strong>Attraverso il banner:</strong> Al primo accesso al sito</li>
                  <li><strong>Impostazioni browser:</strong> Disabilitando i cookie nelle impostazioni</li>
                  <li><strong>Link di opt-out:</strong> Per cookie specifici di terze parti</li>
                </ul>

                <div 
                  className="p-3 rounded mt-4"
                  style={{ backgroundColor: '#FFF3E0', border: '1px solid #FF9800' }}
                >
                  <h5 style={{ color: '#F57C00', marginBottom: '1rem' }}>
                    ⚠️ Disabilitazione dei Cookie
                  </h5>
                  <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                    La disabilitazione di alcuni cookie potrebbe influire sul funzionamento del sito 
                    e limitare alcune funzionalità come l'accesso al tuo account o la gestione delle prenotazioni.
                  </p>
                </div>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  5. Istruzioni per Browser
                </h4>
                <div className="row">
                  <div className="col-md-6">
                    <h6><strong>Chrome:</strong></h6>
                    <p><small>Impostazioni → Privacy e Sicurezza → Cookie</small></p>
                    
                    <h6><strong>Firefox:</strong></h6>
                    <p><small>Preferenze → Privacy e Sicurezza → Cookie</small></p>
                  </div>
                  <div className="col-md-6">
                    <h6><strong>Safari:</strong></h6>
                    <p><small>Preferenze → Privacy → Cookie</small></p>
                    
                    <h6><strong>Edge:</strong></h6>
                    <p><small>Impostazioni → Privacy → Cookie</small></p>
                  </div>
                </div>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  6. Cookie Essenziali per il Servizio
                </h4>
                <p>
                  I seguenti cookie sono essenziali per il funzionamento del nostro servizio di prenotazione:
                </p>
                <ul>
                  <li><strong>auth_token:</strong> Mantiene la sessione di login</li>
                  <li><strong>reservation_data:</strong> Memorizza temporaneamente i dati di prenotazione</li>
                  <li><strong>csrf_token:</strong> Protezione contro attacchi CSRF</li>
                </ul>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  7. Aggiornamenti della Policy
                </h4>
                <p>
                  Questa Cookie Policy può essere aggiornata periodicamente. Ti invitiamo a consultarla 
                  regolarmente per rimanere informato su come utilizziamo i cookie.
                </p>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  8. Contatti
                </h4>
                <p>
                  Per domande sui cookie o per esercitare i tuoi diritti, contattaci:
                </p>
                <ul>
                  <li><strong>Email:</strong> info@aicanipai.it</li>
                  <li><strong>Telefono:</strong> 0583 179 9307</li>
                  <li><strong>Indirizzo:</strong> Via Roma, 22 - 55038 San Romano in Garfagnana (LU)</li>
                </ul>

                <div 
                  className="mt-4 p-3 rounded"
                  style={{ backgroundColor: '#E6DFD0', borderLeft: '4px solid #5D4037' }}
                >
                  <small style={{ color: '#5D4037' }}>
                    <strong>Ultimo aggiornamento:</strong> Giugno 2025<br />
                    <strong>Versione:</strong> 1.0
                  </small>
                </div>

                <div 
                  className="text-center mt-4 p-4 rounded"
                  style={{ backgroundColor: '#F3E5F5', border: '2px solid #8D6E63' }}
                >
                  <h5 style={{ color: '#5D4037', marginBottom: '1rem' }}>
                    🍪 Gestisci le tue Preferenze
                  </h5>
                  <p className="mb-3">
                    Vuoi modificare le tue preferenze sui cookie?
                  </p>
                  <button 
                    className="btn"
                    style={{
                      backgroundColor: '#5D4037',
                      borderColor: '#5D4037',
                      color: '#F0EBDE',
                      fontWeight: 600,
                      borderRadius: '25px',
                      padding: '10px 30px'
                    }}
                    onClick={() => {
                      // Qui andrà la logica per aprire il pannello di gestione cookie
                      alert('Pannello gestione cookie - Da implementare');
                    }}
                  >
                    Gestisci Cookie
                  </button>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CookiePolicy;