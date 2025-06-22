// src/components/Admin/UserManagement.jsx
// FILE COMPLETO - SOSTITUISCI COMPLETAMENTE

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
  Alert,
  Spinner,
  Pagination
} from 'react-bootstrap';
import { 
  FaUsers, 
  FaSearch, 
  FaEye, 
  FaEdit,
  FaUserPlus,
  FaChartBar,
  FaDownload,
  FaSyncAlt,
  FaTrash
} from 'react-icons/fa';

// Import servizi e componenti
import adminUserService from '../../services/adminUserService';
import UserDetailModal from './UserDetailModal';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import StatsModal from './StatsModal';
import UserFilters from './UserFilters';

const UserManagement = () => {
  console.log('🎯 UserManagement component inizializzato');

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
  const [showStatsModal, setShowStatsModal] = useState(false);

  // ===================================================================
  // FUNZIONI DI CARICAMENTO DATI
  // ===================================================================
  
  const loadUsers = useCallback(async () => {
    console.log('🔄 loadUsers iniziato...');
    
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
      
      console.log('📝 Parametri chiamata:', params);
      
      const response = await adminUserService.getAllUsers(params);
      console.log('📦 Response completa:', response);
      
      // Gestione response backend
      let userData;
      if (response && response.data) {
        userData = response.data;
        console.log('✅ Dati estratti da response.data:', userData);
      } else if (response && response.content) {
        userData = response;
        console.log('✅ Dati estratti da response diretta:', userData);
      } else {
        console.warn('⚠️ Struttura response non riconosciuta:', response);
        userData = { content: [], totalElements: 0, totalPages: 0 };
      }
      
      setUsers(userData.content || []);
      setTotalPages(userData.totalPages || 0);
      setTotalElements(userData.totalElements || 0);
      
      console.log('✅ Stato aggiornato:', {
        users: userData.content?.length || 0,
        totalElements: userData.totalElements || 0,
        totalPages: userData.totalPages || 0
      });
      
    } catch (err) {
      console.error('❌ Errore in loadUsers:', err);
      setError(err.message || 'Errore nel caricamento degli utenti');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, roleFilter, statusFilter, emailVerifiedFilter, sortBy, sortDir]);

  const loadStats = useCallback(async () => {
    try {
      const statsData = await adminUserService.getUserStats();
      setStats(statsData || {});
    } catch (err) {
      console.error('❌ Errore caricamento statistiche:', err);
    }
  }, []);

  // ===================================================================
  // EFFECTS
  // ===================================================================
  
  useEffect(() => {
    console.log('🎬 useEffect triggerato, calling loadUsers...');
    loadUsers();
    loadStats();
  }, [loadUsers, loadStats]);

  // ===================================================================
  // HANDLERS AZIONI
  // ===================================================================
  
  const handleRefresh = () => {
    console.log('🔄 Refresh manuale...');
    loadUsers();
    loadStats();
  };

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
  // HELPER FUNCTIONS
  // ===================================================================
  
  const getRoleBadge = (role) => {
    return (
      <Badge bg={role === 'ADMIN' ? 'danger' : 'primary'}>
        {role === 'ADMIN' ? 'Amministratore' : 'Utente'}
      </Badge>
    );
  };

  const getStatusBadge = (enabled) => {
    return (
      <Badge bg={enabled ? 'success' : 'secondary'}>
        {enabled ? 'Attivo' : 'Disabilitato'}
      </Badge>
    );
  };

  const getEmailVerifiedBadge = (verified) => {
    return (
      <Badge bg={verified ? 'success' : 'warning'}>
        {verified ? 'Verificata' : 'Non verificata'}
      </Badge>
    );
  };

  // ===================================================================
  // RENDER PRINCIPALE
  // ===================================================================
  
  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">
                  <FaUsers className="me-2" />
                  Gestione Utenti
                </h4>
                <small>Amministrazione utenti del sistema ({totalElements} totali)</small>
              </div>
              <div>
                <Button 
                  variant="light" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={loading}
                  className="me-2"
                >
                  <FaSyncAlt className={loading ? 'fa-spin' : ''} />
                  {loading ? ' Caricamento...' : ' Aggiorna'}
                </Button>
                <Button 
                  variant="success" 
                  size="sm" 
                  onClick={() => {
                    console.log('➕ Apertura modal creazione utente');
                    setShowCreateModal(true);
                  }}
                >
                  <FaUserPlus className="me-1" />
                  Nuovo Utente
                </Button>
              </div>
            </Card.Header>

            <Card.Body>
              {/* Alert di errore */}
              {error && (
                <Alert variant="danger" className="mb-3" dismissible onClose={() => setError('')}>
                  <strong>Errore:</strong> {error}
                </Alert>
              )}

              {/* Alert di successo */}
              {success && (
                <Alert variant="success" className="mb-3" dismissible onClose={() => setSuccess('')}>
                  <strong>Successo:</strong> {success}
                </Alert>
              )}

              {/* Filtri avanzati */}
              <UserFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                emailVerifiedFilter={emailVerifiedFilter}
                setEmailVerifiedFilter={setEmailVerifiedFilter}
                onRefresh={handleRefresh}
                loading={loading}
              />

              {/* Bottoni azione */}
              <Row className="mb-3">
                <Col md={6}>
                  <Button 
                    variant="outline-info" 
                    onClick={() => {
                      console.log('📊 Apertura statistiche');
                      setShowStatsModal(true);
                    }}
                    disabled={loading}
                  >
                    <FaChartBar className="me-1" />
                    Statistiche
                  </Button>
                </Col>
                <Col md={6} className="text-end">
                  <Button 
                    variant="outline-success" 
                    onClick={() => alert('Export - coming soon')}
                    disabled={loading}
                  >
                    <FaDownload className="me-1" />
                    Export CSV
                  </Button>
                </Col>
              </Row>

              {/* Tabella utenti */}
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Caricamento...</span>
                  </Spinner>
                  <p className="mt-3 text-muted">Caricamento utenti...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-5">
                  <FaUsers size={60} className="text-muted mb-3" />
                  <h5 className="text-muted">Nessun utente trovato</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Prova a modificare i filtri di ricerca' : 'Non ci sono utenti nel sistema'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('id')}
                          >
                            ID {sortBy === 'id' && (sortDir === 'asc' ? '↑' : '↓')}
                          </th>
                          <th 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('nome')}
                          >
                            Nome Completo {sortBy === 'nome' && (sortDir === 'asc' ? '↑' : '↓')}
                          </th>
                          <th 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('email')}
                          >
                            Email {sortBy === 'email' && (sortDir === 'asc' ? '↑' : '↓')}
                          </th>
                          <th>Ruolo</th>
                          <th>Stato</th>
                          <th>Email Verificata</th>
                          <th 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleSort('createdAt')}
                          >
                            Registrazione {sortBy === 'createdAt' && (sortDir === 'asc' ? '↑' : '↓')}
                          </th>
                          <th>Azioni</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <Badge bg="secondary">#{user.id}</Badge>
                            </td>
                            <td>
                              <div>
                                <strong>{user.nome} {user.cognome}</strong>
                              </div>
                            </td>
                            <td>
                              <small className="text-muted">{user.email}</small>
                            </td>
                            <td>
                              {getRoleBadge(user.ruolo)}
                            </td>
                            <td>
                              {getStatusBadge(user.enabled)}
                            </td>
                            <td>
                              {getEmailVerifiedBadge(user.emailVerified)}
                            </td>
                            <td>
                              <small className="text-muted">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('it-IT') : 'N/A'}
                              </small>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm" role="group">
                                <Button 
                                  variant="outline-info" 
                                  size="sm"
                                  onClick={() => {
                                    console.log('👁️ Apertura dettagli per utente:', user);
                                    setSelectedUser(user);
                                    setShowDetailModal(true);
                                  }}
                                  title="Visualizza dettagli"
                                  disabled={actionLoading}
                                >
                                  <FaEye />
                                </Button>
                                <Button 
                                  variant="outline-warning" 
                                  size="sm"
                                  onClick={() => {
                                    console.log('✏️ Apertura modifica per utente:', user);
                                    setSelectedUser(user);
                                    setShowEditModal(true);
                                  }}
                                  title="Modifica utente"
                                  disabled={actionLoading}
                                >
                                  <FaEdit />
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => {
                                    console.log('🗑️ Apertura eliminazione per utente:', user);
                                    setSelectedUser(user);
                                    setShowDeleteModal(true);
                                  }}
                                  title="Elimina utente"
                                  disabled={actionLoading || user.ruolo === 'ADMIN'}
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {/* Paginazione */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                      <Pagination>
                        <Pagination.First 
                          onClick={() => handlePageChange(0)}
                          disabled={currentPage === 0}
                        />
                        <Pagination.Prev 
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                        />
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
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
                  )}
                </>
              )}

              {/* Footer con info paginazione */}
              {totalElements > 0 && (
                <Card.Footer className="bg-light">
                  <Row className="align-items-center">
                    <Col>
                      <small className="text-muted">
                        Mostrando <strong>{users.length}</strong> di <strong>{totalElements}</strong> utenti totali
                      </small>
                    </Col>
                    <Col className="text-end">
                      <small className="text-muted">
                        Pagina <strong>{currentPage + 1}</strong> di <strong>{totalPages}</strong>
                      </small>
                    </Col>
                  </Row>
                </Card.Footer>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ===================================================================== */}
      {/* MODALI */}
      {/* ===================================================================== */}

      {/* Modal Dettagli Utente */}
      <UserDetailModal 
        show={showDetailModal} 
        onHide={() => {
          console.log('❌ Chiusura UserDetailModal');
          setShowDetailModal(false);
          setSelectedUser(null);
        }} 
        user={selectedUser} 
      />

      {/* Modal Creazione Utente */}
      <CreateUserModal
        show={showCreateModal}
        onHide={() => {
          console.log('❌ Chiusura CreateUserModal');
          setShowCreateModal(false);
        }}
        onUserCreated={(newUser) => {
          console.log('✅ Nuovo utente creato:', newUser);
          loadUsers(); // Ricarica la lista
          loadStats(); // Ricarica statistiche
          setSuccess('Utente creato con successo');
          setTimeout(() => setSuccess(''), 3000);
        }}
      />

      {/* Modal Modifica Utente */}
      <EditUserModal
        show={showEditModal}
        onHide={() => {
          console.log('❌ Chiusura EditUserModal');
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUserUpdated={(updatedUser) => {
          console.log('✅ Utente aggiornato:', updatedUser);
          loadUsers(); // Ricarica la lista
          setSuccess('Utente aggiornato con successo');
          setTimeout(() => setSuccess(''), 3000);
        }}
      />

      {/* Modal Statistiche */}
      <StatsModal
        show={showStatsModal}
        onHide={() => {
          console.log('❌ Chiusura StatsModal');
          setShowStatsModal(false);
        }}
        stats={stats}
      />

      {/* Modal Eliminazione (semplice per ora) */}
      {selectedUser && (
        <div 
          className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`} 
          style={{ backgroundColor: showDeleteModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Conferma Eliminazione</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Sei sicuro di voler eliminare l'utente <strong>{selectedUser.nome} {selectedUser.cognome}</strong>?</p>
                <p className="text-danger">
                  <small>Questa azione non può essere annullata.</small>
                </p>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Annulla
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => {
                    alert('Eliminazione non implementata ancora');
                    setShowDeleteModal(false);
                  }}
                >
                  Elimina
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default UserManagement;