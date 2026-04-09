# ContactApp

A full-stack contact management solution composed of:

- `contactapi`: Spring Boot backend REST API for contacts with photo upload
- `contactapp`: React frontend for contact listing and details

## Repository Structure

```
ContactApp/
├── contactapi/          # Java Spring Boot backend
├── contactapp/          # React frontend
├── docs/                # Project-level guides
├── docker-compose.yml   # Full stack orchestration
├── validate-setup.sh    # Pre-run validation script
└── test-connection.sh   # Post-run connectivity test
```

## Features

- Contact CRUD support
- Paginated contact listing
- Contact photo upload and retrieval
- React frontend wired to backend API
- Dockerized full stack with PostgreSQL, Spring Boot, and Nginx

## Running with Docker (Recommended)

```bash
docker-compose up --build
```

| Service   | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:3000        |
| API       | http://localhost:8080        |
| Swagger   | http://localhost:8080/swagger-ui.html |

To stop:
```bash
docker-compose down
```

To stop and remove all data volumes:
```bash
docker-compose down -v
```

## Running Locally (Without Docker)

### Backend (`contactapi`)

1. Configure PostgreSQL in `contactapi/src/main/resources/application.yml`
2. Run:
   ```bash
   cd contactapi
   ./mvnw spring-boot:run
   ```

### Frontend (`contactapp`)

1. Install dependencies and start:
   ```bash
   cd contactapp
   npm install
   npm start
   ```

## Environment Variables

Key variables used in `docker-compose.yml`:

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection URL | `jdbc:postgresql://db:5432/contactapi` |
| `SPRING_DATASOURCE_USERNAME` | DB username | `admin` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | `administrator` |
| `PHOTO_DIRECTORY` | Photo storage path inside container | `/app/photos/` |
| `REACT_APP_API_URL` | API base URL used by React build | `http://localhost:8080` |

## Notes

- Frontend is built with Nginx serving the React production build
- API changes require `docker-compose up --build` to take effect
- Photos are persisted in the `contact_photos` Docker volume
- Database data is persisted in the `postgres_data` Docker volume

## Documentation

- `contactapi/README.md` — Backend setup and usage
- `contactapp/README.md` — Frontend scripts and development info
- `docs/CONTAINERIZATION_GUIDE.md` — Full Docker setup walkthrough
- `docs/SWAGGER_GUIDE.md` — Swagger/OpenAPI usage guide
- `contactapi/docs/` — API reference, architecture, security, and more

---

Built as a contact management project with a Java Spring Boot backend and React frontend.
