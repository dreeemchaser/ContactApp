# ------------------------------------#
# Stage 1: Build
# ------------------------------------#

# Use a lightweight Node.js image to compile the React application
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Build-time variable for the API URL
ARG REACT_APP_API_URL=http://localhost:8080
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy dependency manifests first to leverage Docker cache when dependencies do not change
COPY package.json package-lock.json* ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application source code into the build stage
COPY public public
COPY src src

# Build the React application for production
RUN npm run build

#---------------------------------------------
# Stage 2: Runtime Stage (Nginx)
#---------------------------------------------

# Use the official Nginx image to serve the built static files
FROM nginx:alpine

# Replace default Nginx config with a custom configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the production build output from the builder stage into Nginx's web root
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 3000 for external access
EXPOSE 3000

# Health check confirms Nginx is serving the frontend
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]