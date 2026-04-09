# Containerization Guide

This guide documents the Docker setup for the ContactApp full stack.

## Architecture

```
frontend (Nginx:3000) → api (Spring Boot:8080) → db (PostgreSQL:5432)
```

All three services run on the `docker-net` bridge network. Service names resolve as internal DNS hostnames.

## Services

### db — PostgreSQL 15

- Image: `postgres:15-alpine`
- Port: `5432`
- Volume: `postgres_data` → `/var/lib/postgresql/data`
- Health check: `pg_isready -U admin -d contactapi`

### api — Spring Boot

- Built from `contactapi/Dockerfile` (multi-stage: Maven builder + JRE Alpine runtime)
- Port: `8080`
- Volume: `contact_photos` → `/app/photos/`
- Depends on: `db` (waits for health check)
- Health check: `wget http://localhost:8080/contacts`

### frontend — React + Nginx

- Built from `contactapp/Dockerfile` (multi-stage: Node builder + Nginx runtime)
- Port: `3000`
- Depends on: `api` (waits for health check)
- Health check: `wget http://127.0.0.1:3000/health`
- `REACT_APP_API_URL` is injected at build time as a Docker build arg

## Dockerfiles

### Backend (`contactapi/Dockerfile`)

Multi-stage build:
1. Stage 1 (`builder`): Maven compiles and packages the JAR
2. Stage 2: Eclipse Temurin JRE Alpine runs the JAR

### Frontend (`contactapp/Dockerfile`)

Multi-stage build:
1. Stage 1 (`builder`): Node 20 Alpine installs deps and runs `npm run build`
   - Accepts `REACT_APP_API_URL` as a build arg
2. Stage 2: Nginx Alpine serves the production build

## Key Configuration

### Photo Directory

`Constant.java` reads `PHOTO_DIRECTORY` from the environment:
```java
System.getenv("PHOTO_DIRECTORY") != null
    ? System.getenv("PHOTO_DIRECTORY")
    : System.getProperty("user.home") + "/downloads/uploads/"
```

In Docker, `docker-compose.yml` sets `PHOTO_DIRECTORY: /app/photos/`.

### API URL in Frontend

`ContactService.js` reads `REACT_APP_API_URL` at runtime:
```js
const API_URL = process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/contacts`
    : 'http://localhost:8080/contacts';
```

This is injected at build time via `docker-compose.yml`:
```yaml
args:
  REACT_APP_API_URL: http://localhost:8080
```

## Common Commands

```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d --build

# Stop services
docker-compose down

# Stop and remove volumes (deletes all data)
docker-compose down -v

# View logs
docker-compose logs -f
docker-compose logs -f api

# Rebuild a single service
docker-compose build api

# Access PostgreSQL
docker exec -it contactapp-db psql -U admin -d contactapi

# Access API container shell
docker exec -it contactapp-api sh
```

## Volumes

| Volume | Purpose |
|--------|---------|
| `postgres_data` | Persists PostgreSQL database across restarts |
| `contact_photos` | Persists uploaded contact photos |

## Troubleshooting

**API won't start:**  
Check if DB is healthy first:
```bash
docker-compose logs db
docker-compose ps
```

**Frontend shows old code:**  
React is a production build — always rebuild:
```bash
docker-compose up --build
```

**Port conflict:**
```bash
lsof -i :8080
lsof -i :3000
lsof -i :5432
```

**Full reset:**
```bash
docker-compose down -v
docker-compose up --build
```
