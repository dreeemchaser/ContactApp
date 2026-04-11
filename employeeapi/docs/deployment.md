# Deployment Guide

## Docker Deployment (Primary)

The recommended way to run the full stack is via Docker Compose from the project root.

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Start All Services

```bash
docker-compose up --build
```

| Service   | URL |
|-----------|-----|
| Frontend  | http://localhost:3000 |
| API       | http://localhost:8080 |
| Swagger   | http://localhost:8080/swagger-ui.html |

### Stop Services

```bash
# Stop containers
docker-compose down

# Stop and remove all volumes (deletes DB data and photos)
docker-compose down -v
```

### Rebuild After Code Changes

```bash
docker-compose up --build
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f db
```

---

## Service Architecture

```
frontend (Nginx:3000) → api (Spring Boot:8080) → db (PostgreSQL:5432)
```

All services communicate over the `docker-net` bridge network. Service names resolve as DNS hostnames inside containers (e.g. `http://api:8080`).

### Volumes
- `postgres_data` — persists PostgreSQL data
- `contact_photos` — persists uploaded contact photos at `/app/photos/`

---

## Environment Variables

Configured in `docker-compose.yml`. Key variables:

| Variable | Value in Docker |
|----------|----------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://db:5432/contactapi` |
| `SPRING_DATASOURCE_USERNAME` | `admin` |
| `SPRING_DATASOURCE_PASSWORD` | `administrator` |
| `PHOTO_DIRECTORY` | `/app/photos/` |
| `REACT_APP_API_URL` | `http://localhost:8080` (build arg) |

---

## Local Development (Without Docker)

### Backend

1. Ensure PostgreSQL is running locally on port 5432 with a `contactapi` database
2. Run:
   ```bash
   cd contactapi
   ./mvnw spring-boot:run
   ```

### Frontend

```bash
cd contactapp
npm install
npm start
```

> Hot reload is active in local dev mode. In Docker, changes require `docker-compose up --build`.

---

## Building the Backend JAR

```bash
cd contactapi
./mvnw clean package -DskipTests
java -jar target/contactapi-0.0.1-SNAPSHOT.jar
```

---

## Troubleshooting

**Port already in use:**
```bash
lsof -i :8080
lsof -i :3000
```

**API not starting (DB not ready):**  
The API depends on the DB health check. Wait for `pg_isready` to pass or check DB logs:
```bash
docker-compose logs db
```

**Frontend showing stale data:**  
React is served as a production build. Always rebuild after frontend changes:
```bash
docker-compose up --build
```

**Access PostgreSQL directly:**
```bash
docker exec -it contactapp-db psql -U admin -d contactapi
```
