import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendarAlt, FaSwimmingPool, FaWheelchair, FaWifi, FaParking, FaGamepad, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Configurazione comune per animazioni
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.5,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Componente per sezione con solo testo
const TextSection = ({ alignment, title, text, additionalText, actionText, actionLink, sectionRef, inView }) => {
  const isLeft = alignment === 'left';
  
  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="position-relative flex-grow-1"
      style={{
        backgroundColor: "#989985",
        borderTopLeftRadius: isLeft ? '0' : '150px',
        borderBottomLeftRadius: isLeft ? '0' : '150px',
        borderTopRightRadius: isLeft ? '150px' : '0',
        borderBottomRightRadius: isLeft ? '150px' : '0',
        boxShadow: isLeft ? '10px 15px 15px rgba(0, 0, 0, 0.1)' : '-10px 15px 15px rgba(0, 0, 0, 0.1)',
        width: '65%',
        overflow: 'hidden',
        marginBottom: '80px',
        marginLeft: isLeft ? '0' : 'auto',
        minHeight: '350px'
      }}
      aria-label={title}
    >
      <div className="container-fluid p-0 m-0">
        <motion.div 
          variants={contentVariants}
          className="section-content"
          style={{ 
            padding: '50px 70px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <motion.h2 
            variants={itemVariants}
            className="fs-1 pb-3" 
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: 500,
               color: "#5D4037" }}
          >
            {title}
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="fs-5" 
            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400, color: "#050505" }}
          >
            {text}
          </motion.p>
          {additionalText && (
            <motion.p 
              variants={itemVariants}
              className="fs-5 mt-3" 
              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400, color: "#050505" }}
            >
              {additionalText}
            </motion.p>
          )}
          {actionText && (
            <motion.div
              variants={itemVariants}
              className={`mt-4 ${isLeft ? 'text-end' : 'text-start'}`}
            >
              <Link 
                to={actionLink} 
                className="d-inline-flex align-items-center"
                style={{ 
                  color: "#5D4037", 
                  textDecoration: "none", 
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#8D6E63";
                  e.currentTarget.querySelector('.arrow-icon').style.transform = "translateX(5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#5D4037";
                  e.currentTarget.querySelector('.arrow-icon').style.transform = "translateX(0)";
                }}
              >
                {actionText}
                <span 
                  className="arrow-icon ms-2"
                  style={{ transition: "transform 0.3s ease" }}
                >
                  <FaArrowRight />
                </span>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

// Componente principale
const Home = () => {
  // Refs per le sezioni
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ref4, inView4] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [refServices, inViewServices] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Servizi
  const services = [
    { icon: <FaCalendarAlt size={60} />, name: "Eventi" },
    { icon: <FaSwimmingPool size={60} />, name: "Piscina" },
    { icon: <FaWheelchair size={60} />, name: "Accesso ai disabili" },
    { icon: <FaWifi size={60} />, name: "WiFi Free" },
    { icon: <FaParking size={60} />, name: "Parcheggio gratuito" },
    { icon: <FaGamepad size={60} />, name: "Sala giochi" }
  ];

  return (
    <div className="d-flex flex-column mt-5" style={{ minHeight: "100vh", overflow: "hidden", paddingTop: "100px" }}>
      {/* Prima sezione - Solo testo */}
      <TextSection
        sectionRef={ref1}
        inView={inView1}
        alignment="left"
        title="La Nostra Filosofia"
        text="Nel nostro ristorante, valorizziamo la tradizione attraverso prodotti locali, freschi e selezionati. La pasta, fatta in casa ogni giorno con tecniche tramandate nel tempo, è il cuore della nostra cucina, con primi piatti che celebrano i sapori autentici della Garfagnana."
        additionalText="Crediamo in una cucina semplice ma ricca di emozioni, dove la qualità e la passione si incontrano in ogni piatto per offrirvi un'esperienza gastronomica autentica e indimenticabile. La nostra filosofia è quella di valorizzare i sapori autentici, rispettando la stagionalità e la provenienza delle materie prime."
        actionText="Scopri chi siamo"
        actionLink="/ChiSiamo"
      />
      
      {/* Seconda sezione - Solo testo */}
      <TextSection
        sectionRef={ref2}
        inView={inView2}
        alignment="right"
        title="La Nostra Storia"
        text="Il nome Ai Canipai affonda le radici nella storia agricola di San Romano in Garfagnana. Nei primi anni del 900, questa zona ospitava campi di canapa, essenziale per l'economia locale. Nel 1998, il Comune ha trasformato quest'area in un ristorante che mantiene vivo il legame con le tradizioni."
        additionalText="Oggi celebriamo questo patrimonio culturale attraverso la nostra cucina, custodendo le antiche ricette e il sapore autentico di un tempo. Il ristorante è diventato un punto di riferimento per chi apprezza la cucina genuina e la storia del nostro territorio, un luogo dove il passato e il presente si fondono in un'esperienza gastronomica unica."
        actionText="Esplora la nostra storia"
        actionLink="/laNostraStoria"
      />
      
      {/* Terza sezione - Solo testo */}
      <TextSection
        sectionRef={ref3}
        inView={inView3}
        alignment="left"
        title="La Nostra Cucina"
        text="La nostra proposta gastronomica è un viaggio nei sapori autentici della Garfagnana, con piatti che raccontano la storia e le tradizioni del territorio. Dai tordelli fatti a mano alla tagliata di manzo locale, ogni portata è un omaggio alla cucina toscana di montagna."
        additionalText="Utilizziamo solo ingredienti stagionali e di prima qualità, selezionati tra i migliori produttori locali. Il nostro menu cambia con le stagioni, seguendo il ritmo naturale della terra e offrendo sempre il meglio che la Garfagnana può dare. I nostri chef combinano sapientemente tradizione e innovazione, creando piatti che sorprendono e soddisfano anche i palati più esigenti."
        actionText="Prenota un tavolo"
        actionLink="/ReservationPage"
      />
      
      {/* Quarta sezione - Solo testo */}
      <TextSection
        sectionRef={ref4}
        inView={inView4}
        alignment="right"
        title="Vieni a Trovarci"
        text="Il ristorante Ai Canipai vi aspetta in un'atmosfera calda e accogliente, dove potrete immergervi nei sapori autentici della tradizione toscana. Situato nel cuore di San Romano in Garfagnana, il nostro locale offre un ambiente raffinato e familiare, ideale per cene romantiche, pranzi di lavoro o riunioni con amici e parenti."
        additionalText="Siamo aperti dal martedì alla domenica, a pranzo dalle 12:00 alle 14:30 e a cena dalle 19:00 alle 22:30. Il nostro staff sarà lieto di accogliervi e di farvi vivere un'esperienza gastronomica indimenticabile, all'insegna della tradizione e del buon gusto. Offriamo anche un servizio di catering per eventi speciali e la possibilità di prenotare l'intero locale per cerimonie e occasioni private."
        actionText="Contattaci"
        actionLink="/Contatti"
      /> 

      {/* Sezione Servizi */}
      <motion.section 
        ref={refServices}
        initial={{ opacity: 0 }}
        animate={inViewServices ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="py-5 w-100" 
        style={{ 
          background: "linear-gradient(135deg, #989985 0%, #E6DFD0 100%)"
        }}
        aria-label="I Nostri Servizi"
      >
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={inViewServices ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-5" 
            style={{ color: "#5D4037" }}
          >
            I Nostri Servizi
          </motion.h1>
          
          <div className="row justify-content-center">
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                className="col-6 col-md-4 col-lg-2 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={inViewServices ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.1 + (index * 0.1)
                }}
              >
                <div 
                  className="text-center p-3 h-100 d-flex flex-column justify-content-center align-items-center" 
                  style={{ 
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <motion.div 
                    className="mb-3"
                    style={{ color: "#8D6E63" }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {service.icon}
                  </motion.div>
                  <p className="mb-0 fs-5" style={{ color: "#5D4037", fontWeight: "500" }}>
                    {service.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;