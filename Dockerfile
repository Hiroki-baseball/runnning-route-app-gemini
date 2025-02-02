# 1) フロントエンドをビルドするステージ
FROM node:18-alpine AS build

WORKDIR /app

COPY client ./client

# フロントエンドの依存関係インストール＆ビルド
RUN cd client \
    && npm install \
    && npm run build


#本番用のイメージ（サーバー）
FROM node:18-alpine
WORKDIR /app

# server/package.json, server/package-lock.json を先にコピーして依存関係をインストール
COPY server/package*.json ./server/
RUN cd server && npm install

COPY server ./server

COPY --from=build /app/client/build ./server/client-build

ENV PORT=8080
EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "server/server.js"]

