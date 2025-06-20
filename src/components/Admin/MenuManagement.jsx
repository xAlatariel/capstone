// =================================================================
// NUOVO FILE: src/components/Admin/MenuManagement.jsx
// =================================================================

import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Modal, Form, 
  Alert, Spinner, Badge, Tab, Tabs, Table, 
  InputGroup, FormControl, Dropdown, DropdownButton
} from 'react-bootstrap';
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaCopy, 
  FaCalendarAlt, FaLeaf, FaClock, FaUtensils,
  FaSave, FaTimes, FaExclamationTriangle, FaToggleOn, FaToggleOff
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import menuService from '../../services/menuService';
import { toast } from 'react-toastify';

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, edit, view
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const data = await menuService.getAllMenus();
      setMenus(data);
    } catch (error) {
      toast.error('Errore nel caricamento dei menu');
      console.error('Errore caricamento menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenu = (type) => {
    const template = type === 'DAILY' 
      ? menuService.createDailyMenuTemplate()
      : menuService.createSeasonalMenuTemplate();
    
    setSelectedMenu(template);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditMenu = (menu) => {
    setSelectedMenu(menu);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewMenu = (menu) => {
    setSelectedMenu(menu);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeleteMenu = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo menu?')) {
      try {
        await menuService.deleteMenu(id);
        toast.success('Menu eliminato con successo');
        loadMenus();
      } catch (error) {
        toast.error('Errore nell\'eliminazione del menu');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await menuService.toggleMenuStatus(id, !currentStatus);
      toast.success(`Menu ${!currentStatus ? 'attivato' : 'disattivato'} con successo`);
      loadMenus();
    } catch (error) {
      toast.error('Errore nella modifica dello stato del menu');
    }
  };

  const handleDuplicateMenu = (menu) => {
    const duplicated = {
      ...menu,
      id: null,
      name: `${menu.name} - Copia`,
      isActive: false,
      createdAt: null,
      updatedAt: null
    };
    
    setSelectedMenu(duplicated);
    setModalMode('create');
    setShowModal(true);
  };

  const filteredMenus = menus.filter(menu => {
    const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'daily' && menu.menuType === 'DAILY') ||
                      (activeTab === 'seasonal' && menu.menuType === 'SEASONAL') ||
                      (activeTab === 'active' && menu.isActive) ||
                      (activeTab === 'inactive' && !menu.isActive);
    
    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Caricamento menu...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">
            <FaUtensils className="me-2" />
            Gestione Menu
          </h2>
        </Col>
        <Col xs="auto">
          <DropdownButton id="dropdown-create" title="Crea Nuovo Menu" variant="primary">
            <Dropdown.Item onClick={() => handleCreateMenu('DAILY')}>
              <FaClock className="me-2" />
              Menu del Giorno
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleCreateMenu('SEASONAL')}>
              <FaLeaf className="me-2" />
              Menu Stagionale
            </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6}>
              <InputGroup>
                <FormControl
                  placeholder="Cerca menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Tabs
                activeKey={activeTab}
                onSelect={setActiveTab}
                className="border-bottom-0"
              >
                <Tab eventKey="all" title="Tutti" />
                <Tab eventKey="daily" title="Del Giorno" />
                <Tab eventKey="seasonal" title="Stagionali" />
                <Tab eventKey="active" title="Attivi" />
                <Tab eventKey="inactive" title="Inattivi" />
              </Tabs>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <MenuList
        menus={filteredMenus}
        onEdit={handleEditMenu}
        onView={handleViewMenu}
        onDelete={handleDeleteMenu}
        onDuplicate={handleDuplicateMenu}
        onToggleStatus={handleToggleStatus}
      />

      <MenuModal
        show={showModal}
        onHide={() => setShowModal(false)}
        mode={modalMode}
        menu={selectedMenu}
        onSave={loadMenus}
      />
    </Container>
  );
};

// =================================================================
// COMPONENTE LISTA MENU
// =================================================================

