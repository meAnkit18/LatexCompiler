FROM node:20-slim

# install curl + unzip
RUN apt-get update && apt-get install -y curl unzip

# install tectonic manually (official binary)
RUN curl -L https://github.com/tectonic-typesetting/tectonic/releases/latest/download/tectonic-x86_64-unknown-linux-gnu.tar.gz \
    | tar -xz -C /usr/local/bin

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
