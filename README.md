# Telegram MuzShareBot
### Unofficial telegram bot for [Odesli](https://odesli.co) service

## Why

If all your friends listen to music on different streaming services (Apple music, spotify, etc.), but you want to share music with them without unnecessary difficulties - this bot is for you

## How

To start using Bot, simply add it in [Telegram](http://t.me/muzsharebot) and press /start


## Usage
### Requirements 
* Docker
* Traefik

### Install
Clone repo:
```
cd ~
git clone https://github.com/bbalkonsky/muz-bot-js.git
```
Copy docker-compose file, edit domain inside:
```
cd muz-bot-js
cp docker-compose.yml.example docker-compose.yml
vim docker-compose.yml
```
Copy .env file, edit it:
```
cp .env.example .env
vim .env
```
Run docker-compose with external traefik proxy:
```
docker-compose up -d --build
```
