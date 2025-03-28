import { motion } from 'framer-motion';

const Header = () => {
    return (
        <motion.header 
            className="d-flex align-items-center justify-content-center" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ 
                backgroundColor: '#F0EBDE',
                height: '100px',
            }}
        >
            <motion.div 
                className="text-center d-flex align-items-center"
            >
                <motion.img 
                    src="/src/assets/foto/logo_canepai.png"
                    alt="Logo Ai Canipai" 
                    className="me-4"
                    style={{ width: '80px', height: 'auto' }}
                    whileHover={{ scale: 1.05 }} // Effetto hover sul logo
                    transition={{ type: "spring", stiffness: 300 }}
                />
                <h1 
                    style={{ 
                        fontFamily: 'Cormorant Garamond, serif' , 
                        fontWeight: 400, 
                        fontSize: '48px', 
                        color: '#5D5D48', 
                    }}
                >
                    Ai Canipai
                </h1>
            </motion.div>
        </motion.header>
    );
};



export default Header;