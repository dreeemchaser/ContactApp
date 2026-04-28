# EmployeeHub

A full-stack HR management solution composed of:

- `employeeapi`: Spring Boot backend REST API for employee management
- `employeehub`: React frontend for employee self-service and HR operations
- `hrdashboard`: React HR admin dashboard

## Repository Structure

```
EmployeeHub/
├── employeeapi/         # Java Spring Boot backend
├── employeehub/         # React employee frontend
├── hrdashboard/         # React HR dashboard
├── docs/                # Project-level guides
├── docker-compose.yml   # Full stack orchestration
├── validate-setup.sh    # Pre-run validation script
└── test-connection.sh   # Post-run connectivity test
```

## Features

- Employee CRUD with profile photo upload
- Leave management with approval workflows
- Timesheet submission and approval
- Salary records, payslip generation, and SA PAYE/UIF tax calculation
- Benefits catalogue and employee applications
- Performance cycles, goals, and reviews
- Document upload and HR verification
- Real-time notifications
- Audit trail
- JWT-based authentication with role-based access control
- React frontend wired to backend API
- Dockerized full stack with PostgreSQL, Spring Boot, and Nginx

## Running with Docker (Recommended)

```bash
docker-compose up --build
```

| Service       | URL                                   |
|---------------|---------------------------------------|
| Frontend      | http://localhost:3000                 |
| HR Dashboard  | http://localhost:3001                 |
| API           | http://localhost:8080                 |
| Swagger       | http://localhost:8080/swagger-ui.html |

To stop:
```bash
docker-compose down
```

To stop and remove all data volumes:
```bash
docker-compose down -v
```

## Running Locally (Without Docker)

### Backend (`employeeapi`)

1. Configure PostgreSQL in `employeeapi/src/main/resources/application.yml`
2. Run:
   ```bash
   cd employeeapi
   ./mvnw spring-boot:run
   ```

### Frontend (`employeehub`)

1. Install dependencies and start:
   ```bash
   cd employeehub
   npm install
   npm start
   ```

### HR Dashboard (`hrdashboard`)

1. Install dependencies and start:
   ```bash
   cd hrdashboard
   npm install
   npm start
   ```

## Environment Variables

Key variables used in `docker-compose.yml`:

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection URL | `jdbc:postgresql://db:5432/employeehub` |
| `SPRING_DATASOURCE_USERNAME` | DB username | `admin` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | `administrator` |
| `PHOTO_DIRECTORY` | Photo storage path inside container | `/app/photos/` |
| `JWT_SECRET` | JWT signing secret | (see application.yml) |
| `JWT_EXPIRATION` | JWT expiry in milliseconds | `86400000` (24h) |
| `REACT_APP_API_URL` | API base URL used by React build | `http://localhost:8080` |

## Notes

- Frontend and HR Dashboard are built with Nginx serving React production builds
- API changes require `docker-compose up --build` to take effect
- Photos are persisted in the `employee_photos` Docker volume
- Database data is persisted in the `postgres_data` Docker volume

## Documentation

- `employeeapi/README.md` — Backend setup and usage
- `employeehub/README.md` — Frontend scripts and development info
- `docs/CONTAINERIZATION_GUIDE.md` — Full Docker setup walkthrough
- `docs/SWAGGER_GUIDE.md` — Swagger/OpenAPI usage guide
- `docs/api-contract.md` — Full API contract reference
- `docs/BACKEND_BUILD_STEPS.md` — Step-by-step backend build guide
- `docs/data-model-uml.md` — Data model UML diagram
- `employeeapi/docs/` — API reference, architecture, security, and more

---

Built as a full-stack HR management system with a Java Spring Boot backend and React frontend.
