FROM node:carbon

WORKDIR /usr/src/demo_shop/order

COPY package*.json .

RUN npm install && apt update && apt install -y nano

COPY . .

EXPOSE 80

CMD ["npm", "start"]