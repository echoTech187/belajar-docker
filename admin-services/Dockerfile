FROM node:22.15.0

WORKDIR /

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 3002

CMD ["node", "index.js"]