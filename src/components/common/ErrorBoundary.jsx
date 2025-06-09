import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaRefresh } from 'react-icons/fa';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // In produzione, qui potresti inviare l'errore a un servizio di logging
    if (process.env.NODE_ENV === 'production') {
      // Esempio: Sentry.captureException(error);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: '#F0EBDE' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <FaExclamationTriangle 
                size={80} 
                className="mx-auto text-red-500 mb-4"
              />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Oops! Qualcosa è andato storto
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Si è verificato un errore inaspettato. Il nostro team è stato notificato 
              e stiamo lavorando per risolvere il problema.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left"
              >
                <h3 className="font-semibold text-red-800 mb-2">
                  Dettagli errore (solo in development):
                </h3>
                <pre className="text-sm text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleRetry}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaRefresh className="mr-2" />
                Riprova
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaHome className="mr-2" />
                  Torna alla Home
                </Link>
              </motion.div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">
                Hai bisogno di aiuto?
              </h3>
              <p className="text-blue-700">
                Se il problema persiste, contattaci al{' '}
                <a 
                  href="tel:05831799307" 
                  className="font-semibold hover:underline"
                >
                  0583 179 9307
                </a>
                {' '}o via email{' '}
                <a 
                  href="mailto:info@aicanipai.it" 
                  className="font-semibold hover:underline"
                >
                  info@aicanipai.it
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;