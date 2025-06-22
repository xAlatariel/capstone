// src/components/Admin/UserFilters.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Row, 
  Col, 
  InputGroup, 
  Button, 
  Dropdown,
  Badge,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
  Collapse
} from 'react-bootstrap';
import { 
  FaSearch, 
  FaSyncAlt, 
  FaCog, 
  FaFilter,
  FaUsers,
  FaUserShield,
  FaUserCheck,
  FaUserTimes,
  FaEnvelope,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaEye
} from 'react-icons/fa';

const UserFilters = ({
  searchTerm,
  roleFilter,
  statusFilter,
  emailVerifiedFilter,
  pageSize,
  loading,
  totalElements,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onEmailVerifiedFilterChange,
  onPageSizeChange,
  onRefresh,
  onExport,
  onClearFilters
}) => {

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchDebounce, setSearchDebounce] = useState(searchTerm);

  // Debounce per la ricerca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchDebounce !== searchTerm) {
        onSearchChange({ target: { value: searchDebounce } });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchDebounce]);

  // Sync search term from parent
  useEffect(() => {
    setSearchDebounce(searchTerm);
  }, [searchTerm]);

  const handleSearchInputChange = (e) => {
    setSearchDebounce(e.target.value);
  };

  const clearSearch = () => {
    setSearchDebounce('');
    onSearchChange({ target: { value: '' } });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm && searchTerm.trim()) count++;
    if (roleFilter !== 'all') count++;
    if (statusFilter !== 'all') count++;
    if (emailVerifiedFilter !== null) count++;
    return count;
  };

  const clearAllFilters = () => {
    setSearchDebounce('');
    onClearFilters?.();
  };

  const getRoleButtonVariant = (role) => {
    return roleFilter === role ? 'primary' : 'outline-primary';
  };

  const getStatusButtonVariant = (status) => {
    return statusFilter === status ? 'success' : 'outline-success';
  };

  const getEmailButtonVariant = (emailStatus) => {
    if (emailVerifiedFilter === null && emailStatus === 'all') return 'warning';
    if (emailVerifiedFilter === true && emailStatus === 'verified') return 'warning';
    if (emailVerifiedFilter === false && emailStatus === 'unverified') return 'warning';
    return 'outline-warning';
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="shadow-sm mb-4 border-0">
      <Card.Header className="bg-light border-0">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h6 className="mb-0 me-3">
              <FaFilter className="me-2 text-primary" />
              Filtri e Ricerca
            </h6>
            {activeFiltersCount > 0 && (
              <Badge bg="primary" pill>
                {activeFiltersCount} filtri attivi
              </Badge>
            )}
          </div>
          <div className="d-flex gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={clearAllFilters}
              >
                <FaTimes className="me-1" />
                Cancella Filtri
              </Button>
            )}
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? <FaChevronUp /> : <FaChevronDown />}
              {showAdvancedFilters ? ' Nascondi' : ' Avanzati'}
            </Button>
          </div>
        </div>
      </Card.Header>
      
      <Card.Body>
        {/* FILTRI BASE */}
        <Row className="align-items-end mb-3">
          <Col md={6} lg={4}>
            <Form.Group>
              <Form.Label className="fw-bold">
                <FaSearch className="me-2 text-muted" />
                Ricerca Globale
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Cerca per nome, cognome o email..."
                  value={searchDebounce}
                  onChange={handleSearchInputChange}
                />
                {searchDebounce && (
                  <Button
                    variant="outline-secondary"
                    onClick={clearSearch}
                  >
                    <FaTimes />
                  </Button>
                )}
              </InputGroup>
              {searchTerm && (
                <Form.Text className="text-muted">
                  <FaEye className="me-1" />
                  Risultati trovati: {totalElements}
                </Form.Text>
              )}
            </Form.Group>
          </Col>

          <Col md={6} lg={4}>
            <Form.Group>
              <Form.Label className="fw-bold">
                <FaUsers className="me-2 text-muted" />
                Filtro Ruolo
              </Form.Label>
              <ButtonGroup className="w-100">
                <Button
                  variant={getRoleButtonVariant('all')}
                  onClick={() => onRoleFilterChange('all')}
                  className="flex-fill"
                >
                  <FaUsers className="me-1" />
                  Tutti
                </Button>
                <Button
                  variant={getRoleButtonVariant('USER')}
                  onClick={() => onRoleFilterChange('USER')}
                  className="flex-fill"
                >
                  <FaUsers className="me-1" />
                  Utenti
                </Button>
                <Button
                  variant={getRoleButtonVariant('ADMIN')}
                  onClick={() => onRoleFilterChange('ADMIN')}
                  className="flex-fill"
                >
                  <FaUserShield className="me-1" />
                  Admin
                </Button>
              </ButtonGroup>
            </Form.Group>
          </Col>

          <Col md={6} lg={2}>
            <div className="d-flex gap-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Aggiorna lista utenti</Tooltip>}
              >
                <Button
                  variant="outline-primary"
                  onClick={onRefresh}
                  disabled={loading}
                  className="flex-fill"
                >
                  <FaSyncAlt className={loading ? 'fa-spin' : ''} />
                </Button>
              </OverlayTrigger>

              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Esporta risultati</Tooltip>}
              >
                <Button
                  variant="outline-success"
                  onClick={onExport}
                  disabled={loading}
                  className="flex-fill"
                >
                  <FaDownload />
                </Button>
              </OverlayTrigger>
            </div>
          </Col>

          <Col md={6} lg={2}>
            <Form.Group>
              <Form.Label className="fw-bold">
                <FaCog className="me-2 text-muted" />
                Elementi
              </Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="w-100">
                  <FaEye className="me-2" />
                  {pageSize} per pagina
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  <Dropdown.Header>Elementi per pagina</Dropdown.Header>
                  <Dropdown.Item 
                    onClick={() => onPageSizeChange(5)}
                    active={pageSize === 5}
                  >
                    5 elementi
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => onPageSizeChange(10)}
                    active={pageSize === 10}
                  >
                    10 elementi
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => onPageSizeChange(25)}
                    active={pageSize === 25}
                  >
                    25 elementi
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => onPageSizeChange(50)}
                    active={pageSize === 50}
                  >
                    50 elementi
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => onPageSizeChange(100)}
                    active={pageSize === 100}
                  >
                    100 elementi
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>
        </Row>

        {/* FILTRI AVANZATI */}
        <Collapse in={showAdvancedFilters}>
          <div>
            <hr className="my-3" />
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <FaUserCheck className="me-2 text-muted" />
                    Stato Account
                  </Form.Label>
                  <ButtonGroup className="w-100">
                    <Button
                      variant={getStatusButtonVariant('all')}
                      onClick={() => onStatusFilterChange('all')}
                      className="flex-fill"
                    >
                      <FaUsers className="me-1" />
                      Tutti
                    </Button>
                    <Button
                      variant={getStatusButtonVariant('active')}
                      onClick={() => onStatusFilterChange('active')}
                      className="flex-fill"
                    >
                      <FaUserCheck className="me-1" />
                      Attivi
                    </Button>
                    <Button
                      variant={getStatusButtonVariant('inactive')}
                      onClick={() => onStatusFilterChange('inactive')}
                      className="flex-fill"
                    >
                      <FaUserTimes className="me-1" />
                      Disabilitati
                    </Button>
                  </ButtonGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <FaEnvelope className="me-2 text-muted" />
                    Verifica Email
                  </Form.Label>
                  <ButtonGroup className="w-100">
                    <Button
                      variant={getEmailButtonVariant('all')}
                      onClick={() => onEmailVerifiedFilterChange(null)}
                      className="flex-fill"
                    >
                      <FaEnvelope className="me-1" />
                      Tutte
                    </Button>
                    <Button
                      variant={getEmailButtonVariant('verified')}
                      onClick={() => onEmailVerifiedFilterChange(true)}
                      className="flex-fill"
                    >
                      <FaUserCheck className="me-1" />
                      Verificate
                    </Button>
                    <Button
                      variant={getEmailButtonVariant('unverified')}
                      onClick={() => onEmailVerifiedFilterChange(false)}
                      className="flex-fill"
                    >
                      <FaUserTimes className="me-1" />
                      Non Verificate
                    </Button>
                  </ButtonGroup>
                </Form.Group>
              </Col>
            </Row>

            {/* RIASSUNTO FILTRI ATTIVI */}
            {activeFiltersCount > 0 && (
              <div className="bg-light p-3 rounded mb-3">
                <h6 className="mb-2">
                  <FaFilter className="me-2 text-primary" />
                  Filtri Attivi ({activeFiltersCount})
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {searchTerm && searchTerm.trim() && (
                    <Badge bg="info" className="d-flex align-items-center">
                      <FaSearch className="me-1" />
                      Ricerca: "{searchTerm}"
                      <Button
                        variant="link"
                        size="sm"
                        className="text-white p-0 ms-2"
                        onClick={clearSearch}
                      >
                        <FaTimes size={10} />
                      </Button>
                    </Badge>
                  )}
                  {roleFilter !== 'all' && (
                    <Badge bg="primary" className="d-flex align-items-center">
                      {roleFilter === 'ADMIN' ? <FaUserShield className="me-1" /> : <FaUsers className="me-1" />}
                      Ruolo: {roleFilter === 'ADMIN' ? 'Amministratori' : 'Utenti'}
                      <Button
                        variant="link"
                        size="sm"
                        className="text-white p-0 ms-2"
                        onClick={() => onRoleFilterChange('all')}
                      >
                        <FaTimes size={10} />
                      </Button>
                    </Badge>
                  )}
                  {statusFilter !== 'all' && (
                    <Badge bg="success" className="d-flex align-items-center">
                      {statusFilter === 'active' ? <FaUserCheck className="me-1" /> : <FaUserTimes className="me-1" />}
                      Stato: {statusFilter === 'active' ? 'Attivi' : 'Disabilitati'}
                      <Button
                        variant="link"
                        size="sm"
                        className="text-white p-0 ms-2"
                        onClick={() => onStatusFilterChange('all')}
                      >
                        <FaTimes size={10} />
                      </Button>
                    </Badge>
                  )}
                  {emailVerifiedFilter !== null && (
                    <Badge bg="warning" className="d-flex align-items-center">
                      <FaEnvelope className="me-1" />
                      Email: {emailVerifiedFilter ? 'Verificate' : 'Non Verificate'}
                      <Button
                        variant="link"
                        size="sm"
                        className="text-white p-0 ms-2"
                        onClick={() => onEmailVerifiedFilterChange(null)}
                      >
                        <FaTimes size={10} />
                      </Button>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </Collapse>
      </Card.Body>

      {/* FOOTER CON STATISTICHE */}
      <Card.Footer className="bg-light border-0">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            <FaEye className="me-1" />
            {loading ? 'Caricamento...' : `${totalElements} risultati trovati`}
          </small>
          <small className="text-muted">
            Mostrando {pageSize} elementi per pagina
          </small>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default UserFilters;