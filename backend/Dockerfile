FROM node:22-alpine

WORKDIR /app
RUN apk add --no-cache libssl3
RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV DATABASE_URL="postgres://vypham:vyPham%40%40%40%40%40123@postgre:5432/xteen"

CMD ["npm", "start"]
