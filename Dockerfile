FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN ls -la

RUN npm run build

RUN npm prune --production

RUN npx prisma generate

EXPOSE 3000

CMD [ "node", "index.js" ]