# Architecture

## Overview

The Contact API is a RESTful web service built with Spring Boot 3.5.13, Java 25, and PostgreSQL database. It follows a layered architecture pattern with clear separation of concerns.

## Layers

### Presentation Layer
- `ContactController`: REST controller handling HTTP requests and responses for contact management operations.

### Service Layer
- `ContactService`: Business logic layer containing contact management operations, photo upload handling, and data validation.

### Repository Layer
- `ContactRepository`: JPA repository interface extending `JpaRepository<Contact, String>` for data access operations.

### Domain Layer
- `Contact`: JPA entity representing a contact with all necessary fields and relationships.

## Technologies

- **Framework**: Spring Boot 3.5.13
- **Language**: Java 25
- **Database**: PostgreSQL
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven
- **Utilities**: Lombok for boilerplate reduction
- **Monitoring**: Spring Boot Actuator

## Data Model

The `Contact` entity has the following attributes:
- `id`: UUID primary key (auto-generated)
- `name`: String (contact's full name)
- `email`: String (unique email address)
- `title`: String (job title)
- `phone`: String (phone number)
- `address`: String (physical address)
- `status`: String (contact status: active/inactive)
- `photoURL`: String (URL to contact's photo)

## Configuration

Application configuration is managed through `application.yml` with the following key settings:
- Database connection (PostgreSQL)
- JPA/Hibernate settings
- File upload limits (1GB max)
- Server port (8080)
- Async request timeout (1 hour)

## File Storage

Photos are stored locally in the `PHOTO_DIRECTORY` with secure filename generation. For production deployments, consider migrating to cloud storage solutions like AWS S3 or Azure Blob Storage.

## Error Handling

The application implements basic error handling with custom exceptions and proper HTTP status codes. Global exception handling should be enhanced for production use.

## Security Considerations

- No authentication/authorization implemented (see [Security](security.md))
- File uploads require validation and secure storage
- Input validation using Bean Validation annotations
- HTTPS should be enabled in production
- CORS configuration needed for web clients