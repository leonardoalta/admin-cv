# Stage 1: Build de Angular en Node
FROM node:18-alpine AS build
WORKDIR /app

# Copia dependencias
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copia código fuente
COPY angular.json tsconfig*.json ./
COPY src ./src

# Genera la build de producción
RUN npm run build -- --configuration production

# Stage 2: Servir con NGINX
FROM nginx:stable-alpine
# Copia la build compilada
COPY --from=build /app/dist/admin-cv /usr/share/nginx/html

# Expon el puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
