FROM node:14.15.4-buster

#ENV TELEGRAM_TOKEN
#ENV WEBHOOK_URL
#ENV WEBHOOK_PORT
#ENV PATH_TO_KEY
#ENV PATH_TO_CERT
#ENV DBASE_PATH
#ENV OWNER_ID
#ENV ODESLI_API_URL
#ENV ODESLI_TOKEN
#ENV YMONEY_URL
#ENV PATREON_URL
#ENV BOT_USERNAME

WORKDIR /app

ADD . /app

RUN npm install

CMD [ "npm", "start" ]

EXPOSE 3000
