import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Card, 
  Table, 
  Button, 
  Form, 
  Row, 
  Col, 
  Badge, 
  Modal, 
  Alert,
  Spinner,
  InputGroup,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Pagination
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaTrash, 
  FaEdit,
  FaUserPlus,
  FaEnvelope,
  FaCalendarAlt,
  FaUserShield,
  FaUserCheck,
  FaUserTimes,
  FaDownload,
  FaSyncAlt,
  FaKey,
  FaChartBar,
  FaExclamationTriangle,
  FaCog
} from 'react-icons/fa';
import adminUserService from '../../services/adminUserService';
import UserDetailModal from './UserDetailModal';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import StatsModal from './StatsModal';
import UserFilters from './UserFilters';

const UserManagement = () => {
  // ===================================================================
  // STATI PRINCIPALI
  // ===================================================================
  
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Stati per filtri e paginazione
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Stati per modali
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // ===================================================================
  // EFFECTS
  // ===================================================================
  
  useEffect(() => {
    loadUsers();
    loadStats();
  }, [currentPage, pageSize, searchTerm, roleFilter, statusFilter, emailVerifiedFilter, sortBy, sortDir]);

  const loadUsers = useCallback(async () => {
  try {
    setLoading(true);
    setError('');
    
    const params = {
      page: currentPage,
      size: pageSize,
      sortBy,
      sortDir,
      search: searchTerm,
      role: roleFilter,
      status: statusFilter,
      emailVerified: emailVerifiedFilter
    };
    
    console.log('🔍 UserManagement - Parametri per loadUsers:', params);
    
    const response = await adminUserService.getAllUsers(params);
    console.log('📊 UserManagement - Risposta getAllUsers:', response);
    
    // VERIFICA STRUTTURA DATI
    console.log('📋 UserManagement - response.content:', response.content);
    console.log('📏 UserManagement - response.totalElements:', response.totalElements);
    console.log('📄 UserManagement - response.totalPages:', response.totalPages);
    
    setUsers(response.content || []);
    setTotalPages(response.totalPages || 0);
    setTotalElements(response.totalElements || 0);
    
  } catch (err) {
    console.error('❌ UserManagement - Errore in loadUsers:', err);
    setError(err.message || 'Errore nel caricamento degli utenti');
  } finally {
    setLoading(false);
  }
}, [currentPage, pageSize, searchTerm, roleFilter, statusFilter, emailVerifiedFilter, sortBy, sortDir]);

  // ===================================================================
  // HANDLERS PER AZIONI UTENTI
  // ===================================================================

  const handleUserStatusChange = async (userId, enabled) => {
    try {
      setActionLoading(true);
      await adminUserService.updateUserStatus(userId, enabled);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, enabled } : u
      ));
      setSuccess(`Utente ${enabled ? 'abilitato' : 'disabilitato'} con successo`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Errore nell\'aggiornamento dello stato utente');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUserRoleChange = async (userId, role) => {
    try {
      setActionLoading(true);
      await adminUserService.updateUserRole(userId, role);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role } : u
      ));
      setSuccess('Ruolo utente aggiornato con successo');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Errore nell\'aggiornamento del ruolo utente');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      await adminUserService.deleteUser(selectedUser.id);
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
      setSuccess('Utente eliminato con successo');
      setTimeout(() => setSuccess(''), 3000);
      loadStats();
    } catch (err) {
      setError(err.message || 'Errore nell\'eliminazione dell\'utente');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      const response = await adminUserService.resetUserPassword(selectedUser.id);
      setShowPasswordResetModal(false);
      setSelectedUser(null);
      setSuccess(`Password resettata. Nuova password: ${response.temporaryPassword}`);
      setTimeout(() => setSuccess(''), 10000);
    } catch (err) {
      setError(err.message || 'Errore nel reset della password');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResendVerification = async (userId) => {
    try {
      setActionLoading(true);
      await adminUserService.resendVerificationEmail(userId);
      setSuccess('Email di verifica inviata con successo');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Errore nell\'invio dell\'email di verifica');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyEmail = async (userId) => {
    try {
      setActionLoading(true);
      await adminUserService.verifyUserEmail(userId);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, emailVerified: true } : u
      ));
      setSuccess('Email verificata con successo');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Errore nella verifica email');
    } finally {
      setActionLoading(false);
    }
  };
  const handleEmailVerifiedFilterChange = (emailVerified) => {
  setEmailVerifiedFilter(emailVerified);
  setCurrentPage(0);
};

