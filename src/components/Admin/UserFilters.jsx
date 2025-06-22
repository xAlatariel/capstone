// src/components/Admin/UserFilters.jsx
import React from 'react';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaFilter, FaSyncAlt } from 'react-icons/fa';

const UserFilters = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  emailVerifiedFilter,
  setEmailVerifiedFilter,
  onRefresh,
  loading
}) => {
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleEmailVerifiedFilterChange = (e) => {
    const value = e.target.value;
    if (value === 'all') {
      setEmailVerifiedFilter(null);
    } else {
      setEmailVerifiedFilter(value === 'true');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    setEmailVerifiedFilter(null);
  };

  return (
    <div className="mb-4">
      <Row>
        <Col md={4}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Cerca per nome, cognome o email..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
        
        <Col md={2}>
          <Form.Select 
            value={roleFilter} 
            onChange={handleRoleFilterChange}
            className="mb-3"
          >
            <option value="all">Tutti i ruoli</option>
            <option value="USER">Utenti</option>
            <option value="ADMIN">Amministratori</option>
          </Form.Select>
        </Col>
        
        <Col md={2}>
          <Form.Select 
            value={statusFilter} 
            onChange={handleStatusFilterChange}
            className="mb-3"
          >
            <option value="all">Tutti gli stati</option>
            <option value="enabled">Attivi</option>
            <option value="disabled">Disabilitati</option>
          </Form.Select>
        </Col>
        
        <Col md={2}>
          <Form.Select 
            value={emailVerifiedFilter === null ? 'all' : emailVerifiedFilter ? 'true' : 'false'} 
            onChange={handleEmailVerifiedFilterChange}
            className="mb-3"
          >
            <option value="all">Tutte le verifiche</option>
            <option value="true">Email verificate</option>
            <option value="false">Email non verificate</option>
          </Form.Select>
        </Col>
        
        <Col md={2}>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              onClick={resetFilters}
              className="mb-3"
              size="sm"
            >
              <FaFilter /> Reset
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={onRefresh}
              disabled={loading}
              className="mb-3"
              size="sm"
            >
              <FaSyncAlt className={loading ? 'fa-spin' : ''} />
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UserFilters;