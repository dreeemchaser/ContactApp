# API Reference

Base URL: `http://localhost:8080`

> No authentication is currently implemented. All endpoints are open.

## Endpoints

### GET /contacts
Retrieve a paginated list of contacts.

**Query Parameters:**
- `page` (optional): Page number, 0-indexed (default: `0`)
- `size` (optional): Page size (default: `10`)

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": "uuid-string",
      "name": "John Doe",
      "email": "john@example.com",
      "title": "Software Engineer",
      "phone": "+1-555-123-4567",
      "address": "123 Main St",
      "status": "active",
      "photoURL": "john_doe_photo.jpg"
    }
  ],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 6,
    "totalPages": 1
  }
}
```

> Note: Pagination metadata is nested under the `page` key. Access total count via `response.data.page.totalElements`.

---

### GET /contacts/{id}
Retrieve a single contact by ID.

**Path Parameters:**
- `id`: Contact UUID

**Response (200 OK):** Contact object  
**Response (404 Not Found):** Contact not found

---

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

**Response (201 Created):** Created contact object with generated UUID  
**Response (400 Bad Request):** Invalid input

---

### PUT /contacts/photo
Upload or update a photo for an existing contact.

**Form Parameters (multipart/form-data):**
- `id`: Contact UUID
- `file`: Image file (JPEG, PNG, GIF)

**Response (200 OK):** Photo URL string  
**Response (404 Not Found):** Contact not found

---

### GET /contacts/image/{filename}
Retrieve a contact's photo.

**Path Parameters:**
- `filename`: Photo filename

**Response (200 OK):** Image binary (JPEG/PNG/GIF)  
**Response (404 Not Found):** Photo not found

---

## Contact Object

```json
{
  "id": "string (UUID, auto-generated)",
  "name": "string (required)",
  "email": "string (required, unique)",
  "title": "string (optional)",
  "phone": "string (optional)",
  "address": "string (optional)",
  "status": "string (optional)",
  "photoURL": "string (set after photo upload)"
}
```

## Error Responses

```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Contact not found",
  "path": "/contacts/uuid"
}
```