const handleClearFilters = () => {
  setSearchTerm('');
  setRoleFilter('all');
  setStatusFilter('all');
  setEmailVerifiedFilter(null);
  setCurrentPage(0);
};

const handlePageSizeChange = (size) => {
  setPageSize(size);
  setCurrentPage(0);
};

  // ===================================================================
  // HANDLERS PER FILTRI E PAGINAZIONE
  // ===================================================================

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleRoleFilterChange = (role) => {
    setRoleFilter(role);
    setCurrentPage(0);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(0);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ===================================================================
  // HANDLERS PER EXPORT
  // ===================================================================

  const handleExportUsers = async () => {
    try {
      const exportData = await adminUserService.exportUsers({
        search: searchTerm,
        role: roleFilter,
        status: statusFilter
      });
      
      const headers = ['ID', 'Nome', 'Cognome', 'Email', 'Ruolo', 'Stato', 'Verificato', 'Registrazione', 'Ultimo Accesso', 'Prenotazioni'];
      const csvContent = [
        headers.join(','),
        ...exportData.map(user => [
          user.id,
          user.name,
          user.surname,
          user.email,
          user.role,
          user.status,
          user.emailVerified,
          user.registrationDate,
          user.lastLoginDate,
          user.totalReservations
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `utenti_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess('Export completato con successo');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Errore nell\'export');
    }
  };

  // ===================================================================
  // UTILITY FUNCTIONS
  // ===================================================================

  const getRoleBadge = (role) => {
    return (
      <Badge bg={role === 'ADMIN' ? 'danger' : 'primary'}>
        {role === 'ADMIN' ? (
          <>
            <FaUserShield className="me-1" size={10} />
            Admin
          </>
        ) : (
          <>
            <FaUsers className="me-1" size={10} />
            Utente
          </>
        )}
      </Badge>
    );
  };

  const getStatusBadge = (user) => {
    if (!user.enabled) {
      return <Badge bg="danger"><FaUserTimes className="me-1" size={10} />Disabilitato</Badge>;
    }
    if (!user.emailVerified) {
      return <Badge bg="warning"><FaEnvelope className="me-1" size={10} />Non Verificato</Badge>;
    }
    return <Badge bg="success"><FaUserCheck className="me-1" size={10} />Attivo</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Mai';
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ===================================================================
  // RENDER
  // ===================================================================

  return (
    <Container fluid className="py-4">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              <FaExclamationTriangle className="me-2" />
              {error}
            </Alert>
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert variant="success" dismissible onClose={() => setSuccess('')}>
              <FaUserCheck className="me-2" />
              {success}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header con statistiche */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-success mb-0">
                <FaUsers className="me-2" />
                Gestione Utenti
              </h2>
              <p className="text-muted">Amministrazione completa degli utenti del sistema</p>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                onClick={() => setShowStatsModal(true)}
              >
                <FaChartBar className="me-2" />
                Statistiche
              </Button>
              <Button
                variant="outline-success"
                onClick={handleExportUsers}
              >
                <FaDownload className="me-2" />
                Esporta
              </Button>
              <Button
                variant="success"
                onClick={() => setShowCreateModal(true)}
              >
                <FaUserPlus className="me-2" />
                Nuovo Utente
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistiche rapide */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-primary">{stats.totalUsers || 0}</h3>
              <small className="text-muted">Totale Utenti</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-success">{stats.activeUsers || 0}</h3>
              <small className="text-muted">Utenti Attivi</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-warning">{stats.unverifiedUsers || 0}</h3>
              <small className="text-muted">Non Verificati</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-info">{stats.weekRegistrations || 0}</h3>
              <small className="text-muted">Nuovi Questa Settimana</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtri e ricerca */}
<UserFilters
  searchTerm={searchTerm}
  roleFilter={roleFilter}
  statusFilter={statusFilter}
  emailVerifiedFilter={emailVerifiedFilter}
  pageSize={pageSize}
  loading={loading}
  totalElements={totalElements}
  onSearchChange={handleSearch}
  onRoleFilterChange={handleRoleFilterChange}
  onStatusFilterChange={handleStatusFilterChange}
  onEmailVerifiedFilterChange={handleEmailVerifiedFilterChange}
  onPageSizeChange={handlePageSizeChange}
  onRefresh={loadUsers}
  onExport={handleExportUsers}
  onClearFilters={handleClearFilters}
/>


      {/* Tabella utenti */}
      <Card className="shadow-sm">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaUsers className="me-2" />
              Lista Utenti ({totalElements})
            </h5>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <div className="mt-2">Caricamento utenti...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-5">
              <FaUsers size={50} className="text-muted mb-3" />
              <p className="text-muted">Nessun utente trovato</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th 
                    className="cursor-pointer user-select-none"
                    onClick={() => handleSort('id')}
                  >
                    ID {sortBy === 'id' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="cursor-pointer user-select-none"
                    onClick={() => handleSort('name')}
                  >
                    Nome {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="cursor-pointer user-select-none"
                    onClick={() => handleSort('email')}
                  >
                    Email {sortBy === 'email' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Ruolo</th>
                  <th>Stato</th>
                  <th 
                    className="cursor-pointer user-select-none"
                    onClick={() => handleSort('createdAt')}
                  >
                    Registrazione {sortBy === 'createdAt' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Ultimo Accesso</th>
                  <th>Prenotazioni</th>
                  <th className="text-center">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>#{user.id}</td>
                    <td>
                      <div>
                        <strong>{user.name} {user.surname}</strong>
                      </div>
                    </td>
                    <td>
                      <div>{user.email}</div>
                      {!user.emailVerified && (
                        <small className="text-warning">
                          <FaEnvelope className="me-1" />
                          Non verificata
                        </small>
                      )}
                    </td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{getStatusBadge(user)}</td>
                    <td>
                      <small>{formatDate(user.createdAt)}</small>
                    </td>
                    <td>
                      <small>{formatDate(user.lastLogin)}</small>
                    </td>
                    <td>
                      <Badge bg="info">{user.reservationsCount}</Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-1 justify-content-center">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Visualizza dettagli</Tooltip>}
                        >
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDetailModal(true);
                            }}
                          >
                            <FaEye />
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Modifica utente</Tooltip>}
                        >
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                          >
                            <FaEdit />
                          </Button>
                        </OverlayTrigger>

                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-success"
                            size="sm"
                            id={`dropdown-${user.id}`}
                          >
                            <FaCog />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Header>Stato Utente</Dropdown.Header>
                            <Dropdown.Item
                              onClick={() => handleUserStatusChange(user.id, !user.enabled)}
                              disabled={actionLoading}
                            >
                              <FaUserCheck className="me-2" />
                              {user.enabled ? 'Disabilita' : 'Abilita'}
                            </Dropdown.Item>
                            
                            <Dropdown.Divider />
                            <Dropdown.Header>Ruolo</Dropdown.Header>
                            {user.role === 'USER' ? (
                              <Dropdown.Item
                                onClick={() => handleUserRoleChange(user.id, 'ADMIN')}
                                disabled={actionLoading}
                              >
                                <FaUserShield className="me-2" />
                                Promuovi ad Admin
                              </Dropdown.Item>
                            ) : (
                              <Dropdown.Item
                                onClick={() => handleUserRoleChange(user.id, 'USER')}
                                disabled={actionLoading}
                              >
                                <FaUsers className="me-2" />
                                Rimuovi Admin
                              </Dropdown.Item>
                            )}
                            
                            <Dropdown.Divider />
                            <Dropdown.Header>Email</Dropdown.Header>
                            {!user.emailVerified && (
                              <>
                                <Dropdown.Item
                                  onClick={() => handleVerifyEmail(user.id)}
                                  disabled={actionLoading}
                                >
                                  <FaUserCheck className="me-2" />
                                  Verifica Email
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => handleResendVerification(user.id)}
                                  disabled={actionLoading}
                                >
                                  <FaEnvelope className="me-2" />
                                  Reinvia Verifica
                                </Dropdown.Item>
                              </>
                            )}
                            
                            <Dropdown.Divider />
                            <Dropdown.Header>Sicurezza</Dropdown.Header>
                            <Dropdown.Item
                              onClick={() => {
                                setSelectedUser(user);
                                setShowPasswordResetModal(true);
                              }}
                              disabled={actionLoading}
                            >
                              <FaKey className="me-2" />
                              Reset Password
                            </Dropdown.Item>
                            
                            <Dropdown.Divider />
                            <Dropdown.Item
                              className="text-danger"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteModal(true);
                              }}
                              disabled={actionLoading}
                            >
                              <FaTrash className="me-2" />
                              Elimina Utente
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
        
        {/* Paginazione */}
        {totalPages > 1 && (
          <Card.Footer>
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Mostrando {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} di {totalElements} utenti
              </small>
              <Pagination size="sm" className="mb-0">
                <Pagination.First 
                  onClick={() => handlePageChange(0)}
                  disabled={currentPage === 0}
                />
                <Pagination.Prev 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                />
                
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNum = currentPage < 3 ? index : 
                                 currentPage > totalPages - 3 ? totalPages - 5 + index :
                                 currentPage - 2 + index;
                  
                  if (pageNum < 0 || pageNum >= totalPages) return null;
                  
                  return (
                    <Pagination.Item
                      key={pageNum}
                      active={pageNum === currentPage}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum + 1}
                    </Pagination.Item>
                  );
                })}
                
                <Pagination.Next 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                />
                <Pagination.Last 
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={currentPage === totalPages - 1}
                />
              </Pagination>
            </div>
          </Card.Footer>
        )}
      </Card>

      {/* MODALI */}
      
      {/* Modal Dettagli Utente */}
      <UserDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        user={selectedUser}
      />

      {/* Modal Creazione Utente */}
      <CreateUserModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onUserCreated={(newUser) => {
          setUsers([newUser, ...users]);
          loadStats();
          setSuccess('Utente creato con successo');
          setTimeout(() => setSuccess(''), 3000);
        }}
      />

      {/* Modal Modifica Utente */}
      <EditUserModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        user={selectedUser}
        onUserUpdated={(updatedUser) => {
          setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
          setSuccess('Utente aggiornato con successo');
          setTimeout(() => setSuccess(''), 3000);
        }}
      />

      {/* Modal Conferma Eliminazione */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <FaExclamationTriangle className="me-2" />
            Conferma Eliminazione
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p>Sei sicuro di voler eliminare l'utente:</p>
              <div className="bg-light p-3 rounded">
                <strong>{selectedUser.name} {selectedUser.surname}</strong>
                <br />
                <small className="text-muted">{selectedUser.email}</small>
              </div>
              <Alert variant="warning" className="mt-3">
                <FaExclamationTriangle className="me-2" />
                <strong>Attenzione:</strong> Questa azione non può essere annullata. 
                L'utente verrà disabilitato e i suoi dati rimarranno nel sistema per scopi di audit.
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annulla
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteUser}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Eliminazione...
              </>
            ) : (
              <>
                <FaTrash className="me-2" />
                Elimina Utente
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Reset Password */}
      <Modal show={showPasswordResetModal} onHide={() => setShowPasswordResetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-warning">
            <FaKey className="me-2" />
            Reset Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p>Stai per resettare la password per:</p>
              <div className="bg-light p-3 rounded">
                <strong>{selectedUser.name} {selectedUser.surname}</strong>
                <br />
                <small className="text-muted">{selectedUser.email}</small>
              </div>
              <Alert variant="info" className="mt-3">
                <FaKey className="me-2" />
                Verrà generata una password temporanea che sarà inviata via email all'utente.
                L'utente dovrà cambiarla al primo accesso.
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordResetModal(false)}>
            Annulla
          </Button>
          <Button 
            variant="warning" 
            onClick={handlePasswordReset}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Reset in corso...
              </>
            ) : (
              <>
                <FaKey className="me-2" />
                Reset Password
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Statistiche */}
      <StatsModal
        show={showStatsModal}
        onHide={() => setShowStatsModal(false)}
        stats={stats}
      />
    </Container>
  );
};

export default UserManagement;// src/components/Admin/UserManagement.jsx
