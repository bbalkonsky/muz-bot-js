FROM node:14.17-alpine3.12 AS BUILD_IMAGE
WORKDIR /app
ADD . /app

RUN npm i \ 
    && npm prune --production


FROM node:14.17-alpine3.12
LABEL org.opencontainers.image.authors="A-styler@ya.ru"
LABEL org.opencontainers.image.source="https://github.com/bbalkonsky/muz-bot-js"

WORKDIR /app
COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules

EXPOSE 3000
ENTRYPOINT npm start
