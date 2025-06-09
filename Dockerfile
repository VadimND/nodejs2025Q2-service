FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

COPY init-app.sh ./
RUN apk add --no-cache dos2unix && dos2unix init-app.sh
RUN chmod +x init-app.sh
CMD ["sh", "./init-app.sh"]
