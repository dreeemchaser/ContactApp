# Deployment Guide

## Prerequisites

### System Requirements
- **Java**: OpenJDK 25 or Oracle JDK 25
- **Maven**: 3.6.3 or higher
- **Database**: PostgreSQL 12 or higher
- **Memory**: Minimum 512MB RAM, recommended 1GB+
- **Disk**: 500MB free space for application and logs

### Environment Setup
```bash
# Install Java 25
# macOS with Homebrew
brew install openjdk@25

# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-25-jdk maven postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install java-25-openjdk maven postgresql-server postgresql-contrib
```

## Local Development Deployment

### 1. Database Setup
```bash
# Start PostgreSQL service
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Create database and user
sudo -u postgres psql
```

```sql
CREATE DATABASE contactapi;
CREATE USER contactapi_user WITH ENCRYPTED PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE contactapi TO contactapi_user;
ALTER USER contactapi_user CREATEDB;
\q
```

### 2. Application Configuration
Update `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/contactapi
    username: contactapi_user
    password: secure_password_here
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false  # Set to false in production
```

### 3. Build and Run
```bash
# Clone repository
git clone <repository-url>
cd contactapi

# Build application
mvn clean package -DskipTests

# Run locally
java -jar target/contactapi-0.0.1-SNAPSHOT.jar
```

### 4. Verify Deployment
```bash
# Check if application is running
curl http://localhost:8080/actuator/health

# Test API endpoint
curl http://localhost:8080/contacts?page=0&size=10
```

## Production Deployment Options

### Option 1: JAR Deployment

#### Build Production JAR
```bash
mvn clean package -DskipTests -Pproduction
```

#### Systemd Service (Linux)
Create `/etc/systemd/system/contactapi.service`:

```ini
[Unit]
Description=Contact API Service
After=network.target postgresql.service

[Service]
Type=simple
User=contactapi
Environment=JAVA_HOME=/usr/lib/jvm/java-25-openjdk-amd64
Environment=SPRING_PROFILES_ACTIVE=prod
ExecStart=/usr/bin/java -jar /opt/contactapi/contactapi-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable contactapi
sudo systemctl start contactapi
sudo systemctl status contactapi
```

#### Production Configuration
Create `application-prod.yml`:

```yaml
spring:
  profiles:
    active: prod
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/contactapi}
    username: ${DB_USERNAME:contactapi_user}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: false
  servlet:
    multipart:
      max-file-size: 10MB  # Reduce for production
      max-request-size: 10MB

server:
  port: ${PORT:8080}
  error:
    include-message: never
    include-binding-errors: never

logging:
  level:
    root: INFO
    contactapi: DEBUG
  file:
    name: logs/contactapi.log
  logback:
    rollingpolicy:
      max-file-size: 10MB
      max-history: 30
```

### Option 2: Docker Deployment

#### Dockerfile
```dockerfile
FROM eclipse-temurin:25-jdk-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Create app user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copy JAR file
COPY target/contactapi-0.0.1-SNAPSHOT.jar app.jar

# Change ownership
RUN chown appuser:appgroup app.jar

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  contactapi:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DATABASE_URL=jdbc:postgresql://postgres:5432/contactapi
      - DB_USERNAME=contactapi_user
      - DB_PASSWORD=secure_password
    depends_on:
      - postgres
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=contactapi
      - POSTGRES_USER=contactapi_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Build and Run
```bash
# Build image
docker build -t contactapi .

# Run with docker-compose
docker-compose up -d

# Check logs
docker-compose logs -f contactapi
```

### Option 3: Cloud Deployment

#### Heroku
1. Create Heroku app
2. Add PostgreSQL add-on
3. Set environment variables:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=<heroku-postgres-url>
   ```
4. Deploy JAR or use Heroku Maven plugin

#### AWS Elastic Beanstalk
1. Package application with `Procfile`
2. Create Elastic Beanstalk environment
3. Configure RDS PostgreSQL
4. Deploy JAR file

#### Azure App Service
1. Create Web App
2. Configure PostgreSQL database
3. Deploy JAR or use Azure Maven plugin

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `jdbc:postgresql://localhost:5432/contactapi` |
| `DB_USERNAME` | Database username | `contactapi_user` |
| `DB_PASSWORD` | Database password | Required |
| `PORT` | Server port | `8080` |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `default` |
| `JAVA_OPTS` | JVM options | `-Xmx512m -Xms256m` |

## Monitoring and Maintenance

### Health Checks
```bash
# Application health
curl http://localhost:8080/actuator/health

# Metrics
curl http://localhost:8080/actuator/metrics

# Info
curl http://localhost:8080/actuator/info
```

### Log Management
```bash
# View logs
journalctl -u contactapi -f  # systemd
docker-compose logs -f contactapi  # Docker

# Log rotation (logback.xml)
<appender name="ROLLING" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>logs/contactapi.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <fileNamePattern>logs/contactapi.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
        <maxFileSize>10MB</maxFileSize>
        <maxHistory>30</maxHistory>
    </rollingPolicy>
</appender>
```

### Backup Strategy
```bash
# Database backup
pg_dump contactapi > contactapi_backup_$(date +%Y%m%d).sql

# File backup (if using local storage)
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

### Scaling Considerations
- **Horizontal Scaling**: Stateless design supports multiple instances
- **Database**: Use connection pooling, consider read replicas
- **File Storage**: Migrate to cloud storage (S3, Azure Blob) for scalability
- **Load Balancing**: Use nginx, AWS ALB, or Azure Front Door

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify credentials
   - Ensure PostgreSQL is running

2. **Port Already in Use**
   ```bash
   lsof -i :8080
   kill -9 <PID>
   ```

3. **Out of Memory**
   - Increase JVM heap size
   - Monitor with `jstat -gc <pid>`

4. **File Upload Issues**
   - Check disk space
   - Verify file permissions
   - Check multipart configuration

### Performance Tuning
```bash
# JVM tuning
JAVA_OPTS="-Xmx1g -Xms512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

# Database tuning
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```