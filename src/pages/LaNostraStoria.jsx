import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHistory, FaLeaf, FaTools, FaIndustry } from "react-icons/fa";
import { Carousel } from "react-bootstrap";

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
        La Nostra Storia
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
        Radici profonde, tradizioni vive: l'essenza di San Romano e dei nostri
        Canipai
      </motion.p>
    </div>
  );
};

// Componente Esagono
const Hexagon = ({ icon, title, content, delay, onClick, active, inView }) => {
  return (
    <motion.div
      className="hexagon-wrapper col-md-3 col-sm-6 mb-5"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      onClick={onClick}
    >
      <div
        className={`hexagon-content text-center p-4 ${active ? "active" : ""}`}
        style={{
          position: "relative",
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          backgroundColor: active ? "#939480" : "#E6DFD0",
          transition: "background-color 0.3s ease",
          cursor: "pointer",
          minHeight: "280px",
          maxWidth: "240px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div
          className="icon-wrapper mb-3"
          style={{
            backgroundColor: active ? "#E6DFD0" : "#939480",
            color: active ? "#939480" : "#E6DFD0",
            width: "60px",
            height: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            transition: "all 0.3s ease",
          }}
        >
          {icon}
        </div>
        <h3
          className="mb-3 fs-4"
          style={{
            color: active ? "white" : "#5D4037",
            transition: "color 0.3s ease",
          }}
        >
          {title}
        </h3>
        <p
          className="mb-0"
          style={{
            color: active ? "white" : "#050505",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 400,
            fontSize: "0.9rem",
            transition: "color 0.3s ease",
          }}
        >
          {content}
        </p>
      </div>
    </motion.div>
  );
};

const DetailContent = ({ selectedContent, isVisible }) => {
  const variants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      className="detail-content mb-5"
      style={{ overflow: "hidden" }}
    >
      {selectedContent && (
        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm">
          <h2 className="fs-1 mb-4 text-center" style={{ color: "#5D4037" }}>
            {selectedContent.title}
          </h2>

          {selectedContent.type === "carousel" ? (
            <Carousel
              interval={5000}
              className="mb-4 rounded-3 overflow-hidden shadow-sm"
            >
              {selectedContent.items.map((item, index) => (
                <Carousel.Item key={index}>
                  <div
                    style={{
                      height: "400px",
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div
                      className="h-100 d-flex align-items-center"
                      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                    >
                      <div className="p-4 text-white text-center w-100">
                        <h3 className="fs-2 mb-3">{item.title}</h3>
                        <p
                          className="fs-5 mb-0 mx-auto"
                          style={{ maxWidth: "800px", lineHeight: "1.7" }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : null}

          {selectedContent.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="fs-5 mb-4"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 400,
                color: "#050505",
                lineHeight: "1.7",
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const ToolsCarousel = ({ tools, inView }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="tools-carousel my-5"
    >
      <Carousel
        interval={4000}
        className="rounded-4 shadow"
        style={{
          backgroundColor: "#939480",
          overflow: "hidden",
        }}
      >
        {tools.map((tool, index) => (
          <Carousel.Item key={index}>
            <div className="p-4 p-md-5">
              <div className="row">
                <div className="col-md-4 text-center mb-3 mb-md-0">
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="img-fluid rounded-3 shadow-sm"
                    style={{ maxHeight: "300px" }}
                  />
                </div>
                <div className="col-md-8">
                  <h3 className="fs-2 mb-3" style={{ color: "#E6DFD0" }}>
                    {tool.name}
                  </h3>
                  <p
                    className="fs-5 mb-0 text-white"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      lineHeight: "1.7",
                    }}
                  >
                    {tool.description}
                  </p>
                </div>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </motion.div>
  );
};

const LegendsTextCarousel = ({ legends, inView }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="legends-carousel my-5"
    >
      <Carousel
        interval={8000}
        indicators={true}
        className="rounded-4 shadow mx-auto"
        style={{
          backgroundColor: "#939480",
          overflow: "hidden",
          minHeight: "450px",
          maxWidth: "800px",
        }}
      >
        {legends.map((legend, index) => (
          <Carousel.Item key={index}>
            <div className="p-5 text-center">
              <h3 className="fs-2 mb-4" style={{ color: "#E6DFD0" }}>
                {legend.title}
              </h3>
              <p
                className="fs-5 mb-0 text-white"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 400,
                  lineHeight: "1.7",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                {legend.description}
              </p>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </motion.div>
  );
};

const LaNostraStoria = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [hexagonsRef, inViewHexagons] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [toolsRef, inViewTools] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [legendsRef, inViewLegends] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Contenuti storici
  const detailedContents = {
    sanRomano: {
      title: "San Romano in Garfagnana",
      paragraphs: [
        "San Romano in Garfagnana è un gioiello medievale incastonato nel cuore della Toscana, dove storia e natura si fondono in un'atmosfera unica. Le sue antiche mura e le strette vie acciottolate raccontano di epoche in cui cavalieri e castelli difendevano il territorio, testimoniando il passato strategico e bellico del borgo.",
        "Situato strategicamente nella valle del Serchio, San Romano ha rappresentato per secoli un importante crocevia commerciale e militare. La sua posizione sopraelevata offriva un naturale punto di osservazione e difesa, caratteristica che ha plasmato l'identità del borgo e la vita dei suoi abitanti.",
        "Qui ogni pietra è un frammento di storia: dai resti fortificati alle leggende tramandate di generazione in generazione, San Romano vive come un custode del tempo, invitando chi lo visita a immergersi in un racconto senza tempo. Un luogo d'impatto, dove la memoria storica si intreccia con la bellezza naturale dei paesaggi garfagnini, rendendolo un punto di riferimento imprescindibile per chi ama scoprire la vera essenza della Toscana.",
      ],
    },
    origineCanipai: {
      title: "Origine del Nome 'Ai Canipai'",
      paragraphs: [
        "Il nome del nostro ristorante affonda le radici nella storia agricola di San Romano in Garfagnana. Nei primi anni del '900, la canapa era una delle coltivazioni più diffuse nel territorio comunale. L'area su cui oggi sorge la nostra struttura ospitava un tempo un terreno paludoso, particolarmente adatto alla coltivazione di questa versatile pianta.",
        "La canapa richiedeva terreni umidi per prosperare e costituiva un'importante risorsa economica per la popolazione locale. Le sue fibre resistenti erano essenziali per la produzione di cordami, tessuti e numerosi altri manufatti indispensabili per la vita quotidiana di una comunità montana.",
        "Nel 1998, quando il Comune acquisì quest'area, ormai bonificata, scelse di valorizzarne la storia trasformandola in una struttura ricettiva che mantenesse vivo il legame con il passato agricolo. È nato così il nostro ristorante, custode non solo della tradizione gastronomica, ma anche della memoria storica di un'attività artigianale che ha caratterizzato per decenni l'economia e la società di San Romano.",
      ],
    },
    lavorazioneCanapa: {
      title: "L'Arte della Lavorazione della Canapa",
      paragraphs: [
        "A San Romano in Garfagnana la lavorazione della canapa non era solo un'attività produttiva, ma un vero e proprio rituale radicato nella tradizione contadina. Le tecniche tradizionali prevedevano il 'rettaggio' – un lungo ammollo che facilitava la separazione delle fibre dalla parte legnosa – seguito da battitura e filatura, processi che richiedevano abilità e conoscenze specifiche.",
        "Questi lavori si svolgevano spesso in comunità, accompagnati da canti e celebrazioni che benedicevano il raccolto, sottolineando il legame profondo tra la terra e chi la coltivava. Dalle mani esperte degli artigiani locali, le fibre venivano trasformate in prodotti di uso quotidiano: corde robuste per i lavori agricoli, tessuti resistenti per l'abbigliamento da lavoro, sacchi per il trasporto delle merci.",
        "Ogni fase della lavorazione richiedeva strumenti specifici, veri e propri gioielli dell'artigianato locale, che hanno accompagnato generazioni di famiglie nella trasformazione di questa risorsa naturale in beni essenziali per la comunità.",
      ],
    },
    strumenti: {
      title: "Gli Strumenti della Tradizione",
      paragraphs: [
        "La lavorazione della canapa a San Romano era un'arte che richiedeva strumenti specializzati, testimonianze tangibili dell'ingegno artigianale locale. Ogni attrezzo aveva una funzione specifica nel processo di trasformazione della pianta grezza in fibre utilizzabili.",
        "Questi strumenti non erano semplici oggetti, ma veri e propri emblemi di un sapere antico, custodito e tramandato con cura nel corso delle generazioni. Rappresentavano il legame profondo tra l'uomo e la terra, tra il lavoro e la comunità, in un equilibrio che ha caratterizzato per secoli la vita in queste valli.",
        "Oggi, conserviamo questi preziosi strumenti non solo come reperti storici, ma come testimonianze vive di un'epoca in cui il lavoro manuale era arte e conoscenza, in cui ogni oggetto raccontava una storia di ingegno e pazienza.",
      ],
    },
  };

  // Effetto per impostare il contenuto selezionato
  useEffect(() => {
    if (activeSection) {
      setSelectedContent(detailedContents[activeSection]);
    } else {
      setSelectedContent(null);
    }
  }, [activeSection]);

  // Strumenti per la lavorazione della canapa
  const tools = [
    {
      name: "Arcolaio",
      description:
        "Realizzato generalmente in legno, l'arcolaio è essenziale per pettinare e allineare le fibre di canapa. Dotato di denti finemente sagomati, lo strumento permette di rimuovere impurità e parti legnose, separando e districando le fibre in modo da prepararle alla fase di filatura. La sua efficacia nel rendere le fibre uniformi ha reso l'arcolaio uno degli strumenti più preziosi nell'ambito della lavorazione tradizionale.",
      image: "/src/assets/foto/arcolaio.jpeg",
    },
    {
      name: "Aspo con supporto",
      description:
        "L'aspo, abbinato a un supporto stabile, viene utilizzato per raccogliere e mantenere tese le fibre durante la lavorazione. Il supporto garantisce un posizionamento ergonomico, facilitando la disposizione ordinata delle fibre e permettendo una lavorazione più uniforme. Questo strumento tradizionale ha giocato un ruolo fondamentale nella trasformazione della canapa in matasse pronte per essere ulteriormente lavorate.",
      image: "/src/assets/foto/aspo con supporto.jpeg",
    },
    {
      name: "Filatoio verticale",
      description:
        "Il filatoio verticale sfrutta la gravità e il movimento rotatorio per trasformare le fibre in filato. A differenza dei tradizionali telai orizzontali, il design verticale consente una filatura omogenea e controllata, dove le fibre, alimentate dall'alto, vengono filate con precisione, garantendo un filo resistente e di qualità. Questo strumento è una testimonianza dell'evoluzione degli attrezzi artigianali adattati alle specificità della canapa.",
      image: "/src/assets/foto/filatoio verticale.jpeg",
    },
    {
      name: "Spadola",
      description:
        "La spadola è un robusto strumento impiegato per colpire le canne di canapa, favorendo la rottura della parte legnosa che racchiude le preziose fibre. Grazie alla forza e alla precisione con cui viene maneggiata, la spadola facilita l'accesso alle fibre, rendendole più facilmente separabili e pronte per il successivo lavoro di pettinatura e filatura.",
      image: "/src/assets/foto/spadola.jpeg",
    },
    {
      name: "Fusi cannatori",
      description:
        "Questi spindoli in legno sono stati progettati appositamente per la filatura della canapa. I fusi cannatori aiutano a distendere le fibre e a creare il giusto grado di torsione, essenziale per ottenere un filo omogeneo e continuo. L'uso di questi utensili, insieme alla tecnica manuale, testimonia la profonda conoscenza delle proprietà della canapa e il raffinato processo artigianale di trasformazione.",
      image: "/src/assets/foto/fusi cannatori.jpeg",
    },
    {
      name: "Pettine da canapa",
      description:
        "Simile a un pettine tradizionale, questo strumento è specificamente ideato per allineare le fibre di canapa e rimuovere ulteriori impurità o fibre troppo corte. Il pettine da canapa contribuisce a creare un fascio di fibre ben ordinato, essenziale per ottenere una filatura di qualità elevata e per valorizzare il potenziale della materia prima.",
      image: "/src/assets/foto/pettine da canapa.jpeg",
    },
  ];

  // Leggende
  const legends = [
    {
      title: "Il Berrettin Rosso (o Pelliccioni)",
      description:
        "Il mito del Berrettin Rosso, conosciuto anche come Pelliccioni, si distingue per la sua carica simbolica e per il forte legame con l'identità contadina della Garfagnana. Questo personaggio, immortalato con il caratteristico berretto rosso, incarna lo spirito ribelle e fiero degli abitanti di San Romano. Il Berrettin Rosso non è solo un eroe folkloristico, ma un simbolo della vitalità e della resilienza della comunità, che ha saputo trasformare le difficoltà quotidiane in vere imprese eroiche. Attraverso canti, danze e riti, il mito è stato tramandato di generazione in generazione, mantenendo viva la memoria di un passato in cui il coraggio e l'ingegno erano alla base della sopravvivenza e della coesione sociale.",
    },
    {
      title: "Il Drago-Serpente",
      description:
        "Nel folclore di San Romano, il drago-serpente è una creatura leggendaria che incarna la forza primordiale della natura. Secondo i racconti tramandati nel tempo, questa entità, ibrida tra drago e serpente, emergeva dalle acque impetuose dei torrenti e si nascondeva tra le fitte ombre dei boschi garfagnini. Il drago-serpente rappresenta il dualismo della natura: una forza distruttiva che, al contempo, annuncia la rinascita e l'equilibrio tra luce e oscurità. La sua figura, temuta per la sua potenza ma anche venerata per il simbolismo di rinnovamento, ha ispirato numerosi racconti che sottolineano come la paura dell'ignoto possa trasformarsi in una fonte di forza e speranza.",
    },
    {
      title: "Marsilio Vanni e la Paura al Fosso della Pelina",
      description:
        "Un altro capitolo della tradizione locale narra le gesta di Marsilio Vanni, un eroe del borgo la cui leggenda è indissolubilmente legata al temuto Fosso della Pelina. In tempi antichi, il fosso era considerato un abisso oscuro, un luogo dove le forze misteriose e l'ignoto si facevano tangibili, seminando timore tra gli abitanti. Marsilio Vanni, con coraggio e determinazione, decise di sfidare quel simbolo di terrore. La sua impresa, che vedeva in lui il liberatore del borgo, non fu soltanto un atto di sfida contro la paura, ma una trasformazione radicale del destino della comunità. Affrontando il fosso e le leggende che lo circondavano, Vanni divenne emblema di resilienza e speranza.",
    },
  ];

  // Gestione click esagono
  const handleHexagonClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div
      className="d-flex flex-column"
      style={{ minHeight: "100vh", paddingTop: "100px" }}
    >
      <PageHeader />

      {/* Sezione esagoni */}
      <section className="py-5" style={{ backgroundColor: "#F7F5F0" }}>
        <div ref={hexagonsRef} className="container">
          <div className="row justify-content-center">
            <Hexagon
              icon={<FaHistory size={28} />}
              title="San Romano"
              content="Un gioiello medievale nel cuore della Toscana"
              delay={0.1}
              onClick={() => handleHexagonClick("sanRomano")}
              active={activeSection === "sanRomano"}
              inView={inViewHexagons}
            />

            <Hexagon
              icon={<FaLeaf size={28} />}
              title="Il Nome"
              content="Le radici agricole di 'Ai Canipai'"
              delay={0.2}
              onClick={() => handleHexagonClick("origineCanipai")}
              active={activeSection === "origineCanipai"}
              inView={inViewHexagons}
            />

            <Hexagon
              icon={<FaTools size={28} />}
              title="La Lavorazione"
              content="L'arte della trasformazione della canapa"
              delay={0.3}
              onClick={() => handleHexagonClick("lavorazioneCanapa")}
              active={activeSection === "lavorazioneCanapa"}
              inView={inViewHexagons}
            />

            <Hexagon
              icon={<FaIndustry size={28} />}
              title="Gli Strumenti"
              content="I tesori dell'artigianato tradizionale"
              delay={0.4}
              onClick={() => handleHexagonClick("strumenti")}
              active={activeSection === "strumenti"}
              inView={inViewHexagons}
            />
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <DetailContent
                selectedContent={selectedContent}
                isVisible={!!selectedContent}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sezione leggende */}
      <section ref={legendsRef} className="py-5 mb-5">
        <div className="container">
          <div className="text-center mb-5">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={inViewLegends ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="fs-1 mb-3"
              style={{ color: "#5D4037" }}
            >
              Leggende della Garfagnana
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={
                inViewLegends ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: 0.3 }}
              className="fs-5 mb-0"
              style={{
                color: "#8D6E63",
                maxWidth: "800px",
                margin: "0 auto",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Storie e miti che hanno plasmato l'identità di San Romano
              attraverso i secoli
            </motion.p>
          </div>

          <LegendsTextCarousel legends={legends} inView={inViewLegends} />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={
              inViewLegends ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.5 }}
            className="fs-5 text-center mt-4 mb-0"
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 400,
              color: "#050505",
              lineHeight: "1.7",
            }}
          >
            Queste leggende, tramandate di generazione in generazione, sono
            parte integrante del patrimonio culturale di San Romano. Raccontano
            non solo di esseri fantastici e eroi locali, ma anche dei valori e
            delle credenze che hanno formato l'identità di questa comunità nel
            corso dei secoli.
          </motion.p>
        </div>
      </section>

      {/* Sezione strumenti */}
      <section
        ref={toolsRef}
        className="py-5 mb-5"
        style={{
          background: "linear-gradient(135deg, #939480 0%, #E6DFD0 100%)",
        }}
      >
        <div className="container">
          <div className="text-center mb-5">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={inViewTools ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="fs-1 mb-3"
              style={{ color: "#5D4037" }}
            >
              Gli Strumenti della Tradizione
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={
                inViewTools ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: 0.3 }}
              className="fs-5 mb-4"
              style={{
                color: "#5D4037",
                maxWidth: "800px",
                margin: "0 auto",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Testimonianze dell'ingegno artigianale che ha plasmato la nostra
              tradizione
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inViewTools ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white p-4 rounded-4 shadow-sm mb-5 mx-auto"
              style={{ maxWidth: "900px" }}
            >
              <p
                className="fs-5 mb-0 text-center"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 400,
                  color: "#050505",
                  lineHeight: "1.7",
                }}
              >
                Nel processo tradizionale di lavorazione della canapa, gli
                antichi artigiani della Garfagnana impiegavano una serie di
                utensili specifici, ognuno con una funzione ben precisa, per
                trasformare le fibre grezze in materiale tessile di alta
                qualità. Questi strumenti non solo rappresentavano il risultato
                di un'ingegnosità artigianale, ma erano anche custodi di un
                sapere tramandato di generazione in generazione.
              </p>
            </motion.div>
          </div>

          <ToolsCarousel tools={tools} inView={inViewTools} />
        </div>
      </section>
    </div>
  );
};

export default LaNostraStoria;
