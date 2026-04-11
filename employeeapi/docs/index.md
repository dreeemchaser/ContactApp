# Contact API Documentation

Spring Boot REST API for managing contacts with photo upload capabilities.

## Table of Contents

- [API Reference](api.md)
- [Architecture](architecture.md)
- [Deployment](deployment.md)
- [Development](development.md)
- [Security](security.md)
- [Performance](performance.md)
- [Diagrams](diagrams/)
  - [Class Diagram](diagrams/class-diagram.md)
  - [Sequence Diagram](diagrams/sequence-diagram.md)

## Quick Start

### With Docker (Recommended)

```bash
# From project root
docker-compose up --build
```

- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html

### Without Docker

```bash
cd contactapi
./mvnw spring-boot:run
```

Requires PostgreSQL running locally on port 5432 with a `contactapi` database.

## Key Features

- Full CRUD operations for contacts
- Photo upload and retrieval
- Paginated contact listing (`content` + `page` metadata)
- Environment variable driven configuration
- Swagger/OpenAPI documentation
- Spring Boot Actuator for monitoring
- Docker-ready with multi-stage build
