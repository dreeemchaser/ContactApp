# Contact API

A production-ready RESTful API for managing contacts with photo upload capabilities, built with **Spring Boot 3**, **Spring Data JPA**, and **PostgreSQL**.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Contact API provides a comprehensive RESTful interface for managing contact records with photo upload functionality. It follows clean architecture principles, implements proper error handling, and is designed for production deployment with monitoring and security considerations.

---

## Features

- ✅ Full CRUD operations for contacts
- ✅ Photo upload and retrieval
- ✅ Pagination support
- ✅ Input validation
- ✅ Error handling with proper HTTP status codes
- ✅ Spring Boot Actuator for monitoring
- ✅ PostgreSQL database integration
- ✅ Docker support
- ✅ Production-ready configuration

---

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Language | Java | 25 |
| Framework | Spring Boot | 3.5.13 |
| Persistence | Spring Data JPA + Hibernate | - |
| Database | PostgreSQL | 12+ |
| Build Tool | Maven | 3.6+ |
| Utilities | Lombok | - |
| Testing | JUnit 5 + Spring Boot Test | - |
| Documentation | Markdown | - |

---

## Prerequisites

- **Java 25+** — [Download OpenJDK](https://adoptium.net/)
- **PostgreSQL 12+** — [Download](https://www.postgresql.org/download/)
- **Maven 3.6+** — [Download](https://maven.apache.org/) or use included wrapper

---

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd contactapi

# Start PostgreSQL and create database
createdb contactapi
```

### 2. Configure Database

Update `src/main/resources/application.yml` with your database credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/contactapi
    username: your_username
    password: your_password
```

### 3. Run the Application

```bash
# Using Maven wrapper (recommended)
./mvnw spring-boot:run

# Or using system Maven
mvn spring-boot:run
```

### 4. Verify Installation

```bash
# Check health endpoint
curl http://localhost:8080/actuator/health

# Test API
curl http://localhost:8080/contacts?page=0&size=5
```

The API will be available at `http://localhost:8080`.

---

## Configuration

### Application Configuration

The application uses `application.yml` for configuration. Key settings:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/contactapi
    username: ${DB_USERNAME:admin}
    password: ${DB_PASSWORD:administrator}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
  servlet:
    multipart:
      max-file-size: 1GB
      max-request-size: 1GB

server:
  port: ${PORT:8080}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_USERNAME` | Database username | admin |
| `DB_PASSWORD` | Database password | administrator |
| `PORT` | Server port | 8080 |
| `SPRING_PROFILES_ACTIVE` | Active profile | default |

### Production Profile

For production, create `application-prod.yml`:

```yaml
spring:
  profiles:
    active: prod
  jpa:
    hibernate:
      ddl-auto: validate
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5

logging:
  level:
    root: INFO
  file:
    name: logs/contactapi.log
```

---

## API Documentation

### Base URL
```
http://localhost:8080/contacts
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts` | List contacts (paginated) |
| GET | `/contacts/{id}` | Get single contact |
| POST | `/contacts` | Create new contact |
| PUT | `/contacts/photo` | Upload contact photo |
| GET | `/contacts/image/{filename}` | Get contact photo |

### Example Usage

```bash
# Create a contact
curl -X POST http://localhost:8080/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# List contacts
curl "http://localhost:8080/contacts?page=0&size=10"

# Upload photo
curl -X PUT http://localhost:8080/contacts/photo \
  -F "id=<contact-id>" \
  -F "file=@photo.jpg"
```

For complete API documentation, see [docs/api.md](docs/api.md).

---

## Project Structure

```
contactapi/
├── src/
│   ├── main/
│   │   ├── java/contactapi/
│   │   │   ├── Application.java           # Main Spring Boot class
│   │   │   ├── constant/                  # Application constants
│   │   │   ├── controller/                # REST controllers
│   │   │   ├── domain/                    # JPA entities
│   │   │   ├── repository/                # Data repositories
│   │   │   └── service/                   # Business logic
│   │   └── resources/
│   │       ├── application.yml            # Configuration
│   │       ├── static/                    # Static resources
│   │       └── templates/                 # Thymeleaf templates
│   └── test/                              # Test classes
├── docs/                                  # Documentation
├── postman/                               # API testing collections
└── target/                                # Build output
```

---

## Development

### Building

```bash
# Clean build
./mvnw clean package

# Skip tests
./mvnw clean package -DskipTests

# Build with specific profile
./mvnw clean package -Pproduction
```

### Running Tests

```bash
# Run all tests
./mvnw test

# Run with coverage
./mvnw test jacoco:report

# Run integration tests
./mvnw verify
```

### IDE Setup

- **IntelliJ IDEA**: Import as Maven project, enable annotation processing
- **VS Code**: Install Java Extension Pack
- **Eclipse**: Import as existing Maven project

---

## Deployment

### Docker Deployment

```bash
# Build image
docker build -t contactapi .

# Run container
docker run -p 8080:8080 \
  -e DB_USERNAME=prod_user \
  -e DB_PASSWORD=secure_pass \
  contactapi
```

### JAR Deployment

```bash
# Build JAR
./mvnw clean package -DskipTests

# Run JAR
java -jar target/contactapi-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=prod
```

For detailed deployment instructions, see [docs/deployment.md](docs/deployment.md).

---

## Testing

### Unit Tests
```bash
./mvnw test
```

### Integration Tests
```bash
./mvnw integration-test
```

### API Testing
Use the Postman collection in `postman/collections/` for API testing.

---

## Monitoring

The application includes Spring Boot Actuator endpoints:

- Health: `GET /actuator/health`
- Metrics: `GET /actuator/metrics`
- Info: `GET /actuator/info`
- Environment: `GET /actuator/env`

---

## Security

**⚠️ Important**: This application currently has no authentication implemented. For production use:

- Implement JWT or OAuth2 authentication
- Add input validation and sanitization
- Configure HTTPS
- Set up proper CORS policies
- Implement rate limiting

See [docs/security.md](docs/security.md) for security recommendations.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow Google Java Style Guide
- Use Lombok for boilerplate code
- Add JavaDoc for public methods
- Write unit tests for new features
- Update documentation

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

- 📖 [Documentation](docs/)
- 🐛 [Issues](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

---

*Built with ❤️ using Spring Boot*
 
---
 
## Running Tests
 
```bash
./mvnw test
```
 
Test reports are generated in `target/surefire-reports/`.
 
---
 
## Building for Production
 
Build a runnable JAR:
 
```bash
./mvnw clean package -DskipTests
```
 
The output JAR will be at `target/contactapi-0.0.1-SNAPSHOT.jar`.
 
Run it directly:
 
```bash
java -jar target/contactapi-0.0.1-SNAPSHOT.jar
```
 
You can pass configuration overrides at runtime:
 
```bash
java -jar target/contactapi-0.0.1-SNAPSHOT.jar \
  --spring.datasource.url=jdbc:postgresql://prod-host:5432/contactapi \
  --spring.datasource.username=prod_user \
  --spring.datasource.password=prod_pass
```
 
---
 
## Contributing
 
Contributions are welcome! Please follow these steps:
 
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request
 
Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.
 
---
 
## License
 
This project is licensed under the [MIT License](LICENSE).
 
