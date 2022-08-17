FROM node:17.4-alpine

RUN apk add bash
RUN npm install -g @vue/cli
RUN npm install -g @vue/cli-service-global
RUN apk add dumb-init
RUN apk add --no-cache python3 py3-pip

RUN apk add dumb-init

RUN mkdir -p /var/www/
VOLUME [ "/var/www/" ]

USER node
WORKDIR /var/www/

