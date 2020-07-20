FROM node:12

WORKDIR /usr/src/apps

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD ["npm", "start"]