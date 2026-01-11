FROM python:3.9-slim-bookworm

WORKDIR /app

# Instalar dependencias del sistema necesarias para Vosk
RUN apt-get update && apt-get install -y \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Instalar librerías de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del servidor
COPY . .

EXPOSE 8000

# Ejecutar el servidor FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]