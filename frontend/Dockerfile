FROM node:20.11.1-slim

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
RUN npm install -g nodemon
RUN npm install -g ts-node
RUN npm install -g dotenv

COPY . ./

EXPOSE 3000
ENTRYPOINT ["yarn", "start"]
