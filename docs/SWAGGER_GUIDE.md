# Swagger/OpenAPI Setup Guide

## Overview
Swagger (OpenAPI 3.0) has been integrated into the Contact API for interactive API testing and documentation.

---

## Accessing Swagger UI

### Local Development (Without Docker)
```bash
cd contactapi
./mvnw spring-boot:run
```
Then open: **http://localhost:8080/swagger-ui.html**

### With Docker Compose
```bash
docker-compose up -d
```
Then open: **http://localhost:8080/swagger-ui.html**

### Inside Docker Container
```bash
docker exec -it contactapp-api curl http://localhost:8080/swagger-ui.html
```

### Alternative URLs
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/v3/api-docs
- **OpenAPI YAML:** http://localhost:8080/v3/api-docs.yaml

---

## Features

### 1. API Documentation
- Complete endpoint description
- Request/response schemas
- Example values for each field
- Error codes and descriptions

### 2. Interactive Testing
- Test endpoints directly from the UI
- No external tools needed (no Postman required)
- View request/response bodies
- See HTTP status codes

### 3. Schema Validation
- Request body validation
- Required field indicators
- Field type documentation
- Example payloads

---

## Testing Endpoints

### Example: Create a Contact

1. **Open Swagger UI:** http://localhost:8080/swagger-ui.html
2. **Locate:** "POST /contacts" under "Contact Management" section
3. **Click:** "Try it out"
4. **Request Body:** Enter JSON:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "phone": "555-1234",
     "title": "Software Engineer",
     "address": "123 Main St",
     "status": "active"
   }
   ```
5. **Click:** "Execute"
6. **View:** Response with auto-generated ID

### Example: Get All Contacts

1. **Locate:** "GET /contacts"
2. **Click:** "Try it out"
3. **Parameters:**
   - page: 0 (default)
   - size: 10 (default)
4. **Click:** "Execute"
5. **View:** Paginated contacts response

### Example: Upload Photo

1. **Locate:** "PUT /contacts/photo"
2. **Click:** "Try it out"
3. **Parameters:**
   - id: (paste contact UUID)
   - file: (select image file)
4. **Click:** "Execute"
5. **View:** Success response

---

## API Endpoints Documented

### Contact Management

#### 1. Create Contact
- **Method:** POST
- **URL:** `/contacts`
- **Body:** Contact object (JSON)
- **Response:** 201 Created + Contact object
- **Example:** See "Example: Create a Contact" above

#### 2. Get All Contacts (Paginated)
- **Method:** GET
- **URL:** `/contacts`
- **Query Parameters:**
  - `page`: Page number (0-indexed, default: 0)
  - `size`: Records per page (default: 10)
- **Response:** 200 OK + Page of Contact objects

#### 3. Get Contact by ID
- **Method:** GET
- **URL:** `/contacts/{id}`
- **Path Parameter:** `id` (UUID)
- **Response:** 200 OK + Contact object
- **Error:** 404 Not Found

#### 4. Upload Contact Photo
- **Method:** PUT
- **URL:** `/contacts/photo`
- **Query Parameters:**
  - `id`: Contact ID (UUID)
  - `file`: Image file (JPEG, PNG, GIF)
- **Response:** 200 OK + Success message
- **Max File Size:** 100MB
- **Supported Formats:** JPEG, PNG, GIF

#### 5. Get Contact Photo
- **Method:** GET
- **URL:** `/contacts/image/{filename}`
- **Path Parameter:** `filename` (e.g., "contact_photo_123.jpg")
- **Response:** 200 OK + Image file (binary)
- **Content Types:** image/jpeg, image/png, image/gif

---

## Swagger UI Features

### Try It Out Button
- Located under each endpoint
- Allows direct testing from browser
- Pre-fills request with endpoint schema
- Shows actual HTTP values

### Response Section
- **Status Code:** HTTP response code
- **Response Body:** Actual response (JSON/XML)
- **Response Headers:** HTTP headers
- **Response Time:** Execution duration

### Schema Section
- Click schema names to expand/collapse
- View field names, types, and descriptions
- See validation rules
- Check example values

### Download/Export
- Click "DownloadAPI Specification" in top-right
- Export as JSON or YAML
- Share with team or generate clients

---

## Integration with Frontend

### Testing Frontend-API Communication
1. **Start Docker Compose:** `docker-compose up`
2. **Open Swagger:** http://localhost:8080/swagger-ui.html
3. **Test an endpoint** (e.g., POST /contacts)
4. **Open Frontend:** http://localhost:3000
5. **Verify:** New contact appears in UI
6. **Check:** Network tab in browser shows API calls

---

## Configuration Details

### What Was Added

#### 1. Dependency (pom.xml)
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

#### 2. Configuration Class (OpenApiConfiguration.java)
- Customizes API title, version, description
- Defines contact information and license
- Configures multiple server environments
- Enables API documentation

#### 3. Annotations on Endpoints
- `@Operation`: Describes what endpoint does
- `@ApiResponse`: Documents response codes and content
- `@Parameter`: Describes path/query parameters
- `@Tag`: Groups related endpoints

#### 4. Application Properties (application.yml)
```yaml
springdoc:
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
    operationsSorter: method
    tagsSorter: alpha
  api-docs:
    path: /v3/api-docs
  show-actuator: true
