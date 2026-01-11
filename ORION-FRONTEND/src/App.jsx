import React, { useEffect, useState } from 'react';
import { usePorcupine } from '@picovoice/porcupine-react';

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
        console.error("La clave de acceso de PicoVoice no está configurada en .env");
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
      <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif', color: 'red' }}>
        <h1>Error en Porcupine</h1>
        <p>{error.toString()}</p>
      </div>
    );
  }

  const getStatusText = () => {
    if (!isLoaded) return 'CARGANDO MOTOR...';
    if (detected) return '¡ORION DETECTADO!';
    if (isListening) return 'ESCUCHANDO...';
    return 'INICIANDO...';
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>Proyecto ORION</h1>
      <div style={{
        padding: '20px',
        borderRadius: '50%',
        width: '200px',
        height: '200px',
        margin: '0 auto',
        backgroundColor: detected ? '#00ff00' : '#333',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease'
      }}>
        {getStatusText()}
      </div>
      <p>{isLoaded && isListening ? "Dí 'Orion' para probar" : "Espera un momento..."}</p>
    </div>
  );
}

export default App;