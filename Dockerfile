# Dockerfile

# Stage 1: Build the Angular application
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy configuration and source
COPY angular.json tsconfig*.json ./
COPY src ./src

# Build for production
RUN npm run build -- --configuration production

# Stage 2: Serve with NGINX using dynamic port binding
FROM nginx:stable-alpine

# Copy the build output to NGINX html directory
COPY --from=build /app/dist/admin-cv /usr/share/nginx/html

# Copy the NGINX configuration template
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Expose port 80 (or the $PORT provided by hosting)
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]

