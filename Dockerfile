# Stage 1 — get tectonic binary
FROM ghcr.io/tectonic-typesetting/tectonic:latest AS tectonic

# Stage 2 — your app
FROM node:20-slim

# copy tectonic binary only
COPY --from=tectonic /usr/local/bin/tectonic /usr/local/bin/tectonic

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 10000

CMD ["node", "server.js"]
