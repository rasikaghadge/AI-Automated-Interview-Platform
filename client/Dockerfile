FROM node:14-alpine AS builder
ENV NODE_ENV production

WORKDIR /app

COPY client/package.json .
COPY client/yarn.lock .
RUN yarn install --production

COPY client .

RUN npm run build


ENV NODE_ENV production

ENV REACT_APP_API https://ai-interviewer-backend.onrender.com

COPY --from=builder /app/build /usr/share/nginx/html

COPY ./client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
