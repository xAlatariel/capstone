// ---------------------- INIZIO MODIFICHE SICUREZZA ----------------------
import React from 'react';
import { motion } from 'framer-motion';

// Componente per mostrare messaggi di alert in modo consistente
const Alert = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;
  
  const alertVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  return (
    <motion.div
      className={`alert alert-${type} d-flex align-items-center justify-content-between`}
      role="alert"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={alertVariants}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <div>{message}</div>
      {onClose && (
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose} 
          aria-label="Chiudi"
        />
      )}
    </motion.div>
  );
};

export default Alert;
// ---------------------- FINE MODIFICHE SICUREZZA ----------------------