import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUtensils, FaLeaf, FaHome, FaHandsHelping } from "react-icons/fa";

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const PageHeader = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className="container text-center py-5">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="display-4 mb-3"
        style={{ color: "#5D4037" }}
      >
        Chi Siamo
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="lead mb-5"
        style={{
          color: "#8D6E63",
          maxWidth: "800px",
          margin: "0 auto",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        La passione per la tradizione e l'amore per i sapori autentici guidano
        ogni nostra creazione
      </motion.p>
    </div>
  );
};

// VERSIONE DEFINITIVA CON SFONDI PERMANENTI
const ChiSiamo = () => {
  const [contentVisible, setContentVisible] = useState({
    sebastiano: false,
    andrea: false,
    cucina: false,
    valori: false,
  });

  const [sebastianoRef, inViewSebastiano] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [andreaRef, inViewAndrea] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [cucinaRef, inViewCucina] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [valuesRef, inViewValues] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inViewSebastiano) {
      setContentVisible((prev) => ({ ...prev, sebastiano: true }));
    }
    if (inViewAndrea) {
      setContentVisible((prev) => ({ ...prev, andrea: true }));
    }
    if (inViewCucina) {
      setContentVisible((prev) => ({ ...prev, cucina: true }));
    }
    if (inViewValues) {
      setContentVisible((prev) => ({ ...prev, valori: true }));
    }
  }, [inViewSebastiano, inViewAndrea, inViewCucina, inViewValues]);

  const values = [
    {
      icon: <FaUtensils size={50} />,
      title: "Tradizione e Autenticità",
      description:
        "Manteniamo vive le ricette tradizionali toscane, preparandole con tecniche artigianali e rispettando i sapori originali.",
    },
    {
      icon: <FaLeaf size={50} />,
      title: "Ingredienti Locali",
      description:
        "Scegliamo con cura prodotti freschi e di stagione provenienti da piccoli produttori del nostro territorio.",
    },
    {
      icon: <FaHome size={50} />,
      title: "Fatto in Casa",
      description:
        "Dalla pasta fresca ai dolci, tutto viene preparato quotidianamente nella nostra cucina con ingredienti selezionati.",
    },
    {
      icon: <FaHandsHelping size={50} />,
      title: "Legame col Territorio",
      description:
        "Sosteniamo l'economia locale e valorizziamo le eccellenze gastronomiche della nostra regione.",
    },
  ];

  return (
    <div
      className="d-flex flex-column"
      style={{ minHeight: "100vh", paddingTop: "100px" }}
    >
      <PageHeader />

      {/* Sezione Sebastiano - SOLUZIONE DEFINITIVA */}
      <section
        className="position-relative mb-5"
        style={{ overflow: "hidden" }}
      >
        <div
          className="position-absolute top-0 start-0 h-100 w-50"
          style={{ backgroundColor: "#939480", zIndex: 0 }}
        ></div>

        <div ref={sebastianoRef} className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 py-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={
                  contentVisible.sebastiano ? { opacity: 1 } : { opacity: 0 }
                }
                transition={{ duration: 0.8 }}
                className="text-white p-4"
                style={{ position: "relative", zIndex: 1 }}
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.sebastiano
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="fs-1 mb-2"
                >
                  Sebastiano
                </motion.h2>
                <motion.h4
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.sebastiano
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="fs-5 mb-4"
                  style={{
                    color: "#E6DFD0",
                    fontFamily: "Montserrat, sans-serif",
                    fontStyle: "italic",
                  }}
                >
                  Caposala
                </motion.h4>
              </motion.div>
            </div>
            <div className="col-lg-7 py-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={
                  contentVisible.sebastiano ? { opacity: 1 } : { opacity: 0 }
                }
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white p-4 p-lg-5 rounded-4 shadow-sm"
                style={{ position: "relative", zIndex: 1 }}
              >
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.sebastiano
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="fs-5 mb-4"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    color: "#050505",
                    lineHeight: "1.7",
                  }}
                >
                  Con i suoi 25 anni di esperienza nel mondo della ristorazione,
                  Sebastiano incarna la sintesi perfetta tra tradizione e
                  passione. Dinamico e sportivo, affronta ogni sfida con energia
                  e determinazione, come un atleta che sa che solo con
                  disciplina e impegno si raggiunge il massimo.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.sebastiano
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="fs-5 mb-4"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    color: "#050505",
                    lineHeight: "1.7",
                  }}
                >
                  Il suo legame con il territorio è profondo, un filo invisibile
                  che lo collega alla terra e ai suoi frutti. Amante della
                  cucina tradizionale, Sebastiano sa che ogni piatto racconta
                  una storia, fatta di gesti antichi e di sapori che parlano
                  della sua terra.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.sebastiano
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="fs-5 mb-0"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    color: "#050505",
                    lineHeight: "1.7",
                  }}
                >
                  I prodotti locali sono il cuore del suo lavoro in sala,
                  ingredienti che sceglie di presentare con cura, come un
                  custode delle tradizioni che sa valorizzare la genuinità di
                  ogni prodotto. Ogni sua presentazione è un omaggio alla
                  bellezza di ciò che è autentico, un invito a riscoprire la
                  semplicità e la ricchezza della nostra terra.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sezione Andrea - SOLUZIONE DEFINITIVA */}
      <section
        className="position-relative mb-5"
        style={{ overflow: "hidden" }}
      >
        <div
          className="position-absolute top-0 end-0 h-100 w-50"
          style={{ backgroundColor: "#939480", zIndex: 0 }}
        ></div>

        <div ref={andreaRef} className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 order-lg-1 order-2 py-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={
                  contentVisible.andrea ? { opacity: 1 } : { opacity: 0 }
                }
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white p-4 p-lg-5 rounded-4 shadow-sm"
                style={{ position: "relative", zIndex: 1 }}
              >
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.andrea
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="fs-5 mb-4"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    color: "#050505",
                    lineHeight: "1.7",
                  }}
                >
                  La passione di Andrea per la cucina nasce sui banchi
                  dell'Istituto Alberghiero di Barga, dove ha appreso le basi
                  tecniche e teoriche che avrebbero formato il suo stile unico.
                  Il suo percorso professionale è iniziato immediatamente dopo
                  il diploma presso il rinomato Ristorante Casone, un'esperienza
                  che si è protratta per ben nove anni.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.andrea
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="fs-5 mb-4"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    color: "#050505",
                    lineHeight: "1.7",
                  }}
                >
                  Durante questo periodo formativo, Andrea ha avuto
                  l'opportunità di perfezionarsi in ogni aspetto della
                  ristorazione: dai primi piatti elaborati ai secondi ricchi di
                  sapore, fino ai dolci che chiudono in bellezza ogni pasto. Non
                  solo ha affinato le sue abilità culinarie, ma ha anche
                  acquisito le competenze necessarie per dirigere con maestria
                  una cucina completa.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.andrea
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="fs-5 mb-0"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    color: "#050505",
                    lineHeight: "1.7",
                  }}
                >
                  Dopo aver consolidato la sua esperienza, ha intrapreso nuove
                  avventure professionali, tra cui l'apertura di un locale che
                  ha gestito con successo per cinque anni. Oggi, nel ristorante
                  di San Romano, la sua creatività e precisione tecnica si
                  esprimono in piatti che raccontano la sua crescita personale e
                  professionale.
                </motion.p>
              </motion.div>
            </div>
            <div className="col-lg-5 order-lg-2 order-1 py-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={
                  contentVisible.andrea ? { opacity: 1 } : { opacity: 0 }
                }
                transition={{ duration: 0.8 }}
                className="text-white p-4 text-end"
                style={{ position: "relative", zIndex: 1 }}
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.andrea
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="fs-1 mb-2"
                >
                  Andrea
                </motion.h2>
                <motion.h4
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.andrea
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="fs-5 mb-4"
                  style={{
                    color: "#E6DFD0",
                    fontFamily: "Montserrat, sans-serif",
                    fontStyle: "italic",
                  }}
                >
                  Chef
                </motion.h4>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sezione Cucina */}
      <section
        ref={cucinaRef}
        className="mb-5 py-5"
        style={{
          background: "linear-gradient(135deg, #939480 0%, #E6DFD0 100%)",
        }}
      >
        <div className="container">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={contentVisible.cucina ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center fs-1 mb-5"
            style={{ color: "#5D4037" }}
          >
            La Nostra Cucina
          </motion.h2>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={
                  contentVisible.cucina ? { opacity: 1 } : { opacity: 0 }
                }
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white p-4 p-lg-5 rounded-4 shadow"
              >
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.cucina
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="fs-5 mb-4"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    color: "#050505",
                    lineHeight: "1.7",
                  }}
                >
                  La nostra cucina è un viaggio attraverso i sapori autentici
                  della tradizione toscana, dove ogni piatto è un'opera d'arte
                  creata con passione e dedizione. Al centro della nostra
                  filosofia culinaria c'è la pasta fresca, preparata ogni giorno
                  secondo antiche ricette tramandate di generazione in
                  generazione.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.cucina
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="fs-5 mb-4"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    color: "#050505",
                    lineHeight: "1.7",
                  }}
                >
                  Le abili mani del nostro chef Andrea trasformano semplici
                  ingredienti in tagliatelle vellutate, pappardelle robuste,
                  tordelli saporiti, ravioli dal ripieno generoso e tagliolini
                  delicati. Ogni formato viene lavorato con pazienza e rispetto,
                  per mantenere intatta la consistenza ideale che esalta i
                  condimenti preparati con cura.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.cucina
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="fs-5 mb-4"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    color: "#050505",
                    lineHeight: "1.7",
                  }}
                >
                  La scelta delle materie prime è per noi fondamentale:
                  privilegiamo prodotti locali, freschi e di stagione,
                  selezionati personalmente presso piccoli produttori del
                  territorio. L'olio extravergine d'oliva delle colline toscane,
                  i formaggi stagionati nei caseifici artigianali della zona, le
                  verdure coltivate negli orti vicini e le carni provenienti da
                  allevamenti locali sono i protagonisti indiscussi dei nostri
                  piatti.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentVisible.cucina
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="fs-5 mb-0"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 400,
                    color: "#050505",
                    lineHeight: "1.7",
                  }}
                >
                  La nostra proposta gastronomica è un perfetto equilibrio tra
                  innovazione e tradizione, dove le ricette classiche vengono
                  reinterpretate con un tocco contemporaneo, ma sempre nel
                  rispetto dei sapori originali.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sezione Valori */}
      <section ref={valuesRef} className="py-5 w-100 mb-5">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={contentVisible.valori ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-5 fs-1"
            style={{ color: "#5D4037" }}
          >
            I Nostri Valori
          </motion.h2>

          <div className="row justify-content-center">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="col-md-6 col-lg-3 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  contentVisible.valori
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <div
                  className="text-center p-4 h-100 d-flex flex-column justify-content-center align-items-center"
                  style={{
                    backgroundColor: "#F7F5F0",
                    borderRadius: "20px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 30px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 20px rgba(0,0,0,0.05)";
                  }}
                >
                  <motion.div
                    className="mb-3"
                    style={{ color: "#8D6E63" }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {value.icon}
                  </motion.div>
                  <h3
                    className="h5 mb-3"
                    style={{
                      color: "#5D4037",
                      fontWeight: "600",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {value.title}
                  </h3>
                  <p
                    className="mb-0"
                    style={{
                      color: "#666",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChiSiamo;
