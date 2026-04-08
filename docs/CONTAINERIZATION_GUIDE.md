# Complete Containerization Guide: Contact App & Contact API

## Document Overview
This guide provides step-by-step instructions to dockerize the ContactApp React frontend and ContactAPI Spring Boot backend into a single orchestrated Docker Compose environment. This is **NOT a walkthrough** — these are the exact steps you need to execute yourself.

---

## Table of Contents
1. [Project Analysis](#project-analysis)
2. [Docker Architecture Overview](#docker-architecture-overview)
3. [Prerequisites & Setup](#prerequisites--setup)
4. [Step 1: Create Backend Dockerfile](#step-1-create-backend-dockerfile)
5. [Step 2: Create Frontend Dockerfile](#step-2-create-frontend-dockerfile)
6. [Step 3: Create Docker Compose File](#step-3-create-docker-compose-file)
7. [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
8. [Step 5: Update Frontend API Configuration](#step-5-update-frontend-api-configuration)
9. [Step 6: Create Health Check Scripts](#step-6-create-health-check-scripts)
10. [Step 7: Build and Test](#step-7-build-and-test)
11. [Troubleshooting Guide](#troubleshooting-guide)

---

## Project Analysis

### Current State
```
ContactApp/
├── contactapi/          (Spring Boot Backend)
│   ├── pom.xml         (Maven dependencies)
│   ├── src/main/java/  (Application code)
│   ├── src/main/resources/application.yml
│   └── target/         (Build output)
│
└── contactapp/          (React Frontend)
    ├── package.json    (npm dependencies)
    ├── public/
    ├── src/
    │   ├── api/        (API service calls)
    │   └── components/
    └── build/          (Production build output)
```

### Key Findings

**Backend (contactapi)**
- **Framework:** Spring Boot 3.5.13
- **Language:** Java 25
- **Database:** PostgreSQL 12+
- **Build Tool:** Maven
- **Current Port:** 8080
- **API Base Path:** `/contacts`
- **Features:** File uploads, pagination, CRUD operations
- **Database Config:** hardcoded in `application.yml` (localhost:5432)
- **Photo Storage:** Uses file system (`PHOTO_DIRECTORY` constant)

**Frontend (contactapp)**
- **Framework:** React 18.2.0
- **Build Tool:** Create React App (npm)
- **Current Port:** 3000
- **API Endpoint:** Hardcoded to `http://localhost:8080/contacts` in `ContactService.js`
- **HTTP Client:** Axios

**Database**
- **Type:** PostgreSQL
- **Port:** 5432 (default)
- **Current Credentials:** username: `admin`, password: `administrator`
- **Auto DDL:** Enabled (Hibernate manages schema)

---

## Docker Architecture Overview

### What We're Building
```
┌─────────────────────────────────────────────────────┐
│           Docker Compose Network (docker-net)       │
├─────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │   PostgreSQL     │  │   Spring Boot Backend    │  │
│  │   Container      │  │   Container              │  │
│  │   (db)           │  │   (api)                  │  │
│  ├──────────────────┤  ├──────────────────────────┤  │
│  │ Port: 5432       │  │ Port: 8080 (exposed)     │  │
│  │ Volume: pgdata   │  │ JVM: Java 25             │  │
│  │ Env: POSTGRES_*  │  │ URL: postgres://db:5432/ │  │
│  └──────────────────┘  └──────────────────────────┘  │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │   React Frontend Container                     │   │
│  │   (frontend)                                   │   │
│  ├────────────────────────────────────────────────┤   │
│  │ Port: 3000 (exposed)                           │   │
│  │ Node.js runtime                                │   │
│  │ Build via Nginx (production)                   │   │
│  │ API calls to http://api:8080/contacts         │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │   Health Check Service (Optional)              │   │
│  │   - Test API connectivity                      │   │
│  │   - Validate DB connection                     │   │
│  │   - Perform integration tests                  │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────┘
```

### Container Dependencies
```
frontend → api → db
```
- Frontend depends on API being healthy
- API depends on Database being ready
- All communicate via Docker Compose internal DNS

---

## Prerequisites & Setup

### System Requirements
- **Docker:** Version 20.10+
- **Docker Compose:** Version 2.0+
- **Disk Space:** ~3GB (for images and volumes)
- **RAM:** 4GB minimum recommended

### Pre-Containerization Checklist
- [ ] Both projects are in the ContactApp directory
- [ ] `contactapi/pom.xml` exists and is valid XML
- [ ] `contactapp/package.json` exists and is valid JSON
- [ ] No running services on ports 3000, 5432, 8080
- [ ] Git repository is initialized (optional but recommended)

### Verify Your Environment
```bash
# Check Docker installation
docker --version
docker-compose --version

# Navigate to your workspace
cd /Users/dreamer/Documents/Development/ContactApp

# Verify directory structure
ls -la
# Should show: contactapi, contactapp, README.md, ...
```

---

## Step 1: Create Backend Dockerfile

### Objective
Create a multi-stage Dockerfile for the Spring Boot API that:
1. Compiles the Maven project
2. Packages it as a JAR
3. Runs in a minimal Java runtime

### Files to Create
**Location:** `contactapi/Dockerfile`

```dockerfile
# ============================================
# Stage 1: Build Stage
# ============================================
FROM maven:3.9-eclipse-temurin-25 AS builder

WORKDIR /app

# Copy Maven configuration files
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# Copy source code
COPY src src

# Build the application
# Skip tests during build for faster containerization
RUN mvn clean package -DskipTests

# ============================================
# Stage 2: Runtime Stage
# ============================================
FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Create directory for photo uploads
RUN mkdir -p /app/photos

# Expose the port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/contacts || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### What This Does
- **Stage 1 (builder):** Uses Maven image to compile the project
- **Stage 2 (runtime):** Uses minimal JRE Alpine image (smaller footprint)
- **Photo directory:** Created for file uploads
- **Health check:** Verifies API is responding
- **Entry point:** Starts the Spring Boot application

### Important Notes
- Multi-stage build reduces final image size
- Alpine Linux keeps image lean (~200MB vs 500MB+)
- Health check enables Docker Compose to verify API startup
- EXPOSE documentation only; actual port binding in docker-compose.yml

---

## Step 2: Create Frontend Dockerfile

### Objective
Create a Dockerfile for React that:
1. Installs dependencies
2. Builds React app for production
3. Serves via Nginx (lightweight)

### Files to Create
**Location:** `contactapp/Dockerfile`

```dockerfile
# ============================================
# Stage 1: Build Stage
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY public public
COPY src src

# Build React app for production
RUN npm run build

# ============================================
# Stage 2: Runtime Stage (Nginx)
# ============================================
FROM nginx:alpine

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built React app to Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Supporting File: Nginx Configuration

**Location:** `contactapp/nginx.conf`

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/atom+xml image/svg+xml;

    # API Proxy Configuration
    upstream api_backend {
        server api:8080;
    }

    server {
        listen 3000;
        server_name _;

        # Serve React static files
        location / {
            root /usr/share/nginx/html;
            index index.html index.htm;
            
            # SPA routing: redirect 404s to index.html
            try_files $uri $uri/ /index.html;
        }

        # API proxy: route requests to backend container
        location /api/ {
            proxy_pass http://api_backend/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

### What The Frontend Does
- **Stage 1 (builder):** Installs npm dependencies and builds React
- **Stage 2 (Nginx):** Serves the production build
- **SPA Routing:** Redirects 404s to index.html for React Router
- **API Proxy:** Routes `/api/*` requests to backend container
- **Health check:** Verifies Nginx is running

---

## Step 3: Create Docker Compose File

### Objective
Create orchestration file that:
1. Defines all three services (db, api, frontend)
2. Sets up networking
3. Manages volumes and environment variables
4. Handles startup dependencies

### Files to Create
**Location:** `ContactApp/docker-compose.yml`

```yaml
version: '3.8'

services:
  # ============================================
  # PostgreSQL Database Service
  # ============================================
  db:
    image: postgres:15-alpine
    container_name: contactapp-db
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: administrator
      POSTGRES_DB: contactapi
      POSTGRES_INITDB_ARGS: "--encoding=UTF8"
    ports:
      - "5432:5432"
    volumes:
      # Named volume for persistent data
      - postgres_data:/var/lib/postgresql/data
      # Optional: mounting initialization scripts
      # - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - docker-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    restart: unless-stopped

  # ============================================
  # Spring Boot API Service
  # ============================================
  api:
    build:
      context: ./contactapi
      dockerfile: Dockerfile
    container_name: contactapp-api
    depends_on:
      db:
        condition: service_healthy
    environment:
      # Database connection
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/contactapi
      SPRING_DATASOURCE_USERNAME: admin
      SPRING_DATASOURCE_PASSWORD: administrator
      SPRING_DATASOURCE_DRIVER_CLASS_NAME: org.postgresql.Driver
      
      # JPA/Hibernate configuration
      SPRING_JPA_GENERATE_DDL: "true"
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT: org.hibernate.dialect.PostgreSQLDialect
      SPRING_JPA_SHOW_SQL: "false"
      SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL: "true"
      
      # File upload configuration
      SPRING_SERVLET_MULTIPART_MAX_FILE_SIZE: 100MB
      SPRING_SERVLET_MULTIPART_MAX_REQUEST_SIZE: 100MB
      
      # Server port
      SERVER_PORT: 8080
      
      # Logging
      LOGGING_LEVEL_ROOT: INFO
      LOGGING_LEVEL_CONTACTAPI: DEBUG
    ports:
      - "8080:8080"
    volumes:
      # Volume for persistent photo storage
      - contact_photos:/app/photos
    networks:
      - docker-net
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080/contacts"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    restart: unless-stopped

  # ============================================
  # React Frontend Service
  # ============================================
  frontend:
    build:
      context: ./contactapp
      dockerfile: Dockerfile
    container_name: contactapp-frontend
    depends_on:
      api:
        condition: service_healthy
    ports:
      - "3000:3000"
    networks:
      - docker-net
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 20s
    restart: unless-stopped
    environment:
      # Optional: React environment variables
      REACT_APP_API_URL: http://api:8080

# ============================================
# Networks
# ============================================
networks:
  docker-net:
    driver: bridge

# ============================================
# Named Volumes
# ============================================
volumes:
  postgres_data:
    driver: local
  contact_photos:
    driver: local
```

### Understanding the Configuration

**Database Service (db)**
- PostgreSQL 15 Alpine (lightweight)
- Environment variables set database credentials
- `postgres_data` volume ensures data persists after container stops
- Health check verifies database is ready
- Other services wait for this to be healthy

**API Service (api)**
- Builds from `./contactapi/Dockerfile`
- Depends on database health check
- Environment variables override `application.yml`
- Maps port 8080 to host machine
- Health check verifies API endpoint is responding
- Photo volume persists uploaded images

**Frontend Service (frontend)**
- Builds from `./contactapp/Dockerfile`
- Depends on API health check
- Maps port 3000 to host machine
- Health check verifies Nginx is running

**Networks**
- All services on `docker-net` bridge network
- Services communicate via service names (dns): `db`, `api`, `frontend`
- Example: `http://api:8080` resolves inside containers

**Volumes**
- `postgres_data`: Persists PostgreSQL databases
- `contact_photos`: Persists uploaded contact photos

---

## Step 4: Configure Environment Variables

### Objective
Move hardcoded database credentials out of `application.yml` and into Docker Compose environment variables.

### Modify Backend Configuration

**File to Edit:** `contactapi/src/main/resources/application.yml`

Replace the current database configuration section:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/contactapi
    username: admin
    password: administrator
```

With environment variable references:
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/contactapi}
    username: ${SPRING_DATASOURCE_USERNAME:admin}
    password: ${SPRING_DATASOURCE_PASSWORD:administrator}
    driver-class-name: ${SPRING_DATASOURCE_DRIVER_CLASS_NAME:org.postgresql.Driver}
  jpa:
    generate-ddl: ${SPRING_JPA_GENERATE_DDL:true}
    show-sql: ${SPRING_JPA_SHOW_SQL:false}
    hibernate:
      ddl-auto: ${SPRING_JPA_HIBERNATE_DDL_AUTO:update}
    properties:
      hibernate:
        globally_quoted_identifiers: true
        dialect: ${SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT:org.hibernate.dialect.PostgreSQLDialect}
        format_sql: ${SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL:true}
  servlet:
    multipart:
      enabled: true
      max-file-size: ${SPRING_SERVLET_MULTIPART_MAX_FILE_SIZE:1000MB}
      max-request-size: ${SPRING_SERVLET_MULTIPART_MAX_REQUEST_SIZE:1000MB}
  mvc:
    async:
      request-timeout: 3600000
      
server:
  port: ${SERVER_PORT:8080}
  error:
    path: /user/error
    whitelabel:
      enabled: false
```

### Why Use Environment Variables?
- Configuration is separate from code
- Easy to change for different environments (dev, staging, prod)
- Docker Compose automatically injects values
- Secrets can be managed externally in production
- Default values provided with `:` syntax

---

## Step 5: Update Frontend API Configuration

### Objective
Change hardcoded `localhost:8080` to dynamic API URL that works inside Docker containers.

### Modify Frontend API Service

**File to Edit:** `contactapp/src/api/ContactService.js`

Change from:
```javascript
const API_URL = 'http://localhost:8080/contacts';
```

To:
```javascript
// Use environment variable if available, fallback to localhost for local development
const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/contacts`
  : 'http://localhost:8080/contacts';
```

### Why This Approach?
- Inside Docker containers, `localhost:8080` won't work
- Service name `api:8080` resolves via Docker DNS
- Build process injects `REACT_APP_API_URL` from docker-compose.yml
- During local development (non-Docker), falls back to localhost
- Environment variable pattern is React standard practice

### Alternative: Update Nginx Proxy

If you prefer not to modify React code, configure Nginx to proxy API requests (already configured in `nginx.conf` from Step 2):

The nginx.conf includes:
```nginx
location /api/ {
    proxy_pass http://api_backend/;
    # ... proxy configuration
}
```

Then in React, use relative paths:
```javascript
const API_URL = '/api/contacts';
```

**Choose One Approach:**
1. **Environment Variable Method** (recommended): More flexible, works in all deployments
2. **Nginx Proxy Method**: Simpler for frontend, ops handles routing

---

## Step 6: Create Health Check Scripts

### Objective
Create utility scripts to verify all services are running and interconnected properly.

### Backend Health Check

**File to Create:** `contactapi/src/main/java/contactapi/health/HealthController.java`

```java
package contactapi.health;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Value("${spring.datasource.url:unknown}")
    private String dbUrl;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "ContactAPI");
        health.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(health);
    }

    @GetMapping("/health/ready")
    public ResponseEntity<Map<String, String>> ready() {
        Map<String, String> ready = new HashMap<>();
        ready.put("status", "READY");
        ready.put("database", "connected");
        ready.put("database_url", dbUrl);
        return ResponseEntity.ok(ready);
    }
}
```

### Docker Compose Validation Script

**File to Create:** `validate-setup.sh`

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "   Docker Compose Setup Validator"
echo "=========================================="
echo ""

# Check Docker
echo -n "✓ Checking Docker installation... "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    exit 1
fi

# Check Docker Compose
echo -n "✓ Checking Docker Compose installation... "
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    exit 1
fi

# Check file structure
echo ""
echo "Verifying project structure..."
files=(
    "contactapi/Dockerfile"
    "contactapi/pom.xml"
    "contactapp/Dockerfile"
    "contactapp/nginx.conf"
    "contactapp/package.json"
    "docker-compose.yml"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file (MISSING)"
    fi
done

# Check ports
echo ""
echo "Checking if required ports are available..."
ports=(3000 5432 8080)
for port in "${ports[@]}"; do
    if ! nc -z localhost $port 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} Port $port is available"
    else
        echo -e "  ${YELLOW}⚠${NC} Port $port is in use"
    fi
done

echo ""
echo -e "${GREEN}Setup validation complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Run: docker-compose build"
echo "  2. Run: docker-compose up"
echo "  3. Access frontend at http://localhost:3000"
echo "  4. Access API at http://localhost:8080"
```

### Connection Test Script

**File to Create:** `test-connection.sh`

```bash
#!/bin/bash

# Test all service connections after docker-compose up

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=========================================="
echo "   Service Connection Tester"
echo "=========================================="
echo ""

# Wait for services to be ready
echo "Waiting for services to stabilize (30 seconds)..."
sleep 30

# Test Database
echo -n "Testing PostgreSQL connection... "
if docker exec contactapp-db pg_isready -U admin &> /dev/null; then
    echo -e "${GREEN}✓ Connected${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

# Test API
echo -n "Testing API health endpoint... "
API_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:8080/contacts)
if [ "$API_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ Responding (HTTP $API_RESPONSE)${NC}"
else
    echo -e "${YELLOW}⚠ Got HTTP $API_RESPONSE${NC}"
fi

# Test Frontend
echo -n "Testing Frontend availability... "
FRONTEND_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:3000)
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ Running (HTTP $FRONTEND_RESPONSE)${NC}"
else
    echo -e "${YELLOW}⚠ Got HTTP $FRONTEND_RESPONSE${NC}"
fi

# Test API from Frontend container
echo -n "Testing API access from Frontend container... "
API_FROM_FE=$(docker exec contactapp-frontend wget --quiet --tries=1 -O /dev/null -w "%{http_code}" http://api:8080/contacts 2>/dev/null)
if [ "$API_FROM_FE" = "200" ]; then
    echo -e "${GREEN}✓ Frontend can reach API${NC}"
else
    echo -e "${RED}✗ Frontend cannot reach API${NC}"
fi

# Test Database from API container
echo -n "Testing Database access from API container... "
DB_FROM_API=$(docker exec contactapp-api wget --quiet --tries=1 -O /dev/null -w "%{http_code}" http://db:5432 2>/dev/null)
if docker exec contactapp-api pg_isready -h db -U admin &> /dev/null; then
    echo -e "${GREEN}✓ API can reach Database${NC}"
else
    echo -e "${RED}✗ API cannot reach Database${NC}"
fi

echo ""
echo "=========================================="
echo "   Test Summary"
echo "=========================================="
echo "Frontend URL: http://localhost:3000"
echo "API URL: http://localhost:8080"
echo "PostgreSQL: localhost:5432"
echo ""
echo "Credentials:"
echo "  DB User: admin"
echo "  DB Pass: administrator"
```

### Make Scripts Executable
```bash
chmod +x validate-setup.sh test-connection.sh
```

---

## Step 7: Build and Test

### Part A: Pre-Build Validation

```bash
# Navigate to project root
cd /Users/dreamer/Documents/Development/ContactApp

# Run validation script
./validate-setup.sh
```

### Part B: Build Docker Images

```bash
# Build all services (this will take 5-10 minutes first time)
docker-compose build

# View build progress
# Maven compile phase: ~2-3 minutes
# React build phase: ~2-3 minutes
# Docker image creation: ~1 minute
```

### What `docker-compose build` Does
1. Reads `docker-compose.yml`
2. For each service with `build:` section:
   - Runs Dockerfile
   - Stage 1: Maven downloads dependencies, compiles code
   - Stage 2: Creates runtime images
   - Stage 3: React builds for production

### Part C: Start Services

```bash
# Start all services in foreground (see logs)
docker-compose up

# Or start in background
docker-compose up -d

# View logs if running in background
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f db
```

### Expected Output Sequence
```
db_1        | LOG:  database system is ready to accept connections
api_1       | Started Application in 15.234 seconds
frontend_1  | 2024/04/08 10:25:30 [notice] 1#1: signal process started
```

### Part D: Run Connection Tests

```bash
# While services are running (in another terminal)
./test-connection.sh
```

### Part E: Manual Verification

**Test Frontend:**
```bash
curl -I http://localhost:3000
# Expected: HTTP/1.1 200 OK
```

**Test API:**
```bash
curl http://localhost:8080/contacts
# Expected: JSON array of contacts (likely empty initially)
```

**Test Database:**
```bash
# From DB container
docker exec contactapp-db psql -U admin -d contactapi -c "SELECT version();"
```

**Test Frontend → API Communication:**
1. Open browser: `http://localhost:3000`
2. Open Developer Tools (F12)
3. Go to Network tab
4. Interact with the app (add a contact, view contacts)
5. Verify API calls show in Network tab with 200 status codes

### Part F: Full Integration Test

**Create a Contact via API:**
```bash
curl -X POST http://localhost:8080/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234"
  }'
```

**View Contacts:**
```bash
curl http://localhost:8080/contacts
```

**In Frontend UI:**
1. Navigate to contacts list
2. Verify the contact you just created appears
3. Try adding a new contact through the UI
4. Verify it appears in API response

---

## Troubleshooting Guide

### Container Won't Start

**Symptom:** `docker-compose up` shows errors but doesn't start

**Diagnose:**
```bash
# Check service status
docker-compose ps

# View detailed logs
docker-compose logs

# Check specific service error
docker-compose logs api
```

**Common Issues:**

1. **Port Already in Use**
   ```
   Error: bind: address already in use
   ```
   - Check what's using the port: `lsof -i :8080`
   - Stop that service or change port in docker-compose.yml
   - Try: `PORT=9090 docker-compose up`

2. **Dockerfile Not Found**
   ```
   Error: build context /path/to/contactapi does not contain a Dockerfile
   ```
   - Verify Dockerfile path matches `dockerfile:` in docker-compose.yml
   - Check file naming (case-sensitive on Mac/Linux)

3. **Maven Build Fails**
   ```
   ERROR Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin
   ```
   - Check pom.xml Java version matches `<java.version>25</java.version>`
   - Verify all dependencies download: `docker-compose build --no-cache`
   - Check internet connection for artifact download

### Database Connection Issues

**Symptom:** API starts but immediately stops or shows DB errors

**Diagnose:**
```bash
# Check if DB container is running
docker ps | grep db

# Test DB from API container
docker exec contactapp-api pg_isready -h db -U admin -p 5432

# View DB logs
docker-compose logs db
```

**Common Issues:**

1. **API Starts Before DB is Ready**
   - Solution: `depends_on: db: condition: service_healthy` in docker-compose.yml
   - This waits for healthcheck before starting API

2. **Authentication Failed**
   - Verify docker-compose.yml has matching credentials
   - Check `SPRING_DATASOURCE_USERNAME` matches `POSTGRES_USER`

3. **Database Not Found**
   - Verify `POSTGRES_DB: contactapi` in docker-compose.yml
   - Verify `SPRING_DATASOURCE_URL` includes database name

### Frontend Can't Reach API

**Symptom:** Frontend loads but shows errors like "Cannot connect to API" or network failures in dev tools

**Diagnose:**
```bash
# Test from frontend container
docker exec contactapp-frontend wget -O- http://api:8080/contacts

# Check network
docker network ls

# Inspect network
docker network inspect contactapp_docker-net
```

**Common Issues:**

1. **Hardcoded localhost in Frontend**
   - Solution: Use service name `api:8080` instead of `localhost:8080`
   - See Step 5 for proper configuration

2. **API Not Ready**
   - Wait 30-40 seconds for API to start
   - Check API logs: `docker-compose logs api`
   - Verify API health: `curl http://localhost:8080/contacts`

3. **Wrong Port in Frontend Config**
   - API runs on port 8080 inside container (not 9000 or other)
   - Frontend connects to `http://api:8080`, not `http://api:3000`

### React Build Issues

**Symptom:** Frontend container exits or fails to build

**Diagnose:**
```bash
# View build logs
docker-compose build --no-cache frontend

# Check Node version in base image
docker run node:20-alpine node --version
```

**Common Issues:**

1. **npm install Fails**
   - Problem: Missing .npmrc or invalid package.json
   - Solution: `npm ci` (clean install) in Dockerfile
   - Verify package.json syntax

2. **React Build Fails**
   - Run locally first: `cd contactapp && npm install && npm run build`
   - Fix errors before containerizing

3. **Nginx Config Errors**
   - Verify nginx.conf syntax: `docker run -it nginx nginx -t`
   - Check file permissions

### Performance Issues

**Symptom:** Services run but are very slow or unresponsive

**Diagnose:**
```bash
# Check container resource usage
docker stats

# Check disk space
docker system df

# Check memory
docker inspect contactapp-api | grep -i memory
```

**Solutions:**

1. **Increase Docker Resources**
   - Docker Desktop → Preferences → Resources
   - Increase CPU and Memory allocation

2. **Clean Up Old Images/Volumes**
   ```bash
   docker system prune -a
   docker volume prune
   ```

3. **Rebuild Without Cache**
   ```bash
   docker-compose build --no-cache
   ```

### Viewing Logs

**All Services:**
```bash
docker-compose logs
```

**Follow All Logs (real-time):**
```bash
docker-compose logs -f
```

**Specific Service (last 100 lines):**
```bash
docker-compose logs --tail=100 api
```

**Specific Service (real-time):**
```bash
docker-compose logs -f frontend
```

**Container Shell Access (debugging):**
```bash
# Access API container shell
docker exec -it contactapp-api /bin/bash

# Access DB container shell
docker exec -it contactapp-db /bin/bash

# Inside API container, check logs
cat logs/application.log
```

---

## Management Commands Reference

### Start/Stop Services

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Restart services
docker-compose restart

# Restart specific service
docker-compose restart api
```

### View Status

```bash
# Show running containers
docker-compose ps

# Show all container info
docker-compose ps -a

# View container resource usage
docker stats
```

### Rebuild & Redeploy

```bash
# Rebuild specific service
docker-compose build api

# Rebuild all, no cache
docker-compose build --no-cache

# Build and restart
docker-compose up -d --build

# Force rebuild and restart
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Access Containers

```bash
# Open bash/shell in container
docker exec -it contactapp-api bash

# Run command in container
docker exec contactapp-api ls /app

# View environment variables
docker exec contactapp-api env

# View running processes
docker exec contactapp-api ps aux
```

### Database Management

```bash
# Access PostgreSQL CLI
docker exec -it contactapp-db psql -U admin -d contactapi

# Common psql commands (inside psql):
\l              # List databases
\dt             # List tables
\d contacts     # Describe table structure
SELECT * FROM contacts; # View data
\q              # Exit psql
```

---

## Next Steps After Successful Deployment

### 1. Environment Variables Best Practices
- Move credentials to `.env` file (not in docker-compose.yml)
  ```bash
  # Create .env file
  DB_PASSWORD=your_secure_password
  API_LOG_LEVEL=info
  ```
- Reference in docker-compose.yml: `${DB_PASSWORD}`
- Add `.env` to `.gitignore`

### 2. Production Considerations
- Use specific image versions (not `latest`)
- Implement proper logging (centralized logging stack)
- Add monitoring (Prometheus, Grafana)
- Set resource limits in docker-compose.yml
- Use secrets management for sensitive data
- Implement backup strategy for PostgreSQL volume

### 3. CI/CD Integration
- Add `.gitlab-ci.yml` or GitHub Actions workflow
- Auto-build and push images on commits
- Run tests in pipeline
- Deploy to staging/production automatically

### 4. Local Development Alternative
- Keep docker-compose for production simulation
- Use `docker-compose -f docker-compose.dev.yml up` for hot-reload development
- Volumes for source code in dev setup
- Skip rebuild for faster iteration

---

## Summary of Files to Create/Modify

### Files to Create (NEW)
- [ ] `contactapi/Dockerfile`
- [ ] `contactapp/Dockerfile`
- [ ] `contactapp/nginx.conf`
- [ ] `docker-compose.yml` (in project root)
- [ ] `validate-setup.sh`
- [ ] `test-connection.sh`
- [ ] `contactapi/src/main/java/contactapi/health/HealthController.java` (optional)

### Files to Modify (EXISTING)
- [ ] `contactapi/src/main/resources/application.yml` (add env var references)
- [ ] `contactapp/src/api/ContactService.js` (update API URL)

### Files to Add to .gitignore
- [ ] `.env` (when added for secrets)
- [ ] `target/` (Maven build output)
- [ ] `build/` (React build output)
- [ ] `postgres_data/` (local volume)
- [ ] `contact_photos/` (local volume)

---

## Quick Reference: Complete Workflow

```bash
# 1. Clone/prepare workspace
cd /Users/dreamer/Documents/Development/ContactApp

# 2. Create all Dockerfiles and configs
# (Follow Steps 1-6 of this guide)

# 3. Validate setup
./validate-setup.sh

# 4. Build images
docker-compose build

# 5. Start services
docker-compose up -d

# 6. Test connectivity
./test-connection.sh

# 7. Access services
open http://localhost:3000  # Frontend
curl http://localhost:8080/contacts  # API
```

---

## Key Takeaways

1. **Multi-Container Architecture**: Database, API, and Frontend run independently but communicate via Docker network
2. **Service Dependencies**: Frontend waits for API, API waits for Database (via healthchecks)
3. **Environment Configuration**: Move hardcoded values to docker-compose.yml environment variables
4. **Persistent Storage**: Volumes preserve database data and uploaded files across restarts
5. **Health Checks**: Enable Docker to verify services are ready before starting dependent services
6. **Networking**: Container names become DNS hostnames (e.g., `http://api:8080`)
7. **Hot Reload**: Volumes enable code changes without rebuild (in dev setups)
8. **Production Ready**: Multi-stage builds minimize image sizes; Alpine Linux reduces overhead

---

**Document Generated:** April 8, 2026
**Last Updated:** Based on current project structure
**Version:** 1.0

