# Development Guide

## Prerequisites

- Java 25
- Maven 3.6+
- PostgreSQL 12+
- Git

## Setup

1. **Install Dependencies:**
   ```bash
   # Java 25
   # Download from https://adoptium.net/

   # Maven
   brew install maven  # macOS
   # or download from https://maven.apache.org/

   # PostgreSQL
   brew install postgresql  # macOS
   brew services start postgresql
   ```

2. **Clone Repository:**
   ```bash
   git clone <repository-url>
   cd contactapi
   ```

3. **Database Setup:**
   ```sql
   createdb contactapi
   psql contactapi
   -- Create user if needed
   CREATE USER admin WITH PASSWORD 'administrator';
   GRANT ALL PRIVILEGES ON DATABASE contactapi TO admin;
   ```

4. **Build Project:**
   ```bash
   mvn clean install
   ```

5. **Run Application:**
   ```bash
   mvn spring-boot:run
   ```

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── contactapi/
│   │       ├── Application.java              # Main Spring Boot application
│   │       ├── constant/
│   │       │   └── Constant.java             # Application constants
│   │       ├── controller/
│   │       │   └── ContactController.java    # REST API endpoints
│   │       ├── domain/
│   │       │   └── Contact.java              # JPA entity
│   │       ├── repository/
│   │       │   └── ContactRepository.java    # Data access layer
│   │       └── service/
│   │           └── ContactService.java       # Business logic
│   └── resources/
│       ├── application.yml                   # Application configuration
│       ├── static/                          # Static web resources
│       └── templates/                       # Thymeleaf templates
└── test/
    └── java/
        └── contactapi/
            └── ContactapiApplicationTests.java  # Integration tests
```

## Development Workflow

### Adding New Features

1. **Database Changes:**
   - Update `Contact` entity if needed
   - Add repository methods in `ContactRepository`
   - Update service layer in `ContactService`

2. **API Changes:**
   - Add endpoints in `ContactController`
   - Update request/response DTOs
   - Add validation annotations

3. **Business Logic:**
   - Implement logic in service layer
   - Add proper error handling
   - Write unit tests

### Code Standards

- **Java Version:** Java 25
- **Style:** Google Java Style Guide
- **Annotations:** Use Lombok for boilerplate code
- **Documentation:** Add JavaDoc for public methods
- **Naming:** Follow Spring Boot conventions
- **Validation:** Use Bean Validation annotations
- **Error Handling:** Use custom exceptions with proper HTTP status codes

### Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report

# Run integration tests
mvn verify
```

### Building for Production

```bash
# Clean build
mvn clean package

# Build without tests
mvn clean package -DskipTests

# Create Docker image
docker build -t contactapi .
```

## Configuration

### Development
```yaml
spring:
  profiles:
    active: dev
  datasource:
    url: jdbc:postgresql://localhost:5432/contactapi
    username: admin
    password: administrator
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update
```

### Production
```yaml
spring:
  profiles:
    active: prod
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
```

## IDE Setup

### IntelliJ IDEA
- Import as Maven project
- Enable annotation processing for Lombok
- Install Lombok plugin

### VS Code
- Install Java Extension Pack
- Install Spring Boot Extension Pack
- Configure Java home to Java 25

## Troubleshooting

### Common Issues

1. **Port 8080 already in use:**
   ```bash
   lsof -i :8080
   kill -9 <PID>
   ```

2. **Database connection failed:**
   - Check PostgreSQL is running
   - Verify credentials in `application.yml`
   - Check database exists

3. **Build failures:**
   ```bash
   mvn clean
   mvn dependency:resolve
   ```

## Contributing

1. Create feature branch from `main`
2. Write tests for new functionality
3. Ensure all tests pass
4. Update documentation
5. Submit pull request

## CI/CD

The project includes GitHub Actions workflow for:
- Automated testing
- Code quality checks
- Security scanning
- Docker image building