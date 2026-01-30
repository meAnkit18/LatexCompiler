FROM node:20-slim

# install tectonic
RUN apt-get update && \
    apt-get install -y wget && \
    wget https://github.com/tectonic-typesetting/tectonic/releases/latest/download/tectonic-x86_64-unknown-linux-gnu.tar.gz && \
    tar -xzf tectonic-*.tar.gz && \
    mv tectonic /usr/local/bin/tectonic

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 10000

CMD ["node", "server.js"]
