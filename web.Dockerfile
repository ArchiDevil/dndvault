# build app
FROM node:22-slim AS build-web
RUN npm install -g pnpm
COPY ./web/package.json /app/package.json
COPY ./web/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY ./web/pnpm-lock.yaml /app/pnpm-lock.yaml
WORKDIR /app
RUN pnpm install
COPY ./web /app
RUN pnpm run build

# build server image
FROM node:22-alpine as web
WORKDIR /app
COPY --from=build-web /app/.output /app/dist
CMD node dist/server/index.mjs
EXPOSE 3000
