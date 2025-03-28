// src/pages/AdminPage.jsx
import React from 'react';
import AdminPanel from '../components/AdminPanel';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
    const { user } = useAuth();

    if (user?.role !== 'ADMIN') {
        return (
            <div className="container my-5">
                <p>Accesso negato. Solo gli admin possono accedere a questa pagina.</p>
            </div>
        );
    }

    return (
        <div className='page-container'>
            <AdminPanel />
        </div>
    );
};

export default AdminPage;