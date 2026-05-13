#!/bin/sh

# Navigate to prisma package and run migrations
cd /app/packages/prisma
npx prisma migrate deploy

# Navigate back to api-service and start the app
cd /app/apps/api-service
node dist/index.js
