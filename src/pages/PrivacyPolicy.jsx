import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';

const PrivacyPolicy = () => {
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
                Privacy Policy
              </h1>

              <div 
                className="bg-white p-5 rounded-4 shadow-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <h3 style={{ color: '#5D4037', marginBottom: '1.5rem' }}>
                  Informativa sulla Privacy
                </h3>
                
                <p className="mb-4">
                  La presente informativa privacy descrive le modalità di trattamento dei dati personali 
                  degli utenti che visitano il sito web del Ristorante Ai Canipai.
                </p>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  1. Titolare del Trattamento
                </h4>
                <p>
                  <strong>Ristorante Ai Canipai</strong><br />
                  Via Roma, 22 - 55038 San Romano in Garfagnana (LU)<br />
                  Telefono: 0583 179 9307<br />
                  Email: info@aicanipai.it
                </p>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  2. Tipologie di Dati Raccolti
                </h4>
                <p>
                  Raccogliamo i seguenti tipi di dati personali:
                </p>
                <ul>
                  <li><strong>Dati di registrazione:</strong> nome, cognome, email, telefono</li>
                  <li><strong>Dati di prenotazione:</strong> data, ora, numero di persone, preferenze</li>
                  <li><strong>Dati di navigazione:</strong> cookie tecnici e di analisi</li>
                </ul>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  3. Finalità del Trattamento
                </h4>
                <p>
                  I dati personali vengono trattati per le seguenti finalità:
                </p>
                <ul>
                  <li>Gestione delle prenotazioni e servizio clienti</li>
                  <li>Comunicazioni relative al servizio</li>
                  <li>Miglioramento dell'esperienza utente</li>
                  <li>Adempimenti di legge</li>
                </ul>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  4. Base Giuridica
                </h4>
                <p>
                  Il trattamento dei dati si basa su:
                </p>
                <ul>
                  <li>Consenso dell'interessato per marketing e comunicazioni promozionali</li>
                  <li>Esecuzione di un contratto per la gestione delle prenotazioni</li>
                  <li>Interesse legittimo per l'analisi dei dati di navigazione</li>
                </ul>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  5. Conservazione dei Dati
                </h4>
                <p>
                  I dati personali vengono conservati per il tempo necessario alle finalità per cui sono stati raccolti:
                </p>
                <ul>
                  <li>Dati di prenotazione: 2 anni dalla data del servizio</li>
                  <li>Dati di registrazione: fino alla richiesta di cancellazione</li>
                  <li>Dati di navigazione: secondo quanto previsto dalla Cookie Policy</li>
                </ul>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  6. Diritti dell'Interessato
                </h4>
                <p>
                  L'interessato ha diritto di:
                </p>
                <ul>
                  <li>Accedere ai propri dati personali</li>
                  <li>Rettificare dati inesatti o incompleti</li>
                  <li>Cancellare i dati (diritto all'oblio)</li>
                  <li>Limitare il trattamento</li>
                  <li>Opporsi al trattamento</li>
                  <li>Portabilità dei dati</li>
                </ul>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  7. Sicurezza dei Dati
                </h4>
                <p>
                  Adottiamo misure tecniche e organizzative appropriate per proteggere i dati personali 
                  da accessi non autorizzati, perdita, distruzione o divulgazione.
                </p>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  8. Modifiche alla Privacy Policy
                </h4>
                <p>
                  Ci riserviamo il diritto di modificare questa informativa privacy. 
                  Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.
                </p>

                <h4 style={{ color: '#8D6E63', marginTop: '2rem', marginBottom: '1rem' }}>
                  9. Contatti
                </h4>
                <p>
                  Per esercitare i tuoi diritti o per qualsiasi domanda relativa al trattamento dei dati personali, 
                  puoi contattarci a: <strong>info@aicanipai.it</strong>
                </p>

                <div 
                  className="mt-4 p-3 rounded"
                  style={{ backgroundColor: '#E6DFD0', borderLeft: '4px solid #5D4037' }}
                >
                  <small style={{ color: '#5D4037' }}>
                    <strong>Ultimo aggiornamento:</strong> Giugno 2025
                  </small>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;