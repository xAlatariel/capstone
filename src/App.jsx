// SOSTITUZIONE COMPLETA per src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/ToastProvider';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ChiSiamo from './pages/ChiSiamo';
import Contatti from './pages/Contatti';  
import Header from './components/Header';
import ReservationPage from './pages/ReservationPage';
import AdminPage from './pages/AdminPage';
import UserReservationsPage from './pages/UserReservationPage';
import LaNostraStoria from './pages/LaNostraStoria';
import Menu from './pages/Menu'; // NUOVO IMPORT
import PrivacyPolicy from './pages/PrivacyPolicy'; // NUOVO IMPORT
import CookiePolicy from './pages/CookiePolicy'; // NUOVO IMPORT
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import Footer from './components/Footer'; // NUOVO IMPORT

function App() {
  return (
    <div style={{ 
      backgroundColor: '#F0EBDE',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <Header />
              <div 
                className="d-flex justify-content-center align-items-center"
                style={{
                  backgroundImage: 'url(/src/assets/foto/fotoristorante3.jpeg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '500px'
                }}
              >
                <Navbar />
              </div>
              
              {/* Contenuto principale */}
              <div style={{ flex: 1, minHeight: 'calc(100vh - 600px)' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* NUOVA ROTTA: Verifica Email */}
                  <Route path="/verify-email" element={<EmailVerificationPage />} />
                  
                  <Route path='/chiSiamo' element={<ChiSiamo />} />
                  <Route path='/contatti' element={<Contatti />} />
                  <Route path='/laNostraStoria' element={<LaNostraStoria />} />
                  <Route path="/menu" element={<Menu />} /> {/* NUOVA ROTTA MENU */}
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* PRIVACY POLICY */}
                  <Route path="/cookie-policy" element={<CookiePolicy />} /> {/* COOKIE POLICY */}
                  <Route path="/ReservationPage" element={<ReservationPage />} />
                  
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  /> 
                  <Route
                    path="/user/reservations"
                    element={
                      <ProtectedRoute>
                        <UserReservationsPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Fallback per pagine non trovate */}
               <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
              
              {/* NUOVO FOOTER */}
              <Footer />
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;