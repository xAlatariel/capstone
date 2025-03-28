import React from "react";

const Contatti = () => {
  const handleMapClick = () => {
    window.open(
      "https://www.google.com/maps/place/Ai+Canipai/@44.1713718,10.3436651,15z/data=!4m6!3m5!1s0x12d56be6c4848fa3:0x3809e3a49cbfb558!8m2!3d44.1713718!4d10.3436651!16s%2Fg%2F11b73nfdbm?entry=ttu",
      "_blank"
    );
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center "
      style={{ backgroundColor: "#F0EBDE", minHeight: "80vh" }}
    >
      <div
        className="card p-4 shadow"
        style={{
          maxWidth: "900px",
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "15px",
        }}
      >
        <div className="row">
          <div className="col-md-8">
            <div
              style={{
                cursor: "pointer",
                borderRadius: "10px",
                overflow: "hidden",
                width: "100%",
                paddingTop: "100%",
                position: "relative",
              }}
              onClick={handleMapClick}
            >
              <iframe
                title="Mappa del Ristorante"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "0",
                }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2866.091229306888!2d10.34107631550867!3d44.17137177910916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d56be6c4848fa3%3A0x3809e3a49cbfb558!2sAi%20Canipai!5e0!3m2!1sit!2sit!4v1698765432100!5m2!1sit!2sit"
                allowFullScreen=""
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <div>
              <p className="mb-2">
                <strong>Telefono Fisso:</strong>
                <br />
                <a
                  href="tel:05831799307"
                  style={{ color: "#007bff", textDecoration: "none" }}
                >
                  0583 179 9307
                </a>
              </p>
              <p className="mb-2">
                <strong>Sebastiano:</strong>
                <br />
                <a
                  href="tel:3452593099"
                  style={{ color: "#007bff", textDecoration: "none" }}
                >
                  345 259 3099
                </a>
              </p>
              <p className="mb-2">
                <strong>Andrea:</strong>
                <br />
                <a
                  href="tel:3202374836"
                  style={{ color: "#007bff", textDecoration: "none" }}
                >
                  320 237 4836
                </a>
              </p>
              <p className="mb-0">
                <strong>Indirizzo:</strong>
                <br />
                Via Roma, 22, 55038 San Romano In Garfagnana LU
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contatti;
