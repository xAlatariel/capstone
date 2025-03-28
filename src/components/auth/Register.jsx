import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          cognome: formData.cognome,
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Errore durante la registrazione.');
      }

      const data = await response.json();
      console.log('Registrazione avvenuta con successo:', data);
      
      if (onRegistrationSuccess) {
        onRegistrationSuccess(formData.email);
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Errore durante la registrazione:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08 
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

  const passwordMatch = formData.password && formData.confirmPassword && 
                        formData.password === formData.confirmPassword;
  const passwordMismatch = formData.password && formData.confirmPassword && 
                          formData.password !== formData.confirmPassword;

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
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <motion.div className="mb-3" variants={itemVariants}>
          <label className="form-label">Nome:</label>
          <motion.input
            type="text"
            name="nome"
            className="form-control" 
            value={formData.nome}
            onChange={handleChange}
            required
            disabled={isLoading}
            whileFocus={{ boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" }}
          />
        </motion.div>
        <motion.div className="mb-3" variants={itemVariants}>
          <label className="form-label">Cognome:</label>
          <motion.input
            type="text"
            name="cognome"
            className="form-control"
            value={formData.cognome}
            onChange={handleChange}
            required
            disabled={isLoading}
            whileFocus={{ boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" }}
          />
        </motion.div>
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
            whileFocus={{ boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" }}
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
          />
        </motion.div>
        <motion.div className="mb-3" variants={itemVariants}>
          <label className="form-label">Conferma Password:</label>
          <motion.input
            type="password"
            name="confirmPassword"
            className="form-control"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
            whileFocus={{ boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" }}
            style={passwordMismatch ? { borderColor: "red" } : 
                  passwordMatch ? { borderColor: "green" } : {}}
          />
          {passwordMismatch && (
            <motion.div 
              className="form-text text-danger"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Le password non coincidono
            </motion.div>
          )}
          {passwordMatch && (
            <motion.div 
              className="form-text text-success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Password corrispondenti
            </motion.div>
          )}
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
              Registrazione in corso...
            </>
          ) : 'Registrati'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Register;