# Architecture

## Overview

The Employee API is a RESTful web service built with Spring Boot 3.5.13, Java 25, and PostgreSQL. It follows a layered architecture with clear separation of concerns and JWT-based role-based access control.

## Layers

### Presentation Layer
Controllers handle HTTP requests and responses, grouped by domain module:
- `AuthController` — registration and login
- `EmployeeController` — employee CRUD and photo upload
- `DepartmentController`, `TeamController` — organisation structure
- `LeaveController`, `TimesheetController` — workforce management
- `SalaryController`, `BenefitController` — compensation
- `PerformanceController`, `DocumentController` — employee development
- `NotificationController`, `AuditLogController` — system

### Service Layer
Business logic per module: `EmployeeService`, `LeaveService`, `SalaryService`, `TimesheetService`, `BenefitService`, `PerformanceService`, `DocumentService`, `NotificationService`, `AuditService`, etc.

### Repository Layer
JPA repositories extending `JpaRepository` for each domain entity.

### Domain Layer
JPA entities representing the full HR data model. See [../../docs/data-model-uml.md](../../docs/data-model-uml.md) for the full UML diagram.

### Security Layer
- `JwtAuthFilter` — intercepts every request and validates the Bearer token
- `JwtUtil` — token generation, parsing, and validation
- `SecurityConfig` — role-based access rules per endpoint
- `UserDetailsServiceImpl` — loads employees from DB for Spring Security

## Technologies

- **Framework**: Spring Boot 3.5.13
- **Language**: Java 25
- **Database**: PostgreSQL 15
- **ORM**: JPA/Hibernate
- **Security**: Spring Security + JJWT
- **Build Tool**: Maven
- **Utilities**: Lombok
- **Monitoring**: Spring Boot Actuator

## Key Domain Entities

| Module | Entities |
|--------|----------|
| Organisation | Department, Team |
| Employee | Employee |
| Leave | LeaveType, LeaveBalance, LeaveRequest |
| Salary | SalaryRecord, PaySlip, TaxBracket, SalaryIncreaseRequest |
| Benefits | BenefitType, EmployeeBenefit, BenefitApplication |
| Timesheets | Timesheet, TimesheetEntry |
| Performance | PerformanceCycle, PerformanceReview, PerformanceGoal |
| Documents | Document |
| System | AuditLog, Notification |

## Configuration

Application configuration is managed through `application.yml`:
- Database connection (PostgreSQL)
- JPA/Hibernate settings
- File upload limits
- Server port (8080)
- JWT secret and expiration

## File Storage

Photos are stored locally in the `PHOTO_DIRECTORY`. For production deployments, consider migrating to cloud storage such as AWS S3.

## Error Handling

Global exception handling via `GlobalExceptionHandler` with consistent `ApiResponse<T>` wrapper and proper HTTP status codes.

## Security

JWT authentication with role-based access control. Roles: `EMPLOYEE`, `MANAGER`, `HR_ADMIN`, `PAYROLL_ADMIN`, `SUPER_ADMIN`. See [security.md](security.md) for details.
