FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runner stage keeps full deps + source so TypeORM's ts-node migration runner
# can resolve src/**/*.entity.ts and src/database/migrations/*.ts globs.
# The data-source.ts is hardcoded to these src/ paths; changing them to dist/
# would require modifying application source code. For a production deployment
# beyond local dev, refactor data-source.ts to use dist/ paths and drop ts-node.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json
EXPOSE 4000
CMD ["node", "dist/main"]
