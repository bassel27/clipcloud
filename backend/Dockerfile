# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.19.0

################################################################################
# CHANGED: Switched from Alpine to Slim for better storage support
FROM node:${NODE_VERSION}-slim as base

# Set working directory
WORKDIR /usr/src/app



################################################################################
# NEW: Install system dependencies (e.g., ffmpeg for video processing)
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    rm -rf /var/lib/apt/lists/*

################################################################################
# Create a stage for installing production dependecies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
--mount=type=bind,source=package-lock.json,target=package-lock.json \
--mount=type=cache,target=/root/.npm \
npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends --fix-missing ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Copy the rest of the source files into the image.
COPY . .

################################################################################
# NEW: Create media directory with correct permissions
# RUN mkdir -p /usr/src/app/src/uploads/{images,thumbnails,videos} && \
#     chown -R node:node /usr/src/app/src/uploads
RUN chown -R node:node /usr/src/app/src/uploads

# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# NEW: Declare a persistent volume for media
VOLUME /usr/src/app/src/uploads

# Expose the port that the application listens on.
EXPOSE 3081

# Run the application.
CMD node dist/index.js