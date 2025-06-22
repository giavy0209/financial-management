FROM node:22-alpine

WORKDIR /app
RUN apk add --no-cache libssl3
RUN apk add --no-cache openssl

COPY . .

RUN npm install
RUN npm run build
ENV DATABASE_URL="postgres://vypham:vyPham%40%40%40%40%40123@postgre:5432/finance"
RUN npm run prisma:generate
RUN npm run prisma:migrate

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
