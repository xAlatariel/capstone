import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <App />
</AuthProvider>
)
