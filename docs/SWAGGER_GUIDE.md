# Swagger / OpenAPI Guide

Interactive API documentation is available via SpringDoc OpenAPI.

## Accessing Swagger UI

| Method | URL |
|--------|-----|
| With Docker | http://localhost:8080/swagger-ui.html |
| Local dev | http://localhost:8080/swagger-ui.html |
| OpenAPI JSON | http://localhost:8080/v3/api-docs |
| OpenAPI YAML | http://localhost:8080/v3/api-docs.yaml |

## Testing Endpoints

### Create a Contact

1. Open http://localhost:8080/swagger-ui.html
2. Find `POST /contacts` → click **Try it out**
3. Enter request body:
   ```json
   {
     "name": "Jane Doe",
     "email": "jane@example.com",
     "phone": "555-9876",
     "title": "Designer",
     "address": "456 Elm St",
     "status": "active"
   }
   ```
4. Click **Execute**

### Get All Contacts

1. Find `GET /contacts` → click **Try it out**
2. Set `page: 0`, `size: 10`
3. Click **Execute**

Response includes `content` array and `page` metadata:
```json
{
  "content": [...],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 6,
    "totalPages": 1
  }
}
```

### Upload a Photo

1. Find `PUT /contacts/photo` → click **Try it out**
2. Enter the contact `id` (UUID from a previous create)
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
- Confirm the API is running: `curl http://localhost:8080/contacts`
- Check API logs: `docker-compose logs api`
- Rebuild if needed: `docker-compose up --build`

**Endpoints not showing:**
- Swagger auto-scans on startup — no manual registration needed
- Rebuild after adding new controllers
