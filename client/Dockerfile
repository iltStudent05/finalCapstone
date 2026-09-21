# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files for both client and api
COPY package*.json ./
COPY client/package*.json ./client/
COPY api/package*.json ./api/

# Install dependencies
RUN npm install -w client -w api

# Copy source code
COPY client/src ./client/src
COPY client/public ./client/public
COPY client/index.html ./client/
COPY client/vite.config.ts ./client/
COPY client/tsconfig*.json ./client/

COPY api/src ./api/src
COPY api/tsconfig*.json ./api/

# Build client
WORKDIR /app/client
RUN npm run build

# Build API
WORKDIR /app/api
RUN npm run build

# Production stage - Nginx for client + Node for API
FROM nginx:alpine AS final

# Install Node.js for the API container
RUN apk add --no-cache nodejs npm

# Copy Nginx config
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built client artifacts
COPY --from=build /app/client/dist /usr/share/nginx/html/app
COPY --from=build /app/client/public/landing.html /usr/share/nginx/html/landing/landing.html

# Create API directory
RUN mkdir -p /usr/share/nginx/html/landing

# Note: For production, use separate containers for Nginx and Node.js
# This is a simplified setup for local development

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
