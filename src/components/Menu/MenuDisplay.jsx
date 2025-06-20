// =================================================================
// SOSTITUZIONE COMPLETA per src/components/Menu/MenuDisplay.jsx
// =================================================================

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Tabs, Badge, Spinner, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaUtensils, FaClock, FaLeaf, FaCalendarAlt, FaEuroSign } from 'react-icons/fa';
import menuService from '../../services/menuService';
import { toast } from 'react-toastify';

// ===================================================================
// COMPONENTE PRINCIPALE DISPLAY MENU
// ===================================================================
const MenuDisplay = () => {
  const [dailyMenu, setDailyMenu] = useState(null);
  const [seasonalMenu, setSeasonalMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');
  const [error, setError] = useState(null);

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carica entrambi i menu in parallelo
      const [dailyMenuData, seasonalMenuData] = await Promise.allSettled([
        menuService.getTodaysDailyMenu(),
        menuService.getCurrentSeasonalMenu()
      ]);

      // Gestisci il menu del giorno
      if (dailyMenuData.status === 'fulfilled') {
        setDailyMenu(dailyMenuData.value);
      } else {
        console.warn('Menu del giorno non disponibile:', dailyMenuData.reason);
      }

      // Gestisci il menu stagionale  
      if (seasonalMenuData.status === 'fulfilled') {
        setSeasonalMenu(seasonalMenuData.value);
      } else {
        console.warn('Menu stagionale non disponibile:', seasonalMenuData.reason);
      }

      // Se nessun menu è disponibile
      if (dailyMenuData.status === 'rejected' && seasonalMenuData.status === 'rejected') {
        setError('Nessun menu disponibile al momento. Riprova più tardi.');
      }

      // Imposta il tab di default basato sulla disponibilità
      if (dailyMenuData.status === 'fulfilled') {
        setActiveTab('daily');
      } else if (seasonalMenuData.status === 'fulfilled') {
        setActiveTab('seasonal');
      }

    } catch (error) {
      console.error('Errore nel caricamento dei menu:', error);
      setError('Errore nel caricamento dei menu. Riprova più tardi.');
      toast.error('Errore nel caricamento dei menu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary" />
        <p className="mt-3 text-muted">Caricamento menu...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <FaUtensils size={48} className="mb-3" />
          <h5>{error}</h5>
        </Alert>
      </Container>
    );
  }

  if (!dailyMenu && !seasonalMenu) {
    return (
      <Container className="py-5">
        <Alert variant="info" className="text-center">
          <FaUtensils size={48} className="mb-3" />
          <h5>Menu non ancora disponibili</h5>
          <p>I nostri chef stanno preparando delle deliziose sorprese per voi!</p>
        </Alert>
      </Container>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      style={{ paddingTop: '2rem' }}
    >
      <Container>
        <motion.div variants={cardVariants} className="text-center mb-5">
          <h1 className="display-4 text-primary mb-3">
            <FaUtensils className="me-3" />
            I Nostri Menu
          </h1>
          <p className="lead text-muted">
            Scopri le nostre proposte culinarie preparate con ingredienti freschi e di stagione
          </p>
        </motion.div>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="nav-justified mb-4"
          variant="pills"
        >
          {dailyMenu && (
            <Tab
              eventKey="daily"
              title={
                <span>
                  <FaClock className="me-2" />
                  Menu del Giorno
                </span>
              }
            >
              <MenuCard menu={dailyMenu} type="daily" />
            </Tab>
          )}

          {seasonalMenu && (
            <Tab
              eventKey="seasonal"
              title={
                <span>
                  <FaLeaf className="me-2" />
                  Menu Stagionale
                </span>
              }
            >
              <MenuCard menu={seasonalMenu} type="seasonal" />
            </Tab>
          )}
        </Tabs>
      </Container>
    </motion.div>
  );
};

// ===================================================================
// COMPONENTE SINGOLA CARTA MENU
// ===================================================================
const MenuCard = ({ menu, type }) => {
  const groupedDishes = menuService.groupDishesByCategory(menu.dishes);
  const categoryNames = menuService.getCategoryDisplayNames();

  const getIconForCategory = (category) => {
    const icons = {
      ANTIPASTI: '🥗',
      PRIMI: '🍝',
      SECONDI: '🥩',
      CONTORNI: '🥬',
      DOLCI: '🍰'
    };
    return icons[category] || '🍽️';
  };

  const getFixedPrice = () => {
    if (type === 'daily') {
      // Per menu del giorno, calcola un prezzo fisso o usa un prezzo prestabilito
      return '25.00'; // Esempio di prezzo fisso
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border-0 mb-4">
        <Card.Header className={`text-white ${type === 'daily' ? 'bg-primary' : 'bg-success'}`}>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0">{menu.name}</h3>
              {menu.description && (
                <p className="mb-0 mt-2 opacity-90">{menu.description}</p>
              )}
            </Col>
            <Col xs="auto">
              <Badge bg="light" text="dark" className="fs-6">
                {type === 'daily' ? (
                  <>
                    <FaClock className="me-1" />
                    Oggi
                  </>
                ) : (
                  <>
                    <FaLeaf className="me-1" />
                    Stagionale
                  </>
                )}
              </Badge>
              {menu.menuDate && (
                <div className="mt-1">
                  <small className="opacity-75">
                    <FaCalendarAlt className="me-1" />
                    {new Date(menu.menuDate).toLocaleDateString('it-IT')}
                  </small>
                </div>
              )}
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="p-0">
          {type === 'daily' && getFixedPrice() && (
            <div className={`bg-${type === 'daily' ? 'primary' : 'success'} bg-opacity-10 p-3 text-center border-bottom`}>
              <h4 className="mb-0 text-primary">
                <FaEuroSign className="me-2" />
                Menu Completo: €{getFixedPrice()}
              </h4>
              <small className="text-muted">Include: primo, secondo e contorno</small>
            </div>
          )}

          {Object.entries(groupedDishes).map(([category, dishes]) => {
            if (dishes.length === 0) return null;

            return (
              <div key={category} className="border-bottom">
                <div className={`bg-light p-3 border-start border-4 border-${type === 'daily' ? 'primary' : 'success'}`}>
                  <h5 className="mb-0 text-dark">
                    <span className="me-2">{getIconForCategory(category)}</span>
                    {categoryNames[category]}
                    <Badge bg="secondary" className="ms-2">
                      {dishes.length}
                    </Badge>
                  </h5>
                </div>

                <div className="p-3">
                  <Row>
                    {dishes.map((dish, index) => (
                      <Col md={type === 'daily' ? 12 : 6} key={index} className="mb-3">
                        <DishCard dish={dish} showPrice={type === 'seasonal'} />
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            );
          })}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

// ===================================================================
// COMPONENTE SINGOLO PIATTO
// ===================================================================
const DishCard = ({ dish, showPrice = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-100"
    >
      <Card className="h-100 border-0 shadow-sm">
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="card-title mb-0 text-primary fw-bold">
              {dish.name}
            </h6>
            {showPrice && dish.price && (
              <Badge bg="outline-primary" className="ms-2">
                €{parseFloat(dish.price).toFixed(2)}
              </Badge>
            )}
          </div>

          {dish.description && (
            <p className="card-text text-muted small mb-2">
              {dish.description}
            </p>
          )}

          {dish.ingredients && (
            <div className="mb-2">
              <small className="text-muted">
                <strong>Ingredienti:</strong> {dish.ingredients}
              </small>
            </div>
          )}

          <div className="d-flex align-items-center">
            {dish.isAvailable ? (
              <Badge bg="success" className="me-2">
                <small>Disponibile</small>
              </Badge>
            ) : (
              <Badge bg="secondary" className="me-2">
                <small>Non disponibile</small>
              </Badge>
            )}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default MenuDisplay;