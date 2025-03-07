# Using bun as base image
FROM oven/bun:alpine

WORKDIR /app

COPY package.json ./
COPY dist ./dist

CMD ["bun", "run", "start"]