# --- 1) Build stage ---
FROM node:18-alpine AS builder
WORKDIR /app

# copy package metadata & install deps
COPY package*.json vite.config.* ./
RUN npm ci

# copy source & build
COPY . .
RUN npm run build       # outputs to /app/dist by default

# --- 2) Production stage ---
FROM nginx:stable-alpine

# clear out default NGINX content
RUN rm -rf /usr/share/nginx/html/*

# copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# expose & launch
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
