FROM node:24.22.3-alpine AS base
# If issues persist with native modules, you might need build tools.
# RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
EXPOSE 3000

FROM base AS builder
WORKDIR /app
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_CMS_API_HOST
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_WHITELIST_SOURCES
ENV NEXT_PUBLIC_CMS_API_HOST=$NEXT_PUBLIC_CMS_API_HOST
ENV NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID
ENV NEXT_WHITELIST_SOURCES=$NEXT_WHITELIST_SOURCES
RUN npm run build


FROM node:24.22.3-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy package files first
COPY package*.json ./
# Install ONLY production dependencies
RUN npm ci --omit=dev

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
CMD ["npm", "start"]