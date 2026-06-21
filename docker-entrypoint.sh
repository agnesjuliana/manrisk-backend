#!/bin/sh
set -e

: "${DATABASE_HOST:=database}"
: "${DATABASE_PORT:=5432}"
: "${DATABASE_USER:=postgres}"
: "${DATABASE_NAME:=postgres}"

if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"
fi

echo "Waiting for PostgreSQL at ${DATABASE_HOST}:${DATABASE_PORT}..."
until pg_isready -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USER" -d "$DATABASE_NAME"; do
  sleep 2
done

echo "Running database migrations..."
pnpm exec prisma migrate deploy --schema ./prisma/schema.prisma

if [ "${RUN_SEED:-true}" = "true" ]; then
  echo "Running database seeder..."
  pnpm exec tsx ./prisma/seeder/seeder.ts
fi

echo "Starting application..."
exec "$@"
