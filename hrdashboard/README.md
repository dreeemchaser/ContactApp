# hrdashboard

React-based HR admin dashboard for the EmployeeHub system.

## Features

- Live API health monitoring (auto-refreshes every 10 seconds)
- Employee count stats (requires JWT token)
- Full API endpoint reference
- Live activity log of API calls made from the dashboard

## Running Locally

```bash
npm install
npm start
```

Runs on [http://localhost:3001](http://localhost:3001)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:8080` |

## Running with Docker

See the root `docker-compose.yml`. The dashboard is built and served via Nginx on port `3001`.

## Usage

1. Open the dashboard at `http://localhost:3001`
2. Paste a valid JWT token (obtained from `POST /auth/login`) to load live employee stats
3. The activity log tracks all API calls made during the session
