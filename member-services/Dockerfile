FROM node:22.15.0

WORKDIR /

COPY package*.json ./

RUN npm install 

COPY /app .

EXPOSE 3002

CMD ["npm", "run", "dev"]