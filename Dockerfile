#build image
FROM node:18-alpine as build

#initializing app directory
WORKDIR /app
RUN chown -R node /app
COPY --chown=node ["./package.json","./yarn.lock", "./"]
USER node
ENV NODE_ENV production
RUN yarn install  --production=false

#creating project build
COPY --chown=node ["./tsconfig*.json", "./next.config.js",  "./init-db.sql", "./"]
COPY --chown=node ["./public", "./public"]
COPY --chown=node ["./src", "./src"]
RUN yarn run build \
    && yarn install \
    && rm -r .next/cache

#creating actual image of the created build
FROM node:18-alpine
WORKDIR /app
RUN chown -R node /app
COPY --chown=node --from=build [ "/app/package.json","/app/yarn.lock", "./"]
COPY --chown=node --from=build ["/app/.next", "./.next"]
COPY --chown=node --from=build ["/app/node_modules","/app/node_modules"]
USER node
ENV NODE_ENV production
ENV PROJECT_ROOT /app
ENV DATABASE_URL /app/db.sqlite
EXPOSE 3000
CMD yarn run start