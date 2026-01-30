FROM node:18

RUN apt-get update && \
    apt-get install -y \
    texlive-latex-base \
    texlive-latex-extra \
    texlive-fonts-recommended

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
