FROM node:14.15.4-buster

LABEL org.opencontainers.image.authors="A-styler@ya.ru"
LABEL org.opencontainers.image.source="https://github.com/bbalkonsky/muz-bot-js"

WORKDIR /app

ADD . /app

RUN npm i

ENTRYPOINT npm start

EXPOSE 3000
