# Contact API

Spring Boot REST API for managing contacts with photo upload, backed by PostgreSQL.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Language | Java 25 |
| Framework | Spring Boot 3.5.13 |
| Persistence | Spring Data JPA + Hibernate |
| Database | PostgreSQL 15 |
| Build Tool | Maven |
| Utilities | Lombok |
| API Docs | SpringDoc OpenAPI (Swagger) |

## Project Structure

```
contactapi/
├── src/main/java/contactapi/
│   ├── Application.java
│   ├── config/
│   │   ├── Config.java                  # CORS configuration
│   │   └── OpenApiConfiguration.java    # Swagger setup
│   ├── constant/
│   │   └── Constant.java                # PHOTO_DIRECTORY, headers
│   ├── controller/
│   │   ├── ContactController.java       # REST endpoints
│   │   └── HealthController.java        # Health check endpoint
│   ├── domain/
│   │   └── Contact.java                 # JPA entity
│   ├── repository/
│   │   └── ContactRepository.java       # JPA repository
│   └── service/
│       └── ContactService.java          # Business logic
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

1. Ensure PostgreSQL is running with a `contactapi` database
2. Update credentials in `src/main/resources/application.yml` if needed
3. Run:
   ```bash
   ./mvnw spring-boot:run
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts` | List contacts (paginated) |
| GET | `/contacts/{id}` | Get single contact |
| POST | `/contacts` | Create contact |
| PUT | `/contacts/photo` | Upload contact photo |
| GET | `/contacts/image/{filename}` | Get contact photo |

See [docs/api.md](docs/api.md) for full request/response details.

## Environment Variables

All config is driven by environment variables with local fallback defaults:

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | PostgreSQL URL | `jdbc:postgresql://localhost:5432/contactapi` |
| `SPRING_DATASOURCE_USERNAME` | DB username | `admin` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | `administrator` |
| `PHOTO_DIRECTORY` | Photo storage path | `~/downloads/uploads/` |
| `SERVER_PORT` | Server port | `8080` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hibernate DDL mode | `update` |

## Photo Storage

Photos are stored at the path defined by `PHOTO_DIRECTORY`:
- Docker: `/app/photos/` (mapped to `contact_photos` volume)
- Local: `~/downloads/uploads/`

## Building

```bash
# Build JAR
./mvnw clean package -DskipTests

# Run JAR directly
java -jar target/contactapi-0.0.1-SNAPSHOT.jar
```

## Documentation

- [API Reference](docs/api.md)
- [Architecture](docs/architecture.md)
- [Deployment](docs/deployment.md)
- [Development](docs/development.md)
- [Security](docs/security.md)
- [Performance](docs/performance.md)
