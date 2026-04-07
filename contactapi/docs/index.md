# Contact API Documentation

Welcome to the Contact API documentation. This is a production-grade Spring Boot application for managing contacts with photo upload capabilities.

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

## Overview

The Contact API is a RESTful web service built with Spring Boot that provides comprehensive contact management functionality including CRUD operations and photo uploads. It uses PostgreSQL as the database and follows standard Spring Boot architecture patterns.

## Quick Start

1. Ensure Java 25 and Maven are installed
2. Set up PostgreSQL database
3. Clone the repository
4. Configure database connection in `application.yml`
5. Run `mvn spring-boot:run`
6. Access the API at `http://localhost:8080`

For detailed setup instructions, see [Deployment](deployment.md).

## Key Features

- Full CRUD operations for contacts
- Photo upload and retrieval
- Pagination support
- JPA/Hibernate ORM
- Spring Boot Actuator for monitoring
- Production-ready configuration