FROM node:22.12.0-alpine

# Set environment variables
ENV npm_config_registry=https://registry.npmmirror.com/
ENV npm_config_cache=/tmp/.npm
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NODE_ENV=development


# Install Python and build dependencies
RUN apk add --no-cache python3 make g++ gcc

WORKDIR /app

# Copy npm configuration
COPY .npmrc ./

# Copy package files
COPY package*.json ./

# Install dependencies and all platform binaries
RUN npm cache clean --force && \
    npm install --no-audit --verbose && \
    npm install @rollup/wasm-node --verbose && \
    npm install @swc/core-linux-x64-musl --verbose

# Copy application files
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]
