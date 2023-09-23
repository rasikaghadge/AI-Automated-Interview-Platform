FROM node:14-alpine AS builder
ENV NODE_ENV production

WORKDIR /app

COPY client/package.json .
COPY client/yarn.lock .
RUN yarn install --production

COPY client .

RUN npm run build


ENV NODE_ENV production

ENV 


CMD ["npm", "start"]
