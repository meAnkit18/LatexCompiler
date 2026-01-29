FROM node:20-slim

RUN apt-get update && apt-get install -y tectonic

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
