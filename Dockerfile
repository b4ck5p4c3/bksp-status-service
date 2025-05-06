FROM node:20-alpine
WORKDIR /app
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn --pure-lockfile
COPY . .
EXPOSE 8010
CMD yarn start