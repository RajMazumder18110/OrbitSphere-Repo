# Using Bun as the base image for building
FROM oven/bun:alpine AS builder

# Define a required build argument for the service name
ARG SERVICE_NAME
RUN if [ -z "$SERVICE_NAME" ]; then echo "SERVICE_NAME is required!"; exit 1; fi

# Set working directory
WORKDIR /app

# Copy the rest of the application
COPY . .

# Set working directory to the ${SERVICE_NAME} service
WORKDIR /app/services/${SERVICE_NAME}

# Build the application
RUN bun run build

# Use a minimal Alpine-based Bun image for the final runtime
FROM oven/bun:alpine AS runner

# Define a required runtime argument for the service name
ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}
RUN if [ -z "$SERVICE_NAME" ]; then echo "SERVICE_NAME is required!"; exit 1; fi

# Set environment variables
ENV NODE_ENV=production

# Create a non-root user and group named "orbitsphere"
RUN addgroup -S orbitsphere && adduser -S orbitsphere -G orbitsphere

# Set working directory
WORKDIR /app

# Copy built application from the builder stage
COPY --from=builder /app/services/${SERVICE_NAME}/dist .

# Change ownership of the application directory to the orbitsphere user
RUN chown -R orbitsphere:orbitsphere /app

# Switch to the non-root user
USER orbitsphere

# Start the application
CMD ["bun", "run", "/app/index.js"]