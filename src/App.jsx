import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ChiSiamo from './pages/ChiSiamo';
import Contatti from './pages/Contatti';  
import Header from './components/Header';
import ReservationPage from './pages/ReservationPage';
import AdminPage from './pages/AdminPage';
import UserReservationsPage from './pages/UserReservationPage';
import LaNostraStoria from './pages/LaNostraStoria'; 

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
          
          {/* Contenuto principale  */}
          <div style={{ flex: 1, minHeight: 'calc(100vh - 600px)' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path='/chiSiamo' element={<ChiSiamo />} />
              <Route path='/contatti' element={<Contatti />} />
              <Route path='/laNostraStoria' element={<LaNostraStoria />} /> {/* Nuova rotta */}
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
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;