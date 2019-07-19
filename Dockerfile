FROM node:10.0.0

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "start"]