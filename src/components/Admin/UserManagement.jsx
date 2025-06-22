import React, { useState, useEffect } from 'react';
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
  Tooltip
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
  FaKey
} from 'react-icons/fa';

// Simulazione service per gestione utenti
const userService = {
  async getAllUsers() {
    // Simulazione API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Mario Rossi',
            email: 'mario.rossi@email.com',
            role: 'USER',
            enabled: true,
            emailVerified: true,
            createdAt: '2024-01-15',
            lastLogin: '2024-06-20',
            reservationsCount: 5
          },
          {
            id: 2,
            name: 'Giulia Bianchi',
            email: 'giulia.bianchi@email.com',
            role: 'USER',
            enabled: true,
            emailVerified: true,
            createdAt: '2024-02-20',
            lastLogin: '2024-06-19',
            reservationsCount: 3
          },
          {
            id: 3,
            name: 'Admin User',
            email: 'admin@aicanipai.it',
            role: 'ADMIN',
            enabled: true,
            emailVerified: true,
            createdAt: '2024-01-01',
            lastLogin: '2024-06-22',
            reservationsCount: 0
          },
          {
            id: 4,
            name: 'Luca Verdi',
            email: 'luca.verdi@email.com',
            role: 'USER',
            enabled: false,
            emailVerified: false,
            createdAt: '2024-03-10',
            lastLogin: null,
            reservationsCount: 0
          }
        ]);
      }, 1000);
    });
  },

  async updateUserStatus(userId, enabled) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  async updateUserRole(userId, role) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  async deleteUser(userId) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  async resendVerificationEmail(userId) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Stati per statistiche
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    unverified: 0,
    admins: 0,
    users: 0
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
    updateStats();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Errore nel caricamento degli utenti');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filtro per termine di ricerca
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro per ruolo
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => 
        user.role?.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    // Filtro per stato
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.enabled);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(user => !user.enabled);
      } else if (statusFilter === 'verified') {
        filtered = filtered.filter(user => user.emailVerified);
      } else if (statusFilter === 'unverified') {
        filtered = filtered.filter(user => !user.emailVerified);
      }
    }

    setFilteredUsers(filtered);
  };

  const updateStats = () => {
    const total = users.length;
    const active = users.filter(u => u.enabled).length;
    const inactive = users.filter(u => !u.enabled).length;
    const verified = users.filter(u => u.emailVerified).length;
    const unverified = users.filter(u => !u.emailVerified).length;
    const admins = users.filter(u => u.role === 'ADMIN').length;
    const usersCount = users.filter(u => u.role === 'USER').length;

    setStats({ total, active, inactive, verified, unverified, admins, users: usersCount });
  };

  const handleUserStatusChange = async (userId, enabled) => {
    try {
      setActionLoading(true);
      await userService.updateUserStatus(userId, enabled);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, enabled } : u
      ));
    } catch (err) {
      setError(err.message || 'Errore nell\'aggiornamento dello stato utente');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUserRoleChange = async (userId, role) => {
    try {
      setActionLoading(true);
      await userService.updateUserRole(userId, role);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role } : u
      ));
    } catch (err) {
      setError(err.message || 'Errore nell\'aggiornamento del ruolo utente');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setActionLoading(true);
      await userService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err.message || 'Errore nell\'eliminazione dell\'utente');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResendVerification = async (userId) => {
    try {
      setActionLoading(true);
      await userService.resendVerificationEmail(userId);
      alert('Email di verifica inviata con successo!');
    } catch (err) {
      setError(err.message || 'Errore nell\'invio dell\'email di verifica');
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    return (
      <Badge bg={role === 'ADMIN' ? 'danger' : 'primary'}>
        {role === 'ADMIN' ? (
          <>
            <FaUserShield className="me-1" size={10} />
            Amministratore
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

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Ruolo', 'Stato', 'Verificato', 'Registrato', 'Ultimo Accesso', 'Prenotazioni'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(u => [
        u.name,
        u.email,
        u.role,
        u.enabled ? 'Attivo' : 'Disabilitato',
        u.emailVerified ? 'Si' : 'No',
        u.createdAt,
        u.lastLogin || 'Mai',
        u.reservationsCount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utenti_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      <Container fluid>
        {/* Header */}
        <motion.div variants={cardVariants}>
          <Card className="shadow-lg border-0 mb-4">
            <Card.Header style={{ background: 'linear-gradient(135deg, #5D4037 0%, #8D6E63 100%)', color: 'white' }}>
              <Row className="align-items-center">
                <Col>
                  <h3 className="mb-0 fw-bold">
                    <FaUsers className="me-2" />
                    Gestione Utenti
                  </h3>
                </Col>
                <Col xs="auto">
                  <div className="d-flex gap-2">
                    <Button 
                      variant="light" 
                      size="sm" 
                      onClick={loadUsers}
                      disabled={loading}
                    >
                      <FaSyncAlt className={loading ? 'fa-spin' : ''} />
                    </Button>
                    <Button 
                      variant="success" 
                      size="sm" 
                      onClick={exportToCSV}
                      disabled={filteredUsers.length === 0}
                    >
                      <FaDownload className="me-1" />
                      Esporta CSV
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => alert('Funzionalità di creazione utente in sviluppo')}
                    >
                      <FaUserPlus className="me-1" />
                      Nuovo Utente
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Header>
          </Card>
        </motion.div>

        {/* Statistiche */}
        <motion.div variants={cardVariants}>
          <Row className="mb-4">
            <Col md={2} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)', color: 'white' }}>
                <Card.Body className="py-3">
                  <FaUsers size={24} className="mb-2" />
                  <h4 className="fw-bold mb-1">{stats.total}</h4>
                  <small>Totale Utenti</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)', color: 'white' }}>
                <Card.Body className="py-3">
                  <FaUserCheck size={24} className="mb-2" />
                  <h4 className="fw-bold mb-1">{stats.active}</h4>
                  <small>Attivi</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)', color: 'white' }}>
                <Card.Body className="py-3">
                  <FaUserTimes size={24} className="mb-2" />
                  <h4 className="fw-bold mb-1">{stats.inactive}</h4>
                  <small>Disabilitati</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)', color: 'white' }}>
                <Card.Body className="py-3">
                  <FaEnvelope size={24} className="mb-2" />
                  <h4 className="fw-bold mb-1">{stats.verified}</h4>
                  <small>Verificati</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)', color: 'white' }}>
                <Card.Body className="py-3">
                  <FaUserShield size={24} className="mb-2" />
                  <h4 className="fw-bold mb-1">{stats.admins}</h4>
                  <small>Amministratori</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={2} className="mb-3">
              <Card className="text-center h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #00BCD4 0%, #26C6DA 100%)', color: 'white' }}>
                <Card.Body className="py-3">
                  <FaUsers size={24} className="mb-2" />
                  <h4 className="fw-bold mb-1">{stats.users}</h4>
                  <small>Utenti Standard</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* Filtri */}
        <motion.div variants={cardVariants}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <Row className="align-items-end">
                <Col md={4} className="mb-2">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Cerca Utente</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Nome o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={2} className="mb-2">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Ruolo</Form.Label>
                    <Form.Select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="all">Tutti</option>
                      <option value="admin">Amministratori</option>
                      <option value="user">Utenti</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2} className="mb-2">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Stato</Form.Label>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Tutti</option>
                      <option value="active">Attivi</option>
                      <option value="inactive">Disabilitati</option>
                      <option value="verified">Verificati</option>
                      <option value="unverified">Non Verificati</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-2">
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => {
                        setSearchTerm('');
                        setRoleFilter('all');
                        setStatusFilter('all');
                      }}
                    >
                      <FaFilter className="me-1" />
                      Reset Filtri
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Tabella Utenti */}
        <motion.div variants={cardVariants}>
          <Card className="shadow-lg border-0">
            <Card.Header style={{ backgroundColor: '#8D6E63', color: 'white' }}>
              <h5 className="mb-0 fw-bold">
                Utenti Registrati ({filteredUsers.length})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {error && (
                <Alert variant="danger" className="m-3">
                  <strong>Errore:</strong> {error}
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="ms-2"
                    onClick={() => setError('')}
                  >
                    ✕
                  </Button>
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="lg" />
                  <p className="mt-3">Caricamento utenti...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-5">
                  <FaUsers size={64} className="text-muted mb-3" />
                  <h5>Nessun utente trovato</h5>
                  <p className="text-muted">
                    {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                      ? 'Prova a modificare i filtri di ricerca' 
                      : 'Non ci sono utenti registrati al momento'
                    }
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead style={{ backgroundColor: '#F5F5F5' }}>
                      <tr>
                        <th>Utente</th>
                        <th>Email</th>
                        <th>Ruolo</th>
                        <th>Stato</th>
                        <th>Registrato</th>
                        <th>Ultimo Accesso</th>
                        <th>Prenotazioni</th>
                        <th>Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredUsers.map((user) => (
                          <motion.tr
                            key={user.id}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            whileHover={{ backgroundColor: '#F8F9FA' }}
                          >
                            <td>
                              <div className="fw-bold">{user.name}</div>
                              <small className="text-muted">ID: {user.id}</small>
                            </td>
                            <td>
                              <div>{user.email}</div>
                              {!user.emailVerified && (
                                <small className="text-warning">⚠️ Non verificata</small>
                              )}
                            </td>
                            <td>
                              <Dropdown>
                                <Dropdown.Toggle 
                                  variant="link" 
                                  className="p-0 border-0"
                                  style={{ textDecoration: 'none' }}
                                  disabled={actionLoading}
                                >
                                  {getRoleBadge(user.role)}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item 
                                    onClick={() => handleUserRoleChange(user.id, 'USER')}
                                    disabled={user.role === 'USER' || actionLoading}
                                  >
                                    <FaUsers className="me-2" />
                                    Utente Standard
                                  </Dropdown.Item>
                                  <Dropdown.Item 
                                    onClick={() => handleUserRoleChange(user.id, 'ADMIN')}
                                    disabled={user.role === 'ADMIN' || actionLoading}
                                  >
                                    <FaUserShield className="me-2" />
                                    Amministratore
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                            <td>
                              <Dropdown>
                                <Dropdown.Toggle 
                                  variant="link" 
                                  className="p-0 border-0"
                                  style={{ textDecoration: 'none' }}
                                  disabled={actionLoading}
                                >
                                  {getStatusBadge(user)}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item 
                                    onClick={() => handleUserStatusChange(user.id, true)}
                                    disabled={user.enabled || actionLoading}
                                  >
                                    <FaUserCheck className="me-2" />
                                    Abilita Utente
                                  </Dropdown.Item>
                                  <Dropdown.Item 
                                    onClick={() => handleUserStatusChange(user.id, false)}
                                    disabled={!user.enabled || actionLoading}
                                  >
                                    <FaUserTimes className="me-2" />
                                    Disabilita Utente
                                  </Dropdown.Item>
                                  {!user.emailVerified && (
                                    <>
                                      <Dropdown.Divider />
                                      <Dropdown.Item 
                                        onClick={() => handleResendVerification(user.id)}
                                        disabled={actionLoading}
                                      >
                                        <FaEnvelope className="me-2" />
                                        Reinvia Verifica Email
                                      </Dropdown.Item>
                                    </>
                                  )}
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                            <td>
                              <div>
                                <FaCalendarAlt className="me-1 text-muted" size={12} />
                                <small>{user.createdAt}</small>
                              </div>
                            </td>
                            <td>
                              {user.lastLogin ? (
                                <small>{user.lastLogin}</small>
                              ) : (
                                <small className="text-muted">Mai</small>
                              )}
                            </td>
                            <td>
                              <Badge bg="secondary" className="px-2 py-1">
                                {user.reservationsCount}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
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
                                    <FaEye size={12} />
                                  </Button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Modifica utente</Tooltip>}
                                >
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowEditModal(true);
                                    }}
                                  >
                                    <FaEdit size={12} />
                                  </Button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip>Elimina utente</Tooltip>}
                                >
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowDeleteModal(true);
                                    }}
                                    disabled={user.role === 'ADMIN'}
                                  >
                                    <FaTrash size={12} />
                                  </Button>
                                </OverlayTrigger>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.div>

        {/* Modal Dettagli Utente */}
        <Modal 
          show={showDetailModal} 
          onHide={() => setShowDetailModal(false)} 
          centered
          size="lg"
        >
          <Modal.Header closeButton style={{ backgroundColor: '#8D6E63', color: 'white' }}>
            <Modal.Title>
              <FaEye className="me-2" />
              Dettagli Utente
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#F9F9F9' }}>
            {selectedUser && (
              <Container>
                <Row className="mb-3">
                  <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Header className="bg-primary text-white">
                        <FaUsers className="me-2" />
                        Informazioni Personali
                      </Card.Header>
                      <Card.Body>
                        <p><strong>Nome:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>ID Utente:</strong> {selectedUser.id}</p>
                        <p><strong>Ruolo:</strong> {getRoleBadge(selectedUser.role)}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Header className="bg-success text-white">
                        <FaCalendarAlt className="me-2" />
                        Stato Account
                      </Card.Header>
                      <Card.Body>
                        <p><strong>Stato:</strong> {getStatusBadge(selectedUser)}</p>
                        <p><strong>Email Verificata:</strong> {selectedUser.emailVerified ? '✅ Sì' : '❌ No'}</p>
                        <p><strong>Account Abilitato:</strong> {selectedUser.enabled ? '✅ Sì' : '❌ No'}</p>
                        <p><strong>Registrato il:</strong> {selectedUser.createdAt}</p>
                        <p><strong>Ultimo Accesso:</strong> {selectedUser.lastLogin || 'Mai'}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-warning text-dark">
                        <FaCalendarAlt className="me-2" />
                        Statistiche Attività
                      </Card.Header>
                      <Card.Body>
                        <p><strong>Numero Prenotazioni:</strong> {selectedUser.reservationsCount}</p>
                        <p className="mb-0"><strong>Stato Generale:</strong> 
                          {selectedUser.enabled && selectedUser.emailVerified ? (
                            <span className="text-success ms-2">Account Attivo e Funzionale</span>
                          ) : (
                            <span className="text-warning ms-2">Account con Limitazioni</span>
                          )}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#F9F9F9' }}>
            <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
              Chiudi
            </Button>
            <Button 
              variant="warning" 
              onClick={() => {
                setShowDetailModal(false);
                setShowEditModal(true);
              }}
            >
              <FaEdit className="me-2" />
              Modifica
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Modifica Utente */}
        <Modal 
          show={showEditModal} 
          onHide={() => setShowEditModal(false)} 
          centered
        >
          <Modal.Header closeButton style={{ backgroundColor: '#FF9800', color: 'white' }}>
            <Modal.Title>
              <FaEdit className="me-2" />
              Modifica Utente
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <div>
                <Alert variant="info">
                  <strong>Funzionalità in Sviluppo</strong><br />
                  Le modifiche avanzate dell'utente saranno disponibili nella prossima versione.
                </Alert>
                <div className="bg-light p-3 rounded">
                  <h6>Azioni Rapide Disponibili:</h6>
                  <div className="d-grid gap-2">
                    <Button 
                      variant={selectedUser.enabled ? 'danger' : 'success'}
                      onClick={() => {
                        handleUserStatusChange(selectedUser.id, !selectedUser.enabled);
                        setShowEditModal(false);
                      }}
                      disabled={actionLoading}
                    >
                      {selectedUser.enabled ? 'Disabilita Account' : 'Abilita Account'}
                    </Button>
                    <Button 
                      variant={selectedUser.role === 'ADMIN' ? 'warning' : 'danger'}
                      onClick={() => {
                        const newRole = selectedUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
                        handleUserRoleChange(selectedUser.id, newRole);
                        setShowEditModal(false);
                      }}
                      disabled={actionLoading}
                    >
                      {selectedUser.role === 'ADMIN' ? 'Rimuovi Privilegi Admin' : 'Rendi Amministratore'}
                    </Button>
                    {!selectedUser.emailVerified && (
                      <Button 
                        variant="info"
                        onClick={() => {
                          handleResendVerification(selectedUser.id);
                          setShowEditModal(false);
                        }}
                        disabled={actionLoading}
                      >
                        <FaEnvelope className="me-2" />
                        Reinvia Email di Verifica
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Annulla
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Conferma Eliminazione */}
        <Modal 
          show={showDeleteModal} 
          onHide={() => setShowDeleteModal(false)} 
          centered
        >
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>
              <FaTrash className="me-2" />
              Conferma Eliminazione Utente
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <div>
                <Alert variant="danger">
                  <strong>⚠️ ATTENZIONE!</strong> Questa azione è irreversibile e comporterà:
                  <ul className="mt-2 mb-0">
                    <li>Eliminazione permanente dell'account utente</li>
                    <li>Perdita di tutte le prenotazioni associate</li>
                    <li>Impossibilità di recuperare i dati</li>
                  </ul>
                </Alert>
                <p>Sei sicuro di voler eliminare definitivamente l'utente:</p>
                <div className="bg-light p-3 rounded">
                  <strong>{selectedUser.name}</strong><br />
                  {selectedUser.email}<br />
                  Ruolo: {selectedUser.role}<br />
                  Prenotazioni: {selectedUser.reservationsCount}
                </div>
                <Form.Group className="mt-3">
                  <Form.Label className="fw-bold">
                    Per confermare, digita "ELIMINA" qui sotto:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digita ELIMINA per confermare"
                    onChange={(e) => {
                      const confirmButton = document.getElementById('confirm-delete-btn');
                      if (confirmButton) {
                        confirmButton.disabled = e.target.value !== 'ELIMINA';
                      }
                    }}
                  />
                </Form.Group>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Annulla
            </Button>
            <Button 
              id="confirm-delete-btn"
              variant="danger" 
              onClick={() => handleDeleteUser(selectedUser?.id)}
              disabled={true}
            >
              <FaTrash className="me-2" />
              {actionLoading ? 'Eliminazione...' : 'Elimina Definitivamente'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </motion.div>
  );
};

export default UserManagement;