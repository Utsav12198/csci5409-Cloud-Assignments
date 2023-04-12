FROM node:18-alpine

RUN npm install -g nodemon  

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000

CMD ["npm", "run", "dev"]