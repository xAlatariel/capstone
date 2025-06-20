// ===================================================================
// COMPONENTE PRINCIPALE MENU (per tutti gli utenti)
// ===================================================================
// src/components/Menu/MenuDisplay.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUtensils, FaClock, FaLeaf } from 'react-icons/fa';
import menuService from '../../services/menuService';

const MenuDisplay = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [dailyMenu, setDailyMenu] = useState(null);
  const [seasonalMenu, setSeasonalMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      setError('');

      // Carica menu del giorno
      try {
        const daily = await menuService.getTodaysDailyMenu();
        setDailyMenu(daily);
      } catch (err) {
        console.log('Nessun menu del giorno disponibile');
      }

      // Carica menu stagionale
      try {
        const seasonal = await menuService.getCurrentSeasonalMenu();
        setSeasonalMenu(seasonal);
      } catch (err) {
        console.log('Nessun menu stagionale disponibile');
      }

      // Se nessun menu è disponibile
      if (!dailyMenu && !seasonalMenu) {
        setError('Nessun menu disponibile al momento.');
      }

    } catch (err) {
      console.error('Errore caricamento menu:', err);
      setError('Errore nel caricamento dei menu. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300 }
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3">Caricamento menu...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <FaUtensils size={30} className="mb-2" />
          <h5>Menu non disponibile</h5>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ backgroundColor: '#F0EBDE', minHeight: '100vh', paddingTop: '2rem' }}
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
                    Oggi: {new Date(menu.menuDate).toLocaleDateString('it-IT')}
                  </>
                ) : (
                  <>
                    <FaLeaf className="me-1" />
                    Stagionale
                  </>
                )}
              </Badge>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="p-0">
          {Object.entries(groupedDishes).map(([category, dishes]) => {
            if (dishes.length === 0) return null;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="border-bottom"
              >
                <div className="bg-light px-4 py-3">
                  <h5 className="mb-0 text-primary">
                    {getIconForCategory(category)} {categoryNames[category]}
                  </h5>
                </div>
                <div className="px-4 py-3">
                  <Row>
                    {dishes.map((dish, index) => (
                      <Col key={dish.id} md={type === 'daily' ? 4 : 6} className="mb-3">
                        <DishCard dish={dish} />
                      </Col>
                    ))}
                  </Row>
                </div>
              </motion.div>
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
const DishCard = ({ dish }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <Card className="h-100 border-0 shadow-sm">
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="card-title text-primary mb-0 flex-grow-1">
              {dish.name}
            </h6>
            {dish.price && (
              <Badge bg="secondary" className="ms-2">
                {menuService.formatPrice(dish.price)}
              </Badge>
            )}
          </div>
          
          {dish.description && (
            <p className="card-text text-muted small mb-2">
              {dish.description}
            </p>
          )}
          
          {dish.ingredients && (
            <p className="card-text">
              <small className="text-muted">
                <strong>Ingredienti:</strong> {dish.ingredients}
              </small>
            </p>
          )}
          
          {!dish.isAvailable && (
            <Badge bg="warning" text="dark" className="mt-1">
              Non disponibile
            </Badge>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default MenuDisplay;