// src/components/Navbar.jsx
import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Modal,
  Tab,
  Tabs,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { motion, AnimatePresence } from "framer-motion";
import Menu from '../pages/Menu';


const NavbarComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
  };

  const handleRegistrationSuccess = (email) => {
    setRegistrationEmail(email);
    setActiveTab("login");
  };

  const handleReservationClick = () => {
    if (token) {
      navigate("/ReservationPage");
    } else {
      setActiveTab("login");
      handleShowModal();
      setError("Accedi per prenotare");
    }
  };

  const isActive = (path) => location.pathname === path;

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const activeStyle = {
    borderBottom: "2px solid #5D5D48",
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-light bg-opacity-75 rounded-4 border border-dark p-0 pe-3"
        style={{ height: "70px" }}
      >
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              {/* Link Home */}
              <div className="mx-2 position-relative">
                <motion.div
                  whileHover={{ y: -2 }}
                  style={isActive("/") ? activeStyle : {}}
                >
                  <Nav.Link as={Link} to="/">
                    Home
                  </Nav.Link>
                </motion.div>
              </div>

              <div className="mx-2 position-relative">
                <motion.div
                  whileHover={{ y: -2 }}
                  style={isActive("/ChiSiamo") ? activeStyle : {}}
                >
                  <Nav.Link as={Link} to="/ChiSiamo">
                    Chi Siamo
                  </Nav.Link>
                </motion.div>
              </div>

              <div className="mx-2 position-relative">
                <motion.div
                  whileHover={{ y: -2 }}
                  style={isActive("/laNostraStoria") ? activeStyle : {}}
                >
                  <Nav.Link as={Link} to="/laNostraStoria">
                    La Nostra Storia
                  </Nav.Link>
                </motion.div>
              </div>
             <div className="mx-2 position-relative">
  <motion.div
    whileHover={{ y: -2 }}
    style={isActive("/menu") ? activeStyle : {}}
  >
    <Nav.Link as={Link} to="/menu">
      Menu
    </Nav.Link>
  </motion.div>
</div>

              <div className="mx-2 position-relative">
                <motion.div
                  whileHover={{ y: -2 }}
                  style={isActive("/Contatti") ? activeStyle : {}}
                >
                  <Nav.Link as={Link} to="/Contatti">
                    Contatti
                  </Nav.Link>
                </motion.div>
              </div>

              <div className="mx-2 position-relative">
                <motion.div
                  whileHover={{ y: -2 }}
                  style={isActive("/ReservationPage") ? activeStyle : {}}
                >
                  <Nav.Link onClick={handleReservationClick}>
                    Prenota un tavolo
                  </Nav.Link>
                </motion.div>
              </div>
            </Nav>
            <Nav>
              {token ? (
                <>
                  {user?.role === "ADMIN" && (
  <>
    {/* Admin Panel */}
    <div className="me-2 position-relative">
      <motion.div
        whileHover={{ y: -2 }}
        style={isActive("/admin") ? activeStyle : {}}
      >
        <Nav.Link as={Link} to="/admin">
          Admin Panel
        </Nav.Link>
      </motion.div>
    </div>

    {/* Gestione Menu */}
    <div className="me-2 position-relative">
      <motion.div
        whileHover={{ y: -2 }}
        style={isActive("/admin/menu") ? activeStyle : {}}
      >
        <Nav.Link as={Link} to="/admin/menu">
          🍽️ Gestione Menu
        </Nav.Link>
      </motion.div>
    </div>
  </>
)}

                  {user?.role === "USER" && (
                    <div className="me-2 position-relative">
                      <motion.div
                        whileHover={{ y: -2 }}
                        style={
                          isActive("/user/reservations") ? activeStyle : {}
                        }
                      >
                        <Nav.Link as={Link} to="/user/reservations">
                          Le Mie Prenotazioni
                        </Nav.Link>
                      </motion.div>
                    </div>
                  )}

                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        logout();
                        window.location.reload();
                      }}
                    >
                      Logout
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <Button variant="outline-primary" onClick={handleShowModal}>
                    Login / Registrati
                  </Button>
                </motion.div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AnimatePresence>
        {showModal && (
          <Modal show={showModal} onHide={handleCloseModal}>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <Modal.Header closeButton>
                <Modal.Title>Accedi o Registrati</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(key) => setActiveTab(key)}
                  className="mb-3"
                  transition={false}
                >
                  <Tab eventKey="login" title="Login">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="login"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Login
                          closeModal={handleCloseModal}
                          prefillEmail={registrationEmail}
                          error={activeTab === "login" ? error : ""}
                        />
                        <div className="mt-3 text-center d-flex align-items-center justify-content-center">
                          Non hai un account?{" "}
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Button
                              variant="link"
                              onClick={() => setActiveTab("register")}
                            >
                              Registrati qui
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </Tab>
                  <Tab eventKey="register" title="Registrati">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="register"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Register
                          onRegistrationSuccess={handleRegistrationSuccess}
                        />
                        <div className="mt-3 text-center d-flex align-items-center justify-content-center">
                          Hai già un account?{" "}
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Button
                              variant="link"
                              onClick={() => setActiveTab("login")}
                            >
                              Accedi qui
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </Tab>
                </Tabs>
              </Modal.Body>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarComponent;