const MenuList = ({ menus, onEdit, onView, onDelete, onDuplicate, onToggleStatus }) => {
  if (menus.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <FaUtensils size={48} className="text-muted mb-3" />
          <h5 className="text-muted">Nessun menu trovato</h5>
          <p className="text-muted">Crea il tuo primo menu per iniziare</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Row>
      {menus.map(menu => (
        <Col lg={6} xl={4} key={menu.id} className="mb-4">
          <MenuCard
            menu={menu}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onToggleStatus={onToggleStatus}
          />
        </Col>
      ))}
    </Row>
  );
};

// =================================================================
// COMPONENTE SINGOLA CARD MENU
// =================================================================

const MenuCard = ({ menu, onEdit, onView, onDelete, onDuplicate, onToggleStatus }) => {
  const getMenuTypeInfo = (type) => {
    switch (type) {
      case 'DAILY':
        return { icon: FaClock, text: 'Menu del Giorno', color: 'primary' };
      case 'SEASONAL':
        return { icon: FaLeaf, text: 'Menu Stagionale', color: 'success' };
      default:
        return { icon: FaUtensils, text: 'Menu', color: 'secondary' };
    }
  };

  const typeInfo = getMenuTypeInfo(menu.menuType);
  const TypeIcon = typeInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-100 shadow-sm border-0">
        <Card.Header className={`bg-${typeInfo.color} text-white`}>
          <Row className="align-items-center">
            <Col>
              <TypeIcon className="me-2" />
              {typeInfo.text}
            </Col>
            <Col xs="auto">
              <Badge bg={menu.isActive ? 'success' : 'secondary'}>
                {menu.isActive ? 'Attivo' : 'Inattivo'}
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        
        <Card.Body>
          <h5 className="card-title mb-2">{menu.name}</h5>
          {menu.description && (
            <p className="card-text text-muted mb-3">{menu.description}</p>
          )}
          
          <div className="mb-3">
            <small className="text-muted">
              <strong>Piatti:</strong> {menu.dishes?.length || 0}
            </small>
            {menu.menuDate && (
              <div>
                <small className="text-muted">
                  <FaCalendarAlt className="me-1" />
                  {new Date(menu.menuDate).toLocaleDateString('it-IT')}
                </small>
              </div>
            )}
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <Button size="sm" variant="outline-primary" onClick={() => onView(menu)}>
              <FaEye />
            </Button>
            <Button size="sm" variant="outline-warning" onClick={() => onEdit(menu)}>
              <FaEdit />
            </Button>
            <Button size="sm" variant="outline-info" onClick={() => onDuplicate(menu)}>
              <FaCopy />
            </Button>
            <Button 
              size="sm" 
              variant={menu.isActive ? "outline-secondary" : "outline-success"}
              onClick={() => onToggleStatus(menu.id, menu.isActive)}
            >
              {menu.isActive ? <FaToggleOff /> : <FaToggleOn />}
            </Button>
            <Button size="sm" variant="outline-danger" onClick={() => onDelete(menu.id)}>
              <FaTrash />
            </Button>
          </div>
        </Card.Body>
        
        <Card.Footer className="text-muted">
          <small>
            Creato il {new Date(menu.createdAt).toLocaleDateString('it-IT')}
          </small>
        </Card.Footer>
      </Card>
    </motion.div>
  );
};

// =================================================================
// MODAL PER CREAZIONE/MODIFICA MENU
// =================================================================

const MenuModal = ({ show, onHide, mode, menu, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    menuType: 'DAILY',
    menuDate: '',
    dishes: [],
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (menu) {
      setFormData({
        ...menu,
        menuDate: menu.menuDate ? new Date(menu.menuDate).toISOString().split('T')[0] : ''
      });
    }
  }, [menu]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const menuData = {
        ...formData,
        menuDate: formData.menuDate || null
      };

      if (mode === 'create') {
        await menuService.createMenu(menuData);
        toast.success('Menu creato con successo');
      } else {
        await menuService.updateMenu(menu.id, menuData);
        toast.success('Menu aggiornato con successo');
      }

      onHide();
      onSave();
    } catch (error) {
      if (error.message.includes('validation')) {
        setErrors({ general: error.message });
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddDish = () => {
    const newDish = {
      name: '',
      description: '',
      ingredients: '',
      category: formData.menuType === 'DAILY' ? 'PRIMI' : 'ANTIPASTI',
      price: '',
      isAvailable: true,
      displayOrder: formData.dishes.length + 1
    };
    
    setFormData(prev => ({
      ...prev,
      dishes: [...prev.dishes, newDish]
    }));
  };

  const handleRemoveDish = (index) => {
    setFormData(prev => ({
      ...prev,
      dishes: prev.dishes.filter((_, i) => i !== index)
    }));
  };

  const handleDishChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      dishes: prev.dishes.map((dish, i) => 
        i === index ? { ...dish, [field]: value } : dish
      )
    }));
  };

  const isReadOnly = mode === 'view';
  const isDaily = formData.menuType === 'DAILY';

  return (
    <Modal show={show} onHide={onHide} size="xl" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'create' && 'Crea Nuovo Menu'}
          {mode === 'edit' && 'Modifica Menu'}
          {mode === 'view' && 'Visualizza Menu'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errors.general && (
            <Alert variant="danger">
              <FaExclamationTriangle className="me-2" />
              {errors.general}
            </Alert>
          )}

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nome Menu *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={isReadOnly}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tipo Menu</Form.Label>
                <Form.Select
                  value={formData.menuType}
                  onChange={(e) => setFormData(prev => ({ ...prev, menuType: e.target.value }))}
                  disabled={isReadOnly || mode === 'edit'}
                >
                  <option value="DAILY">Menu del Giorno</option>
                  <option value="SEASONAL">Menu Stagionale</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Descrizione</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={isReadOnly}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Data Menu</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.menuDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, menuDate: e.target.value }))}
                  disabled={isReadOnly}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Menu Attivo"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  disabled={isReadOnly}
                  className="mt-4"
                />
              </Form.Group>
            </Col>
          </Row>

          {isDaily && (
            <Alert variant="info">
              <strong>Menu del Giorno:</strong> Deve contenere esattamente 3 primi, 3 secondi e 3 contorni.
            </Alert>
          )}

          <DishesSection
            dishes={formData.dishes}
            menuType={formData.menuType}
            isReadOnly={isReadOnly}
            onAddDish={handleAddDish}
            onRemoveDish={handleRemoveDish}
            onDishChange={handleDishChange}
          />
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            <FaTimes className="me-2" />
            {mode === 'view' ? 'Chiudi' : 'Annulla'}
          </Button>
          {!isReadOnly && (
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <Spinner animation="border" size="sm" className="me-2" />
              ) : (
                <FaSave className="me-2" />
              )}
              {mode === 'create' ? 'Crea Menu' : 'Salva Modifiche'}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// =================================================================
// SEZIONE GESTIONE PIATTI
// =================================================================

