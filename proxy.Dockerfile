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

# build cdn image
FROM caddy:2.10-alpine
RUN rm /usr/share/caddy/index.html
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build-web /app/.output/public /usr/share/caddy
EXPOSE 10034
