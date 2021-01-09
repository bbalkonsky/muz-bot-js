FROM node:14.15.4-buster

WORKDIR /app

ADD . /app

RUN npm i

ENTRYPOINT npm start

EXPOSE 3000
