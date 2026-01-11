import React, { useState, useEffect, useRef } from 'react';
import { usePorcupine } from '@picovoice/porcupine-react';

const { VITE_PICOVOICE_ACCESS_KEY } = import.meta.env;

const VoiceIndicator = () => {
  const [status, setStatus] = useState('CARGANDO MOTOR...');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const {
    keywordDetection,
    isLoaded,
    isListening,
    error,
    init,
    start,
    release,
  } = usePorcupine();

  // 1. Inicializa Porcupine al montar el componente
  useEffect(() => {
    const runInit = async () => {
      if (!VITE_PICOVOICE_ACCESS_KEY) {
        console.error("AccessKey no configurada");
        setStatus('ERROR DE CLAVE');
        return;
      }
      try {
        await init(
          VITE_PICOVOICE_ACCESS_KEY,
          { publicPath: "/keywords/Orion_es_wasm_v4_0_0.ppn", label: "Orion" },
          { publicPath: "/models/porcupine_params_es.pv" }
        );
      } catch (e) {
        console.error("Error al inicializar Porcupine:", e);
        setStatus('ERROR DE INICIO');
      }
    };
    runInit();
    return () => { release(); };
  }, [init, release]);

  // 2. Inicia la escucha cuando el motor está cargado
  useEffect(() => {
    if (isLoaded && !isListening && !error) {
      start();
      setStatus('ESCUCHANDO...');
    }
  }, [isLoaded, isListening, error, start]);

  // 3. Maneja la detección de la palabra clave y la grabación
  useEffect(() => {
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        recorder.onstop = () => {
          // Crea el Blob cuando la grabación se detiene
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          console.log("Grabación finalizada. Blob creado:", audioBlob);
          // Aquí es donde enviarías el Blob al backend
          // Ejemplo: sendAudioToServer(audioBlob);

          // Limpia para la próxima grabación
          audioChunksRef.current = [];
          setIsRecording(false);
          setStatus('ESCUCHANDO...');
        };

        recorder.start();
        setIsRecording(true);
        setStatus('ESCUCHANDO ORDEN...');

        // Detiene la grabación después de 4 segundos
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
          }
        }, 4000);
      } catch (err) {
        console.error("Error al acceder al micrófono para grabar:", err);
        setStatus('ERROR DE GRABACIÓN');
      }
    };

    if (keywordDetection !== null) {
      console.log(`Palabra clave detectada: ${keywordDetection.label}`);
      setStatus('¡ORION DETECTADO!');
      // Inicia la grabación después de una breve pausa visual
      setTimeout(startRecording, 500);
    }
  }, [keywordDetection]);

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  const getBackgroundColor = () => {
    if (status === '¡ORION DETECTADO!') return '#00ff00'; // Verde brillante
    if (isRecording) return '#ff8c00'; // Naranja
    return '#333'; // Gris oscuro
  };

  return (
    <div style={{
      padding: '20px',
      borderRadius: '50%',
      width: '200px',
      height: '200px',
      margin: '0 auto',
      backgroundColor: getBackgroundColor(),
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      transition: 'background-color 0.3s ease'
    }}>
      {status}
    </div>
  );
};

export default VoiceIndicator;