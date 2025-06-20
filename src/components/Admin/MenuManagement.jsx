// ===================================================================
// PANNELLO ADMIN GESTIONE MENU
// ===================================================================
// src/components/Admin/MenuManagement.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Alert, Spinner, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaClock, FaLeaf } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import menuService from '../../services/menuService';
import MenuForm from './MenuForm';
import { useToast } from '../../components/common/ToastProvider';

const MenuManagement = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const data = await menuService.getAllActiveMenus();
      setMenus(data);
      setError('');
    } catch (err) {
      console.error('Errore caricamento menu:', err);
      setError('Errore nel caricamento dei menu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenu = () => {
    setEditingMenu(null);
    setShowForm(true);
  };

  const handleEditMenu = (menu) => {
    setEditingMenu(menu);
    setShowForm(true);
  };

  const handleDeleteMenu = (menu) => {
    setMenuToDelete(menu);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await menuService.deleteMenu(menuToDelete.id);
      setMenus(menus.filter(m => m.id !== menuToDelete.id));
      showToast('Menu eliminato con successo', 'success');
    } catch (err) {
      console.error('Errore eliminazione menu:', err);
      showToast('Errore nell\'eliminazione del menu', 'error');
    } finally {
      setShowDeleteModal(false);
      setMenuToDelete(null);
    }
  };

  const handleMenuSaved = (savedMenu) => {
    if (editingMenu) {
      // Aggiornamento
      setMenus(menus.map(m => m.id === savedMenu.id ? savedMenu : m));
      showToast('Menu aggiornato con successo', 'success');
    } else {
      // Creazione
      setMenus([savedMenu, ...menus]);
      showToast('Menu creato con successo', 'success');
    }
    setShowForm(false);
    setEditingMenu(null);
  };

  // Verifica permessi admin
  if (user?.role !== 'ADMIN') {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h5>Accesso Negato</h5>
          <p>Solo gli amministratori possono gestire i menu.</p>
        </Alert>
      </Container>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ backgroundColor: '#F0EBDE', minHeight: '100vh', paddingTop: '2rem' }}
    >
      <Container>
        <motion.div variants={cardVariants}>
          <Card className="shadow-lg border-0 mb-4">
            <Card.Header className="bg-primary text-white">
              <Row className="align-items-center">
                <Col>
                  <h3 className="mb-0">Gestione Menu</h3>
                  <small>Crea e gestisci i menu del ristorante</small>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="light"
                    onClick={handleCreateMenu}
                    className="text-primary fw-bold"
                  >
                    <FaPlus className="me-2" />
                    Nuovo Menu
                  </Button>
                </Col>
              </Row>
            </Card.Header>
          </Card>
        </motion.div>

        {error && (
          <motion.div variants={cardVariants}>
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3">Caricamento menu...</p>
          </div>
        ) : (
          <motion.div variants={containerVariants}>
            {menus.length === 0 ? (
              <motion.div variants={cardVariants}>
                <Alert variant="info" className="text-center py-5">
                  <h5>Nessun menu disponibile</h5>
                  <p>Inizia creando il tuo primo menu!</p>
                  <Button variant="primary" onClick={handleCreateMenu}>
                    <FaPlus className="me-2" />
                    Crea Primo Menu
                  </Button>
                </Alert>
              </motion.div>
            ) : (
              <Row>
                {menus.map((menu) => (
                  <Col key={menu.id} lg={6} className="mb-4">
                    <motion.div variants={cardVariants}>
                      <MenuCard
                        menu={menu}
                        onEdit={() => handleEditMenu(menu)}
                        onDelete={() => handleDeleteMenu(menu)}
                      />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </motion.div>
        )}
      </Container>

      {/* Modal Form Menu */}
      <Modal
        show={showForm}
        onHide={() => setShowForm(false)}
        size="xl"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingMenu ? 'Modifica Menu' : 'Nuovo Menu'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <MenuForm
            menu={editingMenu}
            onSave={handleMenuSaved}
            onCancel={() => setShowForm(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Modal Conferma Eliminazione */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Conferma Eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Sei sicuro di voler eliminare il menu <strong>"{menuToDelete?.name}"</strong>?</p>
          <p className="text-muted small">
            Questa azione non può essere annullata. Il menu verrà disattivato.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annulla
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <FaTrash className="me-2" />
            Elimina Menu
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

// ===================================================================
// COMPONENTE CARTA MENU PER ADMIN
// ===================================================================
const MenuCard = ({ menu, onEdit, onDelete }) => {
  const getMenuTypeInfo = (menuType) => {
    if (menuType === 'DAILY') {
      return {
        icon: <FaClock />,
        color: 'primary',
        label: 'Menu del Giorno',
        extra: menu.menuDate ? new Date(menu.menuDate).toLocaleDateString('it-IT') : ''
      };
    }
    return {
      icon: <FaLeaf />,
      color: 'success',
      label: 'Menu Stagionale',
      extra: ''
    };
  };

  const typeInfo = getMenuTypeInfo(menu.menuType);
  const groupedDishes = menuService.groupDishesByCategory(menu.dishes);
  const categoryNames = menuService.getCategoryDisplayNames();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <Card className="h-100 shadow border-0">
        <Card.Header className={`bg-${typeInfo.color} text-white`}>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">
                {typeInfo.icon} {menu.name}
              </h5>
              <small className="opacity-90">
                {typeInfo.label} {typeInfo.extra && `• ${typeInfo.extra}`}
              </small>
            </Col>
            <Col xs="auto">
              <Badge bg="light" text="dark">
                {menu.dishes.length} piatti
              </Badge>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          {menu.description && (
            <p className="text-muted mb-3">{menu.description}</p>
          )}

          <div className="mb-3">
            {Object.entries(groupedDishes).map(([category, dishes]) => {
              if (dishes.length === 0) return null;
              return (
                <Badge key={category} bg="outline-secondary" className="me-2 mb-1">
                  {categoryNames[category]}: {dishes.length}
                </Badge>
              );
            })}
          </div>

          <small className="text-muted">
            Creato: {new Date(menu.createdAt).toLocaleDateString('it-IT')}
            {menu.updatedAt && menu.updatedAt !== menu.createdAt && (
              <> • Aggiornato: {new Date(menu.updatedAt).toLocaleDateString('it-IT')}</>
            )}
          </small>
        </Card.Body>

        <Card.Footer className="bg-transparent">
          <Row className="g-2">
            <Col>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={onEdit}
                className="w-100"
              >
                <FaEdit className="me-1" />
                Modifica
              </Button>
            </Col>
            <Col>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={onDelete}
                className="w-100"
              >
                <FaTrash className="me-1" />
                Elimina
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </motion.div>
  );
};

export default MenuManagement;