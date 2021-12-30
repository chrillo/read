FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci

# Bundle app source
COPY . .
RUN ls -la

RUN npm run build

# If you are building your code for production

RUN npm prune --production

RUN npx prisma generate

RUN du -sh *

RUN ls -la

EXPOSE 3000
CMD [ "node", "index.js" ]