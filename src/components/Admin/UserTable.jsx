// src/components/Admin/UserTable.jsx
import React from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Badge, 
  Spinner, 
  Dropdown, 
  OverlayTrigger, 
  Tooltip, 
  Pagination 
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaUserShield, 
  FaUserCheck, 
  FaUserTimes, 
  FaEnvelope, 
  FaKey, 
  FaCog 
} from 'react-icons/fa';

const UserTable = ({
  users,
  loading,
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  sortBy,
  sortDir,
  actionLoading,
  onSort,
  onPageChange,
  onUserView,
  onUserEdit,
  onUserDelete,
  onUserStatusChange,
  onUserRoleChange,
  onPasswordReset,
  onResendVerification,
  onVerifyEmail
}) => {

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

  return (
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
                  onClick={() => onSort('id')}
                >
                  ID {sortBy === 'id' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="cursor-pointer user-select-none"
                  onClick={() => onSort('name')}
                >
                  Nome {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="cursor-pointer user-select-none"
                  onClick={() => onSort('email')}
                >
                  Email {sortBy === 'email' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th>Ruolo</th>
                <th>Stato</th>
                <th 
                  className="cursor-pointer user-select-none"
                  onClick={() => onSort('createdAt')}
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
                          onClick={() => onUserView(user)}
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
                          onClick={() => onUserEdit(user)}
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
                            onClick={() => onUserStatusChange(user.id, !user.enabled)}
                            disabled={actionLoading}
                          >
                            <FaUserCheck className="me-2" />
                            {user.enabled ? 'Disabilita' : 'Abilita'}
                          </Dropdown.Item>
                          
                          <Dropdown.Divider />
                          <Dropdown.Header>Ruolo</Dropdown.Header>
                          {user.role === 'USER' ? (
                            <Dropdown.Item
                              onClick={() => onUserRoleChange(user.id, 'ADMIN')}
                              disabled={actionLoading}
                            >
                              <FaUserShield className="me-2" />
                              Promuovi ad Admin
                            </Dropdown.Item>
                          ) : (
                            <Dropdown.Item
                              onClick={() => onUserRoleChange(user.id, 'USER')}
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
                                onClick={() => onVerifyEmail(user.id)}
                                disabled={actionLoading}
                              >
                                <FaUserCheck className="me-2" />
                                Verifica Email
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => onResendVerification(user.id)}
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
                            onClick={() => onPasswordReset(user)}
                            disabled={actionLoading}
                          >
                            <FaKey className="me-2" />
                            Reset Password
                          </Dropdown.Item>
                          
                          <Dropdown.Divider />
                          <Dropdown.Item
                            className="text-danger"
                            onClick={() => onUserDelete(user)}
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
                onClick={() => onPageChange(0)}
                disabled={currentPage === 0}
              />
              <Pagination.Prev 
                onClick={() => onPageChange(currentPage - 1)}
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
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum + 1}
                  </Pagination.Item>
                );
              })}
              
              <Pagination.Next 
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              />
              <Pagination.Last 
                onClick={() => onPageChange(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
              />
            </Pagination>
          </div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default UserTable;