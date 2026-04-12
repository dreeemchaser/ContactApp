# EmployeeHub — React Frontend

React frontend for the EmployeeHub HR management system, built with Create React App and served via Nginx in Docker.

## Project Structure

```
employeehub/
├── src/
│   ├── api/
│   │   ├── AuthService.js      # Auth API calls (login, register)
│   │   └── ContactService.js   # Employee API calls to backend
│   ├── components/
│   │   ├── EmployeeCard.jsx
│   │   ├── Header.jsx
│   │   ├── LoginPage.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Spinner.jsx
│   │   └── TopBar.jsx
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── EmployeesPage.jsx
│   │   ├── EmployeeDetailsPage.jsx
│   │   ├── LeavePage.jsx
│   │   ├── TimesheetsPage.jsx
│   │   ├── SalaryPage.jsx
│   │   ├── BenefitsPage.jsx
│   │   ├── PerformancePage.jsx
│   │   └── DocumentsPage.jsx
│   ├── App.js
│   └── index.js
├── public/
├── Dockerfile                  # Multi-stage build: Node builder + Nginx runtime
├── nginx.conf                  # Nginx config with SPA routing and API proxy
└── package.json
```

## Running with Docker (Recommended)

From the project root:

```bash
docker-compose up --build
```

Frontend will be available at: **http://localhost:3000**

> Any code changes require a rebuild: `docker-compose up --build`

## Running Locally (Development)

```bash
npm install
npm start
```

App will be available at: **http://localhost:3000**

> Hot reload is active in local dev mode. Changes reflect automatically without restart.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | Falls back to `http://localhost:8080` |

In Docker, this is injected at build time via `docker-compose.yml`:
```yaml
args:
  REACT_APP_API_URL: http://localhost:8080
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start local dev server at http://localhost:3000 |
| `npm run build` | Build production bundle to `build/` |
| `npm test` | Run tests in interactive watch mode |
