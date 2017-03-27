FROM node:7.6.0

ENV NODE_ENV production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm --registry=https://registry.npm.taobao.org install

COPY . /usr/src/app

EXPOSE 3000
VOLUME /usr/src/app/public

CMD [ "npm", "start" ]
