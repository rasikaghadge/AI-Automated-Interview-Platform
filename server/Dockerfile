FROM node:18-alpine

WORKDIR /usr/src/app

COPY server/package.json .

RUN npm install

COPY server/ .

ENV NODE_ENV production

RUN npm install && npm install nodemon --save-dev

EXPOSE 5000

CMD ["yarn", "start"]
