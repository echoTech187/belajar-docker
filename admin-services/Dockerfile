FROM node:22.15.0

WORKDIR /

COPY package*.json ./

RUN npm install
RUN npx sequelize-cli init

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]