```

---

## Troubleshooting

### Swagger UI Not Loading
**Issue:** 404 Not Found at http://localhost:8080/swagger-ui.html

**Solutions:**
1. Verify Spring Boot is running: `curl http://localhost:8080/contacts`
2. Check logs for errors: `docker-compose logs api`
3. Rebuild if changes not reflected: `docker-compose build --no-cache api`
4. Check port binding: `lsof -i :8080`

### OpenAPI JSON Not Generating
**Issue:** http://localhost:8080/v3/api-docs returns 404

**Solutions:**
1. Check `springdoc-openapi` dependency in pom.xml
2. Rebuild: `docker-compose build --no-cache api`
3. Restart API: `docker-compose restart api`

### Endpoints Not Documented
**Issue:** Created new endpoint but not in Swagger

**Solutions:**
1. Add `@Operation` annotation to method
2. Add `@ApiResponses` for response codes
3. Rebuild: `mvn clean package`
4. Swagger auto-scans on startup

### Cannot Test File Upload
**Issue:** File upload parameter shows as string in Swagger

**Solutions:**
1. Ensure `@RequestParam("file") MultipartFile file` is used
2. Swagger UI should show "Choose File" button
3. Try a different browser if button not appearing

---

## Advanced Usage

### Exporting API Specification
1. Open Swagger UI
2. Top-right corner: Click three dots (⋯)
3. Select "Download Specification" 
4. Choose JSON or YAML format
5. Share with backend/frontend teams

### Generating Client Code
Use the OpenAPI JSON specification to generate client code:

```bash
# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generate TypeScript client (for frontend)
openapi-generator-cli generate \
  -i http://localhost:8080/v3/api-docs \
  -g typescript-axios \
  -o ./generated-client
```

### CI/CD Integration
1. Export OpenAPI specification
2. Version it in Git
3. Generate client code in CI/CD pipeline
4. Keep frontend and backend in sync automatically

---

## Quick Reference: Testing Flow

```
1. Start Docker Compose
   docker-compose up -d

2. Open Swagger UI
   http://localhost:8080/swagger-ui.html

3. Test Backend API (Swagger)
   - Create a contact via POST /contacts
   - Retrieve contacts via GET /contacts
   - Upload a photo via PUT /contacts/photo

4. Test Frontend Integration
   - Open http://localhost:3000
   - Interact with UI
   - Check Network tab for API calls

5. Verify End-to-End
   - Add contact via frontend UI
   - Check it appears in Swagger GET response
   - Upload photo via Swagger
   - Verify image loads in frontend
```

---

## Where to Go Next

- **API Errors:** Check logs: `docker-compose logs api`
- **Database Issues:** `docker-compose logs db`
- **Frontend Errors:** Browser console: F12 → Console tab
- **Full Integration Test:** See CONTAINERIZATION_GUIDE.md

---

**Last Updated:** April 8, 2026
**Swagger Version:** SpringDoc OpenAPI 2.3.0
**OpenAPI Standard:** 3.0
