# Using Bun as the base image for building
FROM oven/bun:alpine AS builder

# Set working directory
WORKDIR /app

# Copy the rest of the application
COPY . .

# Set working directory to the ${SERVICE_NAME} service
WORKDIR /app/backend

# Build the application
RUN bun run build

# Use a minimal Alpine-based Bun image for the final runtime
FROM oven/bun:alpine AS runner

# Set environment variables
ENV NODE_ENV=production

# Create a non-root user and group named "orbitsphere"
RUN addgroup -S orbitsphere && adduser -S orbitsphere -G orbitsphere

# Set working directory
WORKDIR /app

# Copy built application from the builder stage
COPY --from=builder /app/backend/dist .

# Change ownership of the application directory to the orbitsphere user
RUN chown -R orbitsphere:orbitsphere /app

# Switch to the non-root user
USER orbitsphere

# Start the application
CMD ["bun", "run", "/app/index.js"]