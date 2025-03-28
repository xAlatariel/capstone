import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UserReservationsList from '../components/user/UserReservationsList.jsx';
import { fetchUserReservations } from '../services/userReservationService';

const UserReservationsPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await fetchUserReservations();
      
      const sortedReservations = [...data].sort((a, b) => {
        const dateA = new Date(a.reservationDate + 'T' + a.reservationTime);
        const dateB = new Date(b.reservationDate + 'T' + b.reservationTime);
        
        return dateA - dateB;
      });
      
      setReservations(sortedReservations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadReservations();
  }, []);

  const handleReservationUpdate = (id = null, updatedReservation = null) => {
    if (id) {
      setReservations(reservations.filter(res => res.id !== id));
    } else if (updatedReservation) {
      setReservations(prevReservations => {
        const updated = prevReservations.map(res => 
          res.id === updatedReservation.id ? updatedReservation : res
        );
        
        return [...updated].sort((a, b) => {
          const dateA = new Date(a.reservationDate + 'T' + a.reservationTime);
          const dateB = new Date(b.reservationDate + 'T' + b.reservationTime);
          return dateA - dateB;
        });
      });
    } else {
      loadReservations();
    }
  };
  
   //debug
  if (loading) {
    return (
      <div className="container my-5">
        <h1 className="text-center mb-4">Le Mie Prenotazioni</h1>
        <div className="row">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="col-md-4 mb-4">
              <div className="card skeleton-card">
                <div className="card-header skeleton-bg"></div>
                <div className="card-body">
                  <div className="skeleton-line" style={{ width: '70%' }}></div>
                  <div className="skeleton-line" style={{ width: '40%' }}></div>
                  <div className="skeleton-line" style={{ width: '60%' }}></div>
                  <div className="skeleton-line" style={{ width: '80%' }}></div>
                  <div className="d-flex justify-content-between mt-4">
                    <div className="skeleton-line" style={{ width: '25%', height: '30px' }}></div>
                    <div className="skeleton-line" style={{ width: '25%', height: '30px' }}></div>
                    <div className="skeleton-line" style={{ width: '25%', height: '30px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Le Mie Prenotazioni</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {reservations.length === 0 ? (
        <div className="alert alert-info text-center">
          <p>Non hai ancora prenotazioni.</p>
          <a href="/ReservationPage" className="btn btn-primary mt-2">
            Prenota un tavolo
          </a>
        </div>
      ) : (
        <UserReservationsList 
          reservations={reservations} 
          onReservationDeleted={handleReservationUpdate}
        />
      )}
    </div>
  );
};

export default UserReservationsPage;