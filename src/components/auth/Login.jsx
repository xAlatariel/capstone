import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import apiService from '../../services/apiService';

const Login = ({ closeModal, prefillEmail = '', error: externalError = '' }) => {
  const [formData, setFormData] = useState({ email: prefillEmail, password: '' });
  const [error, setError] = useState(externalError);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (prefillEmail) {
      setFormData(prev => ({ ...prev, email: prefillEmail }));
    }
  }, [prefillEmail]);

  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const isPasswordValid = (password) => {
    return password.length >= 8;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      setError('Inserisci sia email che password');
      return;
    }
    
    if (!isEmailValid(formData.email)) {
      setError('Formato email non valido');
      return;
    }
    
    if (!isPasswordValid(formData.password)) {
      setError('La password deve essere di almeno 8 caratteri');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiService.login({
        email: formData.email.trim(),
        password: formData.password
      });
      
      if (response.status === 'SUCCESS' && response.data?.token) {
        const tokenPayload = JSON.parse(atob(response.data.token.split('.')[1]));
        
        const userData = {
          email: formData.email,
          role: tokenPayload.role || 'USER'
        };
        
        login(response.data.token, userData);
  
        if (closeModal) {
          closeModal();
        }
        
        navigate('/ReservationPage');
      } else {
        throw new Error('Risposta non valida dal server');
      }
    } catch (err) {
      console.error('Errore durante il login:', err);
      setError(err.message || 'Credenziali non valide. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.03, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.97 },
    disabled: { 
      opacity: 0.7,
      scale: 1,
      boxShadow: "none"
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      {error && (
        <motion.div 
          className="alert alert-danger"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {error}
        </motion.div>
      )}
      <form onSubmit={handleSubmit} autoComplete="off">
        <motion.div className="mb-3" variants={itemVariants}>
          <label className="form-label">Email:</label>
          <motion.input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={{ height: '36px' }}
            whileFocus={{ boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" }}
            autoComplete="username"
          />
        </motion.div>
        <motion.div className="mb-3" variants={itemVariants}>
          <label className="form-label">Password:</label>
          <motion.input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            whileFocus={{ boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" }}
            autoComplete="current-password"
          />
        </motion.div>
        <motion.button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={isLoading}
          variants={buttonVariants}
          whileHover={!isLoading ? "hover" : "disabled"}
          whileTap={!isLoading ? "tap" : "disabled"}
          animate={isLoading ? "disabled" : "visible"}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Accesso in corso...
            </>
          ) : 'Accedi'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Login;