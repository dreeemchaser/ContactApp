# API Reference

The Contact API provides RESTful endpoints for managing contacts with photo upload capabilities. Base URL: `http://localhost:8080/contacts`

## Authentication

**Note**: Authentication is not currently implemented. For production use, implement JWT or OAuth2 authentication. All endpoints are currently open.

## Endpoints

### GET /contacts
Retrieve a paginated list of contacts.

**Parameters:**
- `page` (optional): Page number (default: 0, 0-based indexing)
- `size` (optional): Page size (default: 10, max: 100)

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": "uuid-string",
      "name": "John Doe",
      "email": "john@example.com",
      "title": "Manager",
      "phone": "123-456-7890",
      "address": "123 Main St",
      "status": "active",
      "photoURL": "http://localhost:8080/contacts/image/uuid.jpg"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "first": true,
  "numberOfElements": 1,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "empty": false
}
```

### GET /contacts/{id}
Retrieve a single contact by ID.

**Path Parameters:**
- `id`: Contact UUID

**Response (200 OK):** Contact object
**Response (404 Not Found):** Contact not found

### POST /contacts
Create a new contact.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "title": "Developer",
  "phone": "098-765-4321",
  "address": "456 Elm St",
  "status": "active"
}
```

**Response (201 Created):** Created contact object with generated ID
**Response (400 Bad Request):** Invalid input data

### PUT /contacts/photo
Upload or update a photo for an existing contact.

**Form Parameters:**
- `id`: Contact UUID
- `file`: Image file (JPEG, PNG, GIF supported)

**Response (200 OK):** Photo URL string
**Response (400 Bad Request):** Invalid file or contact ID
**Response (404 Not Found):** Contact not found

### GET /contacts/image/{filename}
Retrieve a contact's photo.

**Path Parameters:**
- `filename`: Photo filename (UUID.extension)

**Response (200 OK):** Image file (JPEG/PNG/GIF)
**Response (404 Not Found):** Photo not found

## Data Types

### Contact Object
```json
{
  "id": "string (UUID)",
  "name": "string (required)",
  "email": "string (required, unique)",
  "title": "string (optional)",
  "phone": "string (optional)",
  "address": "string (optional)",
  "status": "string (optional, default: active)",
  "photoURL": "string (optional, set after photo upload)"
}
```

## Validation Rules

- `name`: Required, non-empty string
- `email`: Required, valid email format, unique
- `title`: Optional string
- `phone`: Optional string
- `address`: Optional string
- `status`: Optional string
- Photo files: Max 1GB, JPEG/PNG/GIF only

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/contacts"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Contact not found",
  "path": "/contacts/uuid"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/contacts"
}
```

## Rate Limiting

Not implemented. Consider implementing rate limiting for production use.

## Pagination

The API uses Spring Data's Pageable interface. Results are sorted by name in ascending order by default.

## Content Types

- Request: `application/json` for JSON payloads, `multipart/form-data` for file uploads
- Response: `application/json` for data, `image/jpeg`, `image/png`, `image/gif` for photos