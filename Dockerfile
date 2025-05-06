# Stage 1 – Build Angular
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY angular.json tsconfig*.json ./
COPY src ./src

RUN npm run build -- --configuration production

# Stage 2 – NGINX
FROM nginx:stable-alpine

# 1) Limpia el html por defecto
RUN rm -rf /usr/share/nginx/html/*

# 2) Copia SOLO el contenido de dist/admin-cv/browser
COPY --from=build /app/dist/admin-cv/browser/ /usr/share/nginx/html/

# 3) Config SPA + puerto dinámico
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

