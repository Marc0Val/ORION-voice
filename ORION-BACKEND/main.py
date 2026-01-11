from fastapi import FastAPI, UploadFile, File
from vosk import Model, KaldiRecognizer
import json
import os

app = FastAPI()

# Cargar el modelo de Vosk (debe estar en la carpeta /model)
# Asegúrate de descargar el modelo de español
MODEL_PATH = "model/vosk-model-small-es-0.42"
if not os.path.exists(MODEL_PATH):
    print("¡Error! No se encontró el modelo de lenguaje en /model")
else:
    model = Model(MODEL_PATH)

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # 1. Leer el audio enviado desde React
    audio_data = await file.read()
    
    # 2. Configurar el reconocedor (frecuencia de muestreo estándar 16000Hz)
    rec = KaldiRecognizer(model, 16000)
    
    # 3. Procesar el audio
    rec.AcceptWaveform(audio_data)
    result = json.loads(rec.FinalResult())
    
    # 4. Devolver el texto a Yarbis
    return {"text": result.get("text", "")}

@app.get("/health")
def health_check():
    return {"status": "Yarbis Core is online"}