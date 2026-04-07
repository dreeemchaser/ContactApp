# ContactApp

A full-stack contact management solution composed of:

- `contactapi`: Spring Boot backend REST API for contacts with photo upload
- `contactapp`: React frontend for contact listing and details

## Repository Structure

- `contactapi/`
  - Java Spring Boot service
  - PostgreSQL persistence
  - Photo upload and image serving
  - API docs and deployment guides under `docs/`
- `contactapp/`
  - React client built with Create React App
  - UI components for contact list and details
  - Axios and React Router dependencies

## Features

- Contact CRUD support
- Paginated contact listing
- Contact photo upload and retrieval
- React-based UI scaffold with routing support
- Production-ready backend configuration with Actuator

## Getting Started

### Backend (`contactapi`)

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd contactapi
   ```

2. Configure PostgreSQL in `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/contactapi
       username: admin
       password: administrator
   ```

3. Start the backend:
   ```bash
   ./mvnw spring-boot:run
   ```

4. The API will be available at `http://localhost:8080`.

### Frontend (`contactapp`)

1. Open a terminal and navigate to the frontend folder:
   ```bash
   cd contactapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

4. The app will be available at `http://localhost:3000`.

## Notes

- The backend stores uploaded photos in the user home folder under `downloads/uploads/` by default.
- The frontend is currently scaffolded and needs integration with backend API endpoints.
- The backend includes an API documentation folder at `contactapi/docs/`.

## Learning Resources

- `contactapi/README.md` for detailed backend usage
- `contactapp/README.md` for React app scripts and development info

## Recommended Next Steps

- Wire the React app to the backend API
- Add contact create/edit/delete flows
- Improve upload and image preview support
- Add validation and error handling on both layers

---

Built as a contact management starter project with a Java Spring Boot backend and React frontend.