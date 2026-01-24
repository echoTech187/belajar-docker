FROM node:22.15.0

WORKDIR /

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 3001

CMD ["node", "index.js"]