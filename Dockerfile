FROM alpine

WORKDIR /app

COPY . .

RUN apk add nodejs npm
RUN npm i

CMD [ "npm", "start" ]