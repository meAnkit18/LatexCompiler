FROM node:20-slim

# install tectonic directly from debian repo
RUN apt-get update && \
    apt-get install -y tectonic && \
    apt-get clean

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 10000

CMD ["node", "server.js"]
