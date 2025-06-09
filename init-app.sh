#!/bin/sh

echo "Waiting for DB..."
until nc -z home-library-postgres 5432; do
  sleep 1
done

echo "Running Prisma migration..."
npx prisma migrate deploy

echo "Starting Nest app in dev mode..."
npm run start:dev