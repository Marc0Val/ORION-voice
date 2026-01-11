# Etapa 1: Construcción (Build)
FROM node:18-bookworm AS build
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código y construir
COPY . .
RUN npm run build

# Etapa 2: Servidor final (Nginx)
FROM nginx:alpine
# Copiamos los archivos construidos de React al servidor Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copiamos tu configuración de Nginx que tiene el SSL
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]