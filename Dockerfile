FROM alpine

WORKDIR /app

COPY . .

RUN apk add nodejs npm
RUN npm i
RUN rm users.yml

CMD [ "npm", "start" ]