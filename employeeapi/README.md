# Employee API

Spring Boot REST API for the EmployeeHub HR management system, backed by PostgreSQL.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Language | Java 25 |
| Framework | Spring Boot 3.5.13 |
| Persistence | Spring Data JPA + Hibernate |
| Database | PostgreSQL 15 |
| Build Tool | Maven |
| Utilities | Lombok |
| Security | Spring Security + JWT |
| API Docs | SpringDoc OpenAPI (Swagger) |

## Project Structure

```
employeeapi/
├── src/main/java/employeehub/
│   ├── Application.java
│   ├── config/
│   │   ├── Config.java                  # CORS configuration
│   │   ├── DataSeeder.java              # Seed data on startup
│   │   └── OpenApiConfiguration.java    # Swagger setup
│   ├── constant/
│   │   └── Constant.java                # PHOTO_DIRECTORY, headers
│   ├── controller/
│   │   ├── AuthController.java          # /auth endpoints
│   │   ├── EmployeeController.java      # /employees endpoints
│   │   ├── DepartmentController.java
│   │   ├── TeamController.java
│   │   ├── LeaveController.java
│   │   ├── SalaryController.java
│   │   ├── BenefitController.java
│   │   ├── TimesheetController.java
│   │   ├── PerformanceController.java
│   │   ├── DocumentController.java
│   │   ├── NotificationController.java
│   │   ├── AuditLogController.java
│   │   └── HealthController.java
│   ├── domain/                          # JPA entities and enums
│   ├── dto/                             # Request/response DTOs
│   ├── exception/                       # Global exception handler
│   ├── repository/                      # JPA repositories
│   ├── security/                        # JWT filter, SecurityConfig
│   └── service/                         # Business logic
├── src/main/resources/
│   └── application.yml                  # Config with env var support
├── docs/                                # API and architecture docs
├── postman/                             # Postman collections
└── Dockerfile                           # Multi-stage Maven + JRE build
```

## Running with Docker (Recommended)

From the project root:

```bash
docker-compose up --build
```

API available at: **http://localhost:8080**  
Swagger UI: **http://localhost:8080/swagger-ui.html**

## Running Locally

1. Ensure PostgreSQL is running with an `employeehub` database
2. Update credentials in `src/main/resources/application.yml` if needed
3. Run:
   ```bash
   ./mvnw spring-boot:run
   ```

## API Overview

See [docs/api.md](docs/api.md) and the project-level [docs/api-contract.md](../docs/api-contract.md) for the full API reference.

| Module | Base Path |
|--------|-----------|
| Auth | `/auth` |
| Employees | `/employees` |
| Departments | `/departments` |
| Teams | `/teams` |
| Leave | `/leave` |
| Salary | `/salary` |
| Benefits | `/benefits` |
| Timesheets | `/timesheets` |
| Performance | `/performance` |
| Documents | `/documents` |
| Notifications | `/notifications` |
| Audit Log | `/audit-logs` |

## Authentication

All endpoints require `Authorization: Bearer <token>` except `/auth/register` and `/auth/login`.

```bash
# Register
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin@example.com", "password": "password123"}'

# Login — copy the token
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin@example.com", "password": "password123"}'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | PostgreSQL URL | `jdbc:postgresql://localhost:5432/employeehub` |
| `SPRING_DATASOURCE_USERNAME` | DB username | `admin` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | `administrator` |
| `PHOTO_DIRECTORY` | Photo storage path | `~/downloads/uploads/` |
| `SERVER_PORT` | Server port | `8080` |
| `JWT_SECRET` | JWT signing secret | (see application.yml) |
| `JWT_EXPIRATION` | Token expiry (ms) | `86400000` (24h) |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hibernate DDL mode | `update` |

## Photo Storage

Photos are stored at the path defined by `PHOTO_DIRECTORY`:
- Docker: `/app/photos/` (mapped to `employee_photos` volume)
- Local: `~/downloads/uploads/`

## Building

```bash
# Build JAR
./mvnw clean package -DskipTests

# Run JAR directly
java -jar target/employeeapi-0.0.1-SNAPSHOT.jar
```

## Documentation

- [API Reference](docs/api.md)
- [Architecture](docs/architecture.md)
- [Deployment](docs/deployment.md)
- [Development](docs/development.md)
- [Security](docs/security.md)
- [Performance](docs/performance.md)
