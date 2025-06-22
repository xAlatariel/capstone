import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/common/ToastProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Layout Components
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';

// Public Pages
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ChiSiamo from './pages/ChiSiamo';
import Contatti from './pages/Contatti';
import LaNostraStoria from './pages/LaNostraStoria';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import ReservationPage from './pages/ReservationPage';
import NotFoundPage from './pages/NotFoundPage';

// Menu Components
import MenuDisplay from './components/Menu/MenuDisplay';

// User Pages
import UserReservationsPage from './pages/UserReservationPage';

// Admin Pages
import AdminPanel from './components/AdminPanel';
import MenuManagement from './components/Admin/MenuManagement';
import ReservationManagement from './components/Admin/ReservationManagement';
import UserManagement from './components/Admin/UserManagement';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

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
          <Router>
            {/* Header con immagine di sfondo */}
            <Header />
            
            {/* Navbar con sfondo dell'immagine */}
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
                {/* ===== PUBLIC ROUTES ===== */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                
                {/* Info Pages */}
                <Route path="/chiSiamo" element={<ChiSiamo />} />
                <Route path="/contatti" element={<Contatti />} />
                <Route path="/laNostraStoria" element={<LaNostraStoria />} />
                
                {/* Legal Pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                
                {/* Menu Display */}
                <Route path="/menu" element={<MenuDisplay />} />
                
                {/* Reservation Page (Public access) */}
                <Route path="/ReservationPage" element={<ReservationPage />} />
                
                {/* ===== USER PROTECTED ROUTES ===== */}
                <Route path="/reservations" element={
                  <ProtectedRoute>
                    <ReservationPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/my-reservations" element={
                  <ProtectedRoute>
                    <UserReservationsPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/user/reservations" element={
                  <ProtectedRoute>
                    <UserReservationsPage />
                  </ProtectedRoute>
                } />
                
                {/* ===== ADMIN PROTECTED ROUTES ===== */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                
                {/* Admin Menu Management */}
                <Route path="/admin/menus" element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <MenuManagement />
                  </ProtectedRoute>
                } />
                
                {/* Admin Reservation Management */}
                <Route path="/admin/reservations" element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <ReservationManagement />
                  </ProtectedRoute>
                } />
                
                {/* Admin User Management */}
                <Route path="/admin/users" element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <UserManagement />
                  </ProtectedRoute>
                } />
                
                {/* ===== 404 - NOT FOUND ===== */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
            
            {/* Footer */}
            <Footer />
            
            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              style={{ zIndex: 9999 }}
              toastStyle={{
                backgroundColor: '#F0EBDE',
                color: '#5D4037',
                borderLeft: '4px solid #8D6E63'
              }}
            />
          </Router>
        </ToastProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;