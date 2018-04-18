FROM node:carbon

WORKDIR /usr/src/demo_shop/product

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "start"]