const DishesSection = ({ dishes, menuType, isReadOnly, onAddDish, onRemoveDish, onDishChange }) => {
  const categoryNames = menuService.getCategoryDisplayNames();
  const groupedDishes = menuService.groupDishesByCategory(dishes);

  const getAvailableCategories = () => {
    if (menuType === 'DAILY') {
      return ['PRIMI', 'SECONDI', 'CONTORNI'];
    }
    return Object.keys(categoryNames);
  };

  const getCategoryLimit = (category) => {
    if (menuType === 'DAILY') {
      return ['PRIMI', 'SECONDI', 'CONTORNI'].includes(category) ? 3 : 0;
    }
    return null; // Nessun limite per menu stagionale
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Piatti del Menu</h5>
        {!isReadOnly && (
          <Button variant="outline-primary" size="sm" onClick={onAddDish}>
            <FaPlus className="me-2" />
            Aggiungi Piatto
          </Button>
        )}
      </div>

      {getAvailableCategories().map(category => {
        const categoryDishes = groupedDishes[category] || [];
        const limit = getCategoryLimit(category);
        const isOverLimit = limit && categoryDishes.length > limit;
        const isUnderLimit = limit && categoryDishes.length < limit;

        return (
          <Card key={category} className="mb-3">
            <Card.Header className={`${isOverLimit ? 'bg-danger text-white' : isUnderLimit ? 'bg-warning' : 'bg-light'}`}>
              <Row className="align-items-center">
                <Col>
                  <strong>{categoryNames[category]}</strong>
                  {limit && (
                    <Badge bg="secondary" className="ms-2">
                      {categoryDishes.length}/{limit}
                    </Badge>
                  )}
                </Col>
                {(isOverLimit || isUnderLimit) && (
                  <Col xs="auto">
                    <small>
                      {isOverLimit && '⚠️ Troppi piatti'}
                      {isUnderLimit && '⚠️ Piatti mancanti'}
                    </small>
                  </Col>
                )}
              </Row>
            </Card.Header>
            
            <Card.Body>
              {categoryDishes.length === 0 ? (
                <p className="text-muted mb-0">Nessun piatto in questa categoria</p>
              ) : (
                categoryDishes.map((dish, index) => {
                  const dishIndex = dishes.findIndex(d => d === dish);
                  return (
                    <DishRow
                      key={dishIndex}
                      dish={dish}
                      index={dishIndex}
                      isReadOnly={isReadOnly}
                      onRemove={onRemoveDish}
                      onChange={onDishChange}
                    />
                  );
                })
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

// =================================================================
// COMPONENTE SINGOLO PIATTO
// =================================================================

const DishRow = ({ dish, index, isReadOnly, onRemove, onChange }) => {
  return (
    <Card className="mb-3 border-start border-4 border-primary">
      <Card.Body>
        <Row className="align-items-start">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Nome Piatto *</Form.Label>
              <Form.Control
                type="text"
                value={dish.name}
                onChange={(e) => onChange(index, 'name', e.target.value)}
                disabled={isReadOnly}
                required
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group>
              <Form.Label>Prezzo (€)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={dish.price}
                onChange={(e) => onChange(index, 'price', e.target.value)}
                disabled={isReadOnly}
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group>
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                value={dish.category}
                onChange={(e) => onChange(index, 'category', e.target.value)}
                disabled={isReadOnly}
              >
                <option value="ANTIPASTI">Antipasti</option>
                <option value="PRIMI">Primi</option>
                <option value="SECONDI">Secondi</option>
                <option value="CONTORNI">Contorni</option>
                <option value="DOLCI">Dolci</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={4}>
            <Form.Group>
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={dish.description}
                onChange={(e) => onChange(index, 'description', e.target.value)}
                disabled={isReadOnly}
              />
            </Form.Group>
          </Col>
          
          <Col md={1}>
            {!isReadOnly && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onRemove(index)}
                className="mt-4"
              >
                <FaTrash />
              </Button>
            )}
          </Col>
        </Row>
        
        <Row className="mt-2">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Ingredienti</Form.Label>
              <Form.Control
                type="text"
                value={dish.ingredients}
                onChange={(e) => onChange(index, 'ingredients', e.target.value)}
                disabled={isReadOnly}
                placeholder="Ingredienti separati da virgola"
              />
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group>
              <Form.Label>Ordine</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={dish.displayOrder}
                onChange={(e) => onChange(index, 'displayOrder', parseInt(e.target.value))}
                disabled={isReadOnly}
              />
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Disponibile"
                checked={dish.isAvailable}
                onChange={(e) => onChange(index, 'isAvailable', e.target.checked)}
                disabled={isReadOnly}
                className="mt-4"
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default MenuManagement;