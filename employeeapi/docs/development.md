# Development Guide

## Prerequisites

- Java 25
- Maven 3.6+
- PostgreSQL 12+ (for local dev without Docker)
- Docker + Docker Compose (for containerized dev)
- Node.js 20+ (for frontend local dev)

## Project Structure

```
employeeapi/src/main/java/employeehub/
├── Application.java
├── config/
│   ├── Config.java                  # CORS configuration
│   ├── DataSeeder.java              # Seed data on startup
│   └── OpenApiConfiguration.java    # Swagger/OpenAPI setup
├── constant/
│   └── Constant.java                # PHOTO_DIRECTORY, X_REQUESTED_WITH
├── controller/
│   ├── AuthController.java          # /auth endpoints
│   ├── EmployeeController.java      # /employees endpoints
│   ├── DepartmentController.java
│   ├── TeamController.java
│   ├── LeaveController.java
│   ├── SalaryController.java
│   ├── BenefitController.java
│   ├── TimesheetController.java
│   ├── PerformanceController.java
│   ├── DocumentController.java
│   ├── NotificationController.java
│   ├── AuditLogController.java
│   └── HealthController.java        # /health endpoint
├── domain/                          # JPA entities and enums
├── dto/                             # Request/response DTOs
├── exception/                       # GlobalExceptionHandler
├── repository/                      # JPA repositories
├── security/                        # JWT filter, JwtUtil, SecurityConfig
└── service/                         # Business logic per module
```

## Running the Backend

### With Docker (Recommended)

```bash
# From project root
docker-compose up --build
```

### Locally

```bash
cd employeeapi
./mvnw spring-boot:run
```

Requires PostgreSQL on `localhost:5432` with database `employeehub`, user `admin`, password `administrator`.

## Configuration

`application.yml` uses environment variables with local fallback defaults:

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/employeehub}
    username: ${SPRING_DATASOURCE_USERNAME:admin}
    password: ${SPRING_DATASOURCE_PASSWORD:administrator}
```

Override any value via environment variable — Docker Compose injects these automatically.

## Photo Storage

Controlled by `Constant.java`:
```java
public static final String PHOTO_DIRECTORY = System.getenv("PHOTO_DIRECTORY") != null
    ? System.getenv("PHOTO_DIRECTORY")
    : System.getProperty("user.home") + "/downloads/uploads/";
```

- Docker: `/app/photos/` (set via `PHOTO_DIRECTORY` env var)
- Local: `~/downloads/uploads/`

## Adding New Features

1. Add or update the domain entity in `domain/`
2. Add repository methods in the relevant `repository/` interface
3. Implement business logic in the relevant `service/`
4. Expose via the relevant `controller/`
5. Add role-based access rules in `SecurityConfig` if needed

## Building

```bash
# Build JAR
./mvnw clean package -DskipTests

# Run tests
./mvnw test
```

## IDE Setup

- IntelliJ IDEA: Import as Maven project, enable Lombok annotation processing
- VS Code: Install Java Extension Pack + Spring Boot Extension Pack

## Troubleshooting

**Port 8080 in use:**
```bash
lsof -i :8080
kill -9 <PID>
```

**Database connection failed:**
- Check PostgreSQL is running
- Verify credentials in `application.yml`
- Confirm `employeehub` database exists
