FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache openssl postgresql-client \
  && corepack enable

COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
RUN pnpm exec prisma generate --schema ./prisma/schema.prisma

COPY tsconfig*.json ./
COPY src ./src
RUN pnpm run build

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/src/index.js"]
