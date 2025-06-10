import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Tab, Tabs, Badge } from 'react-bootstrap';
import { FaLeaf, FaFire, FaStopwatch, FaUtensils, FaWineGlassAlt, FaCoffee } from 'react-icons/fa';

const PageHeader = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className="text-center py-5" style={{ backgroundColor: '#F0EBDE' }}>
      <Container>
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.8 }}
          className="display-3 mb-4"
          style={{ 
            color: "#5D4037",
            fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 600
          }}
        >
          La Nostra Carta
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lead"
          style={{
            color: "#8D6E63",
            maxWidth: "700px",
            margin: "0 auto",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.2rem"
          }}
        >
          Scopri i sapori autentici della Garfagnana attraverso la nostra selezione di piatti tradizionali, 
          preparati con ingredienti locali e ricette tramandate nel tempo.
        </motion.p>
      </Container>
    </div>
  );
};

const MenuCard = ({ item, index, inView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-4"
    >
      <Card 
        className="h-100 border-0 shadow-sm"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderRadius: '15px',
          overflow: 'hidden'
        }}
      >
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5 
              className="card-title mb-0"
              style={{ 
                color: '#5D4037',
                fontFamily: 'Cormorant Garamond, serif',
                fontWeight: 600,
                fontSize: '1.4rem'
              }}
            >
              {item.name}
            </h5>
            <span 
              className="fw-bold"
              style={{ 
                color: '#8D6E63',
                fontSize: '1.2rem'
              }}
            >
              €{item.price}
            </span>
          </div>
          
          <p 
            className="card-text"
            style={{ 
              fontFamily: 'Montserrat, sans-serif',
              color: '#666',
              lineHeight: '1.6',
              fontSize: '0.95rem'
            }}
          >
            {item.description}
          </p>
          
          {item.features && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {item.features.map((feature, idx) => (
                <Badge 
                  key={idx}
                  className="d-flex align-items-center gap-1"
                  style={{ 
                    backgroundColor: '#E6DFD0',
                    color: '#5D4037',
                    fontSize: '0.8rem'
                  }}
                >
                  {feature.icon}
                  {feature.text}
                </Badge>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

const MenuSection = ({ title, items, icon }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className="mb-5">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 0.6 }}
        className="d-flex align-items-center mb-4"
      >
        <div 
          className="p-3 rounded-circle me-3"
          style={{ backgroundColor: '#5D4037', color: '#F0EBDE' }}
        >
          {icon}
        </div>
        <h2 
          className="mb-0"
          style={{ 
            color: '#5D4037',
            fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 600
          }}
        >
          {title}
        </h2>
      </motion.div>
      
      <Row>
        {items.map((item, index) => (
          <Col key={index} lg={6} className="mb-4">
            <MenuCard item={item} index={index} inView={inView} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

const Menu = () => {
  const [activeTab, setActiveTab] = useState('antipasti');

  // Dati del menu
  const menuData = {
    antipasti: {
      title: 'Antipasti',
      icon: <FaUtensils size={24} />,
      items: [
        {
          name: 'Tagliere di Salumi e Formaggi Locali',
          price: '16.00',
          description: 'Selezione di salumi tipici della Garfagnana accompagnati da formaggi stagionati, miele di castagno e mostarda di fichi.',
          features: [
            { icon: <FaLeaf />, text: 'Prodotti Locali' }
          ]
        },
        {
          name: 'Bruschette della Tradizione',
          price: '8.00',
          description: 'Pane casereccio tostato con pomodoro fresco, basilico, aglio e olio extravergine d\'oliva toscano.',
          features: [
            { icon: <FaLeaf />, text: 'Vegetariano' }
          ]
        },
        {
          name: 'Crostini di Fegatini',
          price: '9.00',
          description: 'Tradizionale antipasto toscano con paté di fegatini di pollo, capperi e acciughe su pane casereccio.',
          features: [
            { icon: <FaStopwatch />, text: 'Ricetta Storica' }
          ]
        },
        {
          name: 'Antipasto del Pastore',
          price: '14.00',
          description: 'Ricotta fresca di pecora, salsiccia stagionata, olive taggiasche e verdure sott\'olio della casa.',
          features: [
            { icon: <FaLeaf />, text: 'Km Zero' }
          ]
        }
      ]
    },
    primi: {
      title: 'Primi Piatti',
      icon: <FaUtensils size={24} />,
      items: [
        {
          name: 'Tordelli della Garfagnana',
          price: '14.00',
          description: 'Pasta fresca ripiena di carne mista, spinaci e ricotta, condita con ragù di cinghiale e parmigiano stagionato.',
          features: [
            { icon: <FaFire />, text: 'Piatto del Territorio' },
            { icon: <FaStopwatch />, text: 'Fatto in Casa' }
          ]
        },
        {
          name: 'Pappardelle al Ragù di Cinghiale',
          price: '13.00',
          description: 'Pappardelle fresche tirate a mano con ragù di cinghiale marinato nel vino rosso, profumato con erbe aromatiche.',
          features: [
            { icon: <FaFire />, text: 'Specialty' },
            { icon: <FaStopwatch />, text: 'Cottura Lenta' }
          ]
        },
        {
          name: 'Ravioli Ricotta e Spinaci',
          price: '12.00',
          description: 'Ravioli fatti in casa con ricotta fresca e spinaci, conditi con burro, salvia e noci del territorio.',
          features: [
            { icon: <FaLeaf />, text: 'Vegetariano' },
            { icon: <FaStopwatch />, text: 'Fatto in Casa' }
          ]
        },
        {
          name: 'Zuppa di Farro della Garfagnana IGP',
          price: '10.00',
          description: 'Tradizionale zuppa con farro IGP, legumi misti, verdure di stagione e olio extravergine a crudo.',
          features: [
            { icon: <FaLeaf />, text: 'Vegano' },
            { icon: <FaFire />, text: 'IGP' }
          ]
        }
      ]
    },
    secondi: {
      title: 'Secondi Piatti',
      icon: <FaUtensils size={24} />,
      items: [
        {
          name: 'Tagliata di Manzo della Garfagnana',
          price: '18.00',
          description: 'Tagliata di manzo locale cotta alla griglia, servita su letto di rucola con pomodorini e scaglie di pecorino.',
          features: [
            { icon: <FaFire />, text: 'Carne Locale' },
            { icon: <FaLeaf />, text: 'Allevamento Sostenibile' }
          ]
        },
        {
          name: 'Agnello alle Erbe di Montagna',
          price: '16.00',
          description: 'Costolette di agnello locale marinate con rosmarino, timo e maggiorana, cotte al forno con patate novelle.',
          features: [
            { icon: <FaFire />, text: 'Specialty' },
            { icon: <FaStopwatch />, text: 'Marinatura 24h' }
          ]
        },
        {
          name: 'Salmone in Crosta di Erbe',
          price: '15.00',
          description: 'Filetto di salmone in crosta di erbe aromatiche, servito con verdure grigliate e salsa al limone.',
          features: [
            { icon: <FaLeaf />, text: 'Pesce Fresco' }
          ]
        },
        {
          name: 'Verdure Grigliate della Stagione',
          price: '11.00',
          description: 'Selezione di verdure di stagione grigliate, condite con olio extravergine, aceto balsamico e erbe fresche.',
          features: [
            { icon: <FaLeaf />, text: 'Vegetariano' },
            { icon: <FaFire />, text: 'Stagionale' }
          ]
        }
      ]
    },
    dolci: {
      title: 'Dolci',
      icon: <FaCoffee size={24} />,
      items: [
        {
          name: 'Tiramisù della Casa',
          price: '6.00',
          description: 'Il nostro tiramisù preparato con mascarpone fresco, savoiardi imbevuti nel caffè espresso e cacao amaro.',
          features: [
            { icon: <FaStopwatch />, text: 'Fatto in Casa' }
          ]
        },
        {
          name: 'Castagnaccio della Tradizione',
          price: '5.00',
          description: 'Dolce tipico toscano preparato con farina di castagne, pinoli, uvetta e rosmarino, secondo l\'antica ricetta.',
          features: [
            { icon: <FaLeaf />, text: 'Tradizionale' },
            { icon: <FaFire />, text: 'Senza Glutine' }
          ]
        },
        {
          name: 'Panna Cotta ai Frutti di Bosco',
          price: '5.50',
          description: 'Delicata panna cotta vanigliata accompagnata da coulis di frutti di bosco freschi del territorio montano.',
          features: [
            { icon: <FaLeaf />, text: 'Senza Glutine' }
          ]
        },
        {
          name: 'Cantucci e Vin Santo',
          price: '7.00',
          description: 'Biscotti alle mandorle della tradizione toscana serviti con un bicchierino di Vin Santo del Chianti.',
          features: [
            { icon: <FaStopwatch />, text: 'Tradizionale' },
            { icon: <FaWineGlassAlt />, text: 'Con Vin Santo' }
          ]
        }
      ]
    },
    bevande: {
      title: 'Bevande & Vini',
      icon: <FaWineGlassAlt size={24} />,
      items: [
        {
          name: 'Chianti Classico DOCG',
          price: '18.00',
          description: 'Vino rosso strutturato delle colline senesi, ideale per accompagnare carni rosse e formaggi stagionati.',
          features: [
            { icon: <FaWineGlassAlt />, text: 'DOCG' }
          ]
        },
        {
          name: 'Vermentino di Toscana DOC',
          price: '15.00',
          description: 'Vino bianco fresco e minerale, perfetto con antipasti di mare e primi piatti delicati.',
          features: [
            { icon: <FaWineGlassAlt />, text: 'DOC' }
          ]
        },
        {
          name: 'Birra Artigianale della Garfagnana',
          price: '5.00',
          description: 'Birra locale prodotta con ingredienti del territorio, disponibile bionda o ambrata.',
          features: [
            { icon: <FaLeaf />, text: 'Artigianale' }
          ]
        },
        {
          name: 'Caffè Espresso',
          price: '1.50',
          description: 'Miscela italiana di alta qualità, tostatura media, servito nella tradizionale tazzina di porcellana.',
          features: [
            { icon: <FaCoffee />, text: 'Arabica' }
          ]
        },
        {
          name: 'Grappa di Nebbiolo',
          price: '4.00',
          description: 'Distillato di vinacce di Nebbiolo, invecchiato in botti di rovere, per chiudere il pasto in eleganza.',
          features: [
            { icon: <FaWineGlassAlt />, text: 'Invecchiata' }
          ]
        }
      ]
    }
  };

  return (
    <div style={{ backgroundColor: '#F0EBDE', minHeight: '100vh', paddingTop: '100px' }}>
      <PageHeader />
      
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-5 justify-content-center"
            style={{
              borderBottom: '3px solid #5D4037'
            }}
          >
            {Object.entries(menuData).map(([key, section]) => (
              <Tab
                key={key}
                eventKey={key}
                title={
                  <span 
                    className="d-flex align-items-center gap-2 px-3 py-2"
                    style={{ 
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600,
                      color: activeTab === key ? '#5D4037' : '#8D6E63'
                    }}
                  >
                    {section.icon}
                    {section.title}
                  </span>
                }
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MenuSection
                      title={section.title}
                      items={section.items}
                      icon={section.icon}
                    />
                  </motion.div>
                </AnimatePresence>
              </Tab>
            ))}
          </Tabs>
        </motion.div>

        {/* Note informative */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-5 p-4"
          style={{ 
            backgroundColor: '#E6DFD0',
            borderRadius: '15px',
            border: '2px solid #8D6E63'
          }}
        >
          <h4 
            className="mb-3"
            style={{ 
              color: '#5D4037',
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: 600
            }}
          >
            Note Importanti
          </h4>
          <Row>
            <Col md={4} className="mb-3">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <FaLeaf style={{ color: '#4CAF50' }} />
                <small style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <strong>Ingredienti Locali:</strong> Privilegiamo fornitori del territorio
                </small>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <FaStopwatch style={{ color: '#FF9800' }} />
                <small style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <strong>Fatto in Casa:</strong> Pasta fresca preparata quotidianamente
                </small>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <FaUtensils style={{ color: '#5D4037' }} />
                <small style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <strong>Allergeni:</strong> Informate il personale per intolleranze
                </small>
              </div>
            </Col>
          </Row>
          <p 
            className="mt-3 mb-0"
            style={{ 
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'italic',
              color: '#666',
              fontSize: '0.9rem'
            }}
          >
            I prezzi sono comprensivi di servizio. Alcuni piatti potrebbero variare in base alla disponibilità stagionale degli ingredienti.
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-5"
        >
          <motion.a
            href="/ReservationPage"
            className="btn btn-lg px-5 py-3"
            style={{
              backgroundColor: '#5D4037',
              borderColor: '#5D4037',
              color: '#F0EBDE',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              borderRadius: '50px',
              textDecoration: 'none',
              fontSize: '1.1rem'
            }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: '#8D6E63'
            }}
            whileTap={{ scale: 0.95 }}
          >
            Prenota il Tuo Tavolo
          </motion.a>
        </motion.div>
      </Container>
    </div>
  );
};

export default Menu;