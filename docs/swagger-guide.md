# Swagger / OpenAPI Guide

Interactive API documentation is available via SpringDoc OpenAPI.

## Accessing Swagger UI

| Method | URL |
|--------|-----|
| With Docker | http://localhost:8080/swagger-ui.html |
| Local dev | http://localhost:8080/swagger-ui.html |
| OpenAPI JSON | http://localhost:8080/v3/api-docs |
| OpenAPI YAML | http://localhost:8080/v3/api-docs.yaml |

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require a JWT token.

1. Call `POST /auth/login` to obtain a token
2. Click the **Authorize** button (top right of Swagger UI)
3. Enter `Bearer <your-token>` and click Authorize

## Testing Endpoints

### Register & Login

1. Open http://localhost:8080/swagger-ui.html
2. Find `POST /auth/register` → click **Try it out**
3. Enter request body:
   ```json
   {
     "username": "admin@example.com",
     "password": "password123"
   }
   ```
4. Find `POST /auth/login` with the same credentials — copy the token from the response
5. Click **Authorize** and enter `Bearer <token>`

### Get All Employees

1. Find `GET /employees` → click **Try it out**
2. Click **Execute**

### Upload an Employee Photo

1. Find `PUT /employees/{id}/photo` → click **Try it out**
2. Enter the employee `id` (UUID)
3. Select an image file
4. Click **Execute**

## Configuration

### Dependency (`pom.xml`)
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

### Application Config (`application.yml`)
```yaml
springdoc:
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
  api-docs:
    path: /v3/api-docs
```

## Troubleshooting

**Swagger UI returns 404:**
- Confirm the API is running: `curl http://localhost:8080/actuator/health`
- Check API logs: `docker-compose logs api`
- Rebuild if needed: `docker-compose up --build`

**Endpoints not showing:**
- Swagger auto-scans on startup — no manual registration needed
- Rebuild after adding new controllers

**401 on protected endpoints:**
- Ensure you have clicked **Authorize** and entered a valid `Bearer <token>`
- Tokens expire after 24 hours — re-login to get a fresh token
