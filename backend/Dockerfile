FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build
ENV DATABASE_URL="postgres://vypham:vyPham%40%40%40%40%40123@postgre:5432/finance"
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
