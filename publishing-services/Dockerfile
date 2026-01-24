FROM node:22.15.0

WORKDIR /

COPY package*.json ./

RUN npm install

COPY /app .

EXPOSE 3003

CMD ["npm", "run", "dev"]