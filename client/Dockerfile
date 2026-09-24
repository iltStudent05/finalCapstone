# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY vitest.config.ts ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src
COPY public ./public
COPY index.html ./

# Build the React app
RUN npm run build

# Production stage - serve with Nginx
FROM nginx:alpine

# Copy landing page to root
COPY public/landing.html /usr/share/nginx/html/index.html

# Copy React app from builder to /app
COPY --from=builder /app/dist /usr/share/nginx/html/app

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
