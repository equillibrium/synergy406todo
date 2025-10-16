# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies based on the lock file
COPY front-todo/package*.json ./
RUN npm ci

# Copy the rest of the application and build it
COPY front-todo/ .
RUN npm run build

FROM nginx:alpine AS production

# Copy a custom Nginx config with SPA fallback support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets into Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
