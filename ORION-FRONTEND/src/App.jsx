import React, { useEffect, useState } from "react";
import { usePorcupine } from "@picovoice/porcupine-react";
import VoiceIndicator from "./components/VoiceIndicator";

const { VITE_PICOVOICE_ACCESS_KEY } = import.meta.env;

function App() {
  const [detected, setDetected] = useState(false);

  const {
    keywordDetection,
    isLoaded,
    isListening,
    error,
    init,
    start,
    release,
  } = usePorcupine();

  useEffect(() => {
    const runInit = async () => {
      if (!VITE_PICOVOICE_ACCESS_KEY) {
        console.error(
          "La clave de acceso de PicoVoice no está configurada en .env"
        );
        return;
      }

      try {
        // Define la palabra clave y el modelo
        const keyword = {
          publicPath: "/keywords/Orion_es_wasm_v4_0_0.ppn",
          label: "Orion",
        };
        const model = {
          publicPath: "/models/porcupine_params_es.pv",
        };

        // Inicializa el motor de Porcupine
        await init(VITE_PICOVOICE_ACCESS_KEY, keyword, model);
      } catch (e) {
        console.error("Error al inicializar Porcupine:", e);
      }
    };

    runInit();

    // Limpieza al desmontar el componente
    return () => {
      release();
    };
  }, [init, release]);

  useEffect(() => {
    // Una vez cargado, empieza a escuchar
    if (isLoaded && !isListening) {
      start();
    }
  }, [isLoaded, isListening, start]);

  useEffect(() => {
    // Maneja la detección de la palabra clave
    if (keywordDetection !== null) {
      console.log(`Palabra clave detectada: ${keywordDetection.label}`);
      setDetected(true);
      setTimeout(() => setDetected(false), 2000);
    }
  }, [keywordDetection]);

  // Manejo de errores
  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontFamily: "sans-serif",
          color: "red",
        }}
      >
        <h1>Error en Porcupine</h1>
        <p>{error.toString()}</p>
      </div>
    );
  }

  const getStatusText = () => {
    if (!isLoaded) return "CARGANDO MOTOR...";
    if (detected) return "¡ORION DETECTADO!";
    if (isListening) return "ESCUCHANDO...";
    return "INICIANDO...";
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Proyecto ORION</h1>
      <VoiceIndicator />
      <p style={{ marginTop: "20px" }}>
        {/* El estado ahora se maneja dentro de VoiceIndicator */}
        Dí 'Orion' para iniciar una orden.
      </p>
    </div>
  );
}

export default App;
