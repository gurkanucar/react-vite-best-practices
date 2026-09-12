# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable && corepack prepare pnpm@11.5.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# --ignore-scripts: the `prepare` hook installs git hooks, and there is no .git in the image.
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

ARG VITE_APP_NAME="React Vite Best Practices"
ARG VITE_API_BASE_URL="https://jsonplaceholder.typicode.com"
ARG VITE_DUMMYJSON_API_BASE_URL="https://dummyjson.com"
ARG VITE_FEATURE_ASSISTANT="false"
ARG VITE_FEATURE_MOCK_POSTS_API="false"
ARG VITE_FEATURE_MOCK_ASSISTANT_API="false"

ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_DUMMYJSON_API_BASE_URL=$VITE_DUMMYJSON_API_BASE_URL
ENV VITE_FEATURE_ASSISTANT=$VITE_FEATURE_ASSISTANT
ENV VITE_FEATURE_MOCK_POSTS_API=$VITE_FEATURE_MOCK_POSTS_API
ENV VITE_FEATURE_MOCK_ASSISTANT_API=$VITE_FEATURE_MOCK_ASSISTANT_API

RUN pnpm build:production

FROM nginx:alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
