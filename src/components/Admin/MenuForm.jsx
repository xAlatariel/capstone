// ===================================================================
// FORM PER CREAZIONE/MODIFICA MENU
// ===================================================================
// src/components/Admin/MenuForm.jsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaSave, FaTimes, FaClock, FaLeaf } from 'react-icons/fa';
import menuService from '../../services/menuService';

const MenuForm = ({ menu, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    menu || menuService.createDailyMenuTemplate()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const isEditing = !!menu;
  const categoryNames = menuService.getCategoryDisplayNames();
  const menuTypes = menuService.getMenuTypes();

  useEffect(() => {
    if (menu) {
      setFormData(menu);
    }
  }, [menu]);

  const handleBasicInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Pulisce errori di validazione
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleMenuTypeChange = (newType) => {
    if (newType === 'DAILY') {
      // Cambia a menu del giorno - usa template fisso
      setFormData(menuService.createDailyMenuTemplate());
    } else {
      // Cambia a menu stagionale - usa template vuoto
      setFormData(menuService.createSeasonalMenuTemplate());
    }
    setError('');
    setValidationErrors({});
  };

  const handleDishChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      dishes: prev.dishes.map((dish, i) =>
        i === index ? { ...dish, [field]: value } : dish
      )
    }));
  };

  const addDish = (category) => {
    const newDish = {
      name: '',
      description: '',
      ingredients: '',
      category: category,
      price: '',
      isAvailable: true,
      displayOrder: formData.dishes.filter(d => d.category === category).length + 1
    };

    setFormData(prev => ({
      ...prev,
      dishes: [...prev.dishes, newDish]
    }));
  };

  const removeDish = (index) => {
    setFormData(prev => ({
      ...prev,
      dishes: prev.dishes.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Validazione dati base
    if (!formData.name?.trim()) {
      errors.name = 'Il nome del menu è obbligatorio';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Il nome deve essere di almeno 3 caratteri';
    }

    if (!formData.menuType) {
      errors.menuType = 'Il tipo di menu è obbligatorio';
    }

    if (formData.dishes.length === 0) {
      errors.dishes = 'Il menu deve contenere almeno un piatto';
    }

    // Validazione piatti
    formData.dishes.forEach((dish, index) => {
      if (!dish.name?.trim()) {
        errors[`dish_${index}_name`] = 'Nome piatto obbligatorio';
      }
      if (!dish.category) {
        errors[`dish_${index}_category`] = 'Categoria obbligatoria';
      }
      if (dish.price && (isNaN(dish.price) || parseFloat(dish.price) <= 0)) {
        errors[`dish_${index}_price`] = 'Prezzo non valido';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Correggi gli errori evidenziati prima di continuare.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Prepara i dati per l'invio
      const menuData = {
        ...formData,
        dishes: formData.dishes.map(dish => ({
          ...dish,
          price: dish.price ? parseFloat(dish.price) : null
        }))
      };

      let savedMenu;
      if (isEditing) {
        savedMenu = await menuService.updateMenu(menu.id, menuData);
      } else {
        savedMenu = await menuService.createMenu(menuData);
      }

      onSave(savedMenu);
    } catch (err) {
      console.error('Errore salvataggio menu:', err);
      setError(err.message || 'Errore nel salvataggio del menu.');
    } finally {
      setLoading(false);
    }
  };

  const groupedDishes = menuService.groupDishesByCategory(formData.dishes);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Informazioni Base Menu */}
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Informazioni Menu</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Menu *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                    isInvalid={!!validationErrors.name}
                    placeholder="Es. Menu Primaverile, Menu del 15 Gennaio..."
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo Menu *</Form.Label>
                  <Form.Select
                    value={formData.menuType}
                    onChange={(e) => handleMenuTypeChange(e.target.value)}
                    isInvalid={!!validationErrors.menuType}
                    disabled={isEditing} // Non permettere cambio tipo in modifica
                  >
                    <option value="">Seleziona tipo...</option>
                    {Object.entries(menuTypes).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.menuType}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                {formData.menuType === 'DAILY' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Data Menu</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.menuDate || ''}
                      onChange={(e) => handleBasicInfoChange('menuDate', e.target.value)}
                    />
                    <Form.Text className="text-muted">
                      Se non specificata, verrà usata la data odierna
                    </Form.Text>
                  </Form.Group>
                )}
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Descrizione</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.description}
                    onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                    placeholder="Descrizione opzionale del menu..."
                  />
                </Form.Group>
              </Col>
            </Row>

            {formData.menuType === 'DAILY' && (
              <Alert variant="info" className="mb-0">
                <FaClock className="me-2" />
                <strong>Menu del Giorno:</strong> Deve contenere esattamente 3 primi, 3 secondi e 3 contorni.
              </Alert>
            )}

            {formData.menuType === 'SEASONAL' && (
              <Alert variant="success" className="mb-0">
                <FaLeaf className="me-2" />
                <strong>Menu Stagionale:</strong> Puoi aggiungere quanti piatti vuoi per ogni categoria.
              </Alert>
            )}
          </Card.Body>
        </Card>

        {/* Sezioni Piatti */}
        {Object.entries(categoryNames).map(([category, categoryLabel]) => {
          const dishesInCategory = groupedDishes[category] || [];
          const isDailyMenu = formData.menuType === 'DAILY';
          const isRequiredCategory = isDailyMenu && ['PRIMI', 'SECONDI', 'CONTORNI'].includes(category);
          const maxDishes = isDailyMenu && isRequiredCategory ? 3 : null;

          // Per menu del giorno, mostra solo categorie richieste
          if (isDailyMenu && !isRequiredCategory) {
            return null;
          }

          return (
            <Card key={category} className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  {categoryLabel}
                  {isRequiredCategory && (
                    <Badge bg="primary" className="ms-2">
                      {dishesInCategory.length}/3 richiesti
                    </Badge>
                  )}
                  {!isRequiredCategory && dishesInCategory.length > 0 && (
                    <Badge bg="secondary" className="ms-2">
                      {dishesInCategory.length} piatti
                    </Badge>
                  )}
                </h6>
                
                {(!maxDishes || dishesInCategory.length < maxDishes) && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => addDish(category)}
                  >
                    <FaPlus className="me-1" />
                    Aggiungi Piatto
                  </Button>
                )}
              </Card.Header>

              <Card.Body>
                {dishesInCategory.length === 0 ? (
                  <div className="text-center py-3 text-muted">
                    <p>Nessun piatto in questa categoria</p>
                    <Button
                      variant="outline-primary"
                      onClick={() => addDish(category)}
                    >
                      <FaPlus className="me-2" />
                      Aggiungi Primo Piatto
                    </Button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {dishesInCategory.map((dish, categoryIndex) => {
                      const globalIndex = formData.dishes.findIndex(d => d === dish);
                      return (
                        <motion.div
                          key={globalIndex}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <DishFormCard
                            dish={dish}
                            index={globalIndex}
                            onDishChange={handleDishChange}
                            onRemove={() => removeDish(globalIndex)}
                            validationErrors={validationErrors}
                            canRemove={!isRequiredCategory || dishesInCategory.length > (maxDishes || 0)}
                          />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </Card.Body>
            </Card>
          );
        })}

        {validationErrors.dishes && (
          <Alert variant="danger" className="mb-4">
            {validationErrors.dishes}
          </Alert>
        )}

        {/* Pulsanti Azione */}
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            <FaTimes className="me-2" />
            Annulla
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Salvataggio...
              </>
            ) : (
              <>
                <FaSave className="me-2" />
                {isEditing ? 'Aggiorna Menu' : 'Crea Menu'}
              </>
            )}
          </Button>
        </div>
      </Form>
    </motion.div>
  );
};

// ===================================================================
// COMPONENTE SINGOLA CARTA PIATTO NEL FORM
// ===================================================================
const DishFormCard = ({ dish, index, onDishChange, onRemove, validationErrors, canRemove }) => {
  return (
    <Card className="mb-3 border-light">
      <Card.Body>
        <Row className="align-items-start">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Nome Piatto *</Form.Label>
              <Form.Control
                type="text"
                value={dish.name}
                onChange={(e) => onDishChange(index, 'name', e.target.value)}
                isInvalid={!!validationErrors[`dish_${index}_name`]}
                placeholder="Nome del piatto..."
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors[`dish_${index}_name`]}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Prezzo (€)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={dish.price}
                onChange={(e) => onDishChange(index, 'price', e.target.value)}
                isInvalid={!!validationErrors[`dish_${index}_price`]}
                placeholder="0.00"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors[`dish_${index}_price`]}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Ingredienti</Form.Label>
              <Form.Control
                type="text"
                value={dish.ingredients}
                onChange={(e) => onDishChange(index, 'ingredients', e.target.value)}
                placeholder="Ingredienti principali..."
              />
            </Form.Group>
          </Col>
          
          <Col md={1} className="text-end">
            {canRemove && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={onRemove}
                className="mt-4"
              >
                <FaTrash />
              </Button>
            )}
          </Col>
        </Row>
        
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={dish.description}
                onChange={(e) => onDishChange(index, 'description', e.target.value)}
                placeholder="Descrizione del piatto..."
              />
            </Form.Group>
          </Col>
          
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Disponibilità</Form.Label>
              <Form.Check
                type="switch"
                id={`available-${index}`}
                label={dish.isAvailable ? "Disponibile" : "Non disponibile"}
                checked={dish.isAvailable}
                onChange={(e) => onDishChange(index, 'isAvailable', e.target.checked)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default MenuForm;