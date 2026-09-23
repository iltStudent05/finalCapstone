# Build stage for API
FROM node:18-alpine AS api-build

WORKDIR /app

COPY package*.json ./
COPY api/package*.json ./api/
COPY api/tsconfig*.json ./api/

RUN npm install -w api

COPY api/src ./api/src

WORKDIR /app/api
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY api/package*.json ./
RUN npm ci --omit=dev

COPY --from=api-build /app/api/dist ./dist

EXPOSE 4000

CMD ["node", "dist/server.js"]
