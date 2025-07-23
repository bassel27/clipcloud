# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.19.0

################################################################################
# CHANGED: Switched from Alpine to Slim for better storage support
FROM node:slim AS base

# Set working directory
WORKDIR /usr/src/app

    
################################################################################
# Create a stage for installing dependencies.
FROM base as deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

################################################################################
# Create a stage for building the application.
FROM deps as build

COPY . .

RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
FROM base as final

# Use production node environment by default.
ENV NODE_ENV=production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy node_modules
COPY --from=deps /usr/src/app/node_modules ./node_modules
# Copy the built application
COPY --from=build /usr/src/app/dist ./dist

# NEW: Declare a persistent volume for media
VOLUME /usr/src/app/src/uploads

EXPOSE 3081

CMD ["node", "dist/index.js"]