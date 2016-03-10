FROM mhart/alpine-node:5

RUN apk add --no-cache make gcc g++ python

WORKDIR /src
ADD package.json .
RUN npm install

ADD . .

CMD ["node", "index.js"]
