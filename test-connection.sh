#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Always run relative to the script's own directory
cd "$(dirname "$0")" || exit 1

echo "=========================================="
echo "   Service Connection Tester"
echo "=========================================="
echo ""

# ── Dependency check ──────────────────────────────────────────────────
if ! command -v curl &> /dev/null; then
    echo -e "${RED}FAILED${NC} — curl is required but not installed."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}FAILED${NC} — docker is required but not installed."
    exit 1
fi

# ── Wait for API to be ready (poll instead of fixed sleep) ────────────
echo "Waiting for API to be ready (up to 60 seconds)..."
MAX_WAIT=60
WAITED=0
until curl -s http://localhost:8080/actuator/health | grep -q '"status":"UP"' 2>/dev/null; do
    if [ "$WAITED" -ge "$MAX_WAIT" ]; then
        echo -e "${YELLOW}⚠  API did not become ready within ${MAX_WAIT}s — continuing anyway${NC}"
        break
    fi
    sleep 3
    WAITED=$((WAITED + 3))
done
echo ""

# ── Helper ────────────────────────────────────────────────────────────
check_http() {
    local label="$1"
    local url="$2"
    echo -n "Testing $label... "
    local code
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url")
    if [ "$code" = "200" ]; then
        echo -e "${GREEN}✓ OK (HTTP $code)${NC}"
    else
        echo -e "${YELLOW}⚠  Got HTTP $code${NC}"
    fi
}

# ── HTTP checks ───────────────────────────────────────────────────────
check_http "API health endpoint"       "http://localhost:8080/actuator/health"
check_http "Swagger UI"                "http://localhost:8080/swagger-ui/index.html"
check_http "Employee frontend"         "http://localhost:3000"
check_http "HR dashboard"              "http://localhost:3001"

# ── PostgreSQL (via Docker) ───────────────────────────────────────────
echo -n "Testing PostgreSQL connection... "
if docker exec employeehub-db pg_isready -U admin -d employeehub &> /dev/null; then
    echo -e "${GREEN}✓ Connected${NC}"
else
    echo -e "${RED}✗ Failed — is the db container running?${NC}"
fi

# ── Internal network: frontend → API ─────────────────────────────────
echo -n "Testing API access from frontend container... "
if docker exec employeehub-frontend wget --quiet --tries=1 --spider http://api:8080/actuator/health 2>/dev/null; then
    echo -e "${GREEN}✓ Frontend can reach API${NC}"
else
    echo -e "${RED}✗ Frontend cannot reach API${NC}"
fi

# ── Internal network: dashboard → API ────────────────────────────────
echo -n "Testing API access from dashboard container... "
if docker exec employeehub-hrdashboard wget --quiet --tries=1 --spider http://api:8080/actuator/health 2>/dev/null; then
    echo -e "${GREEN}✓ Dashboard can reach API${NC}"
else
    echo -e "${RED}✗ Dashboard cannot reach API${NC}"
fi

# ── Summary ───────────────────────────────────────────────────────────
echo ""
echo "=========================================="
echo "   URLs"
echo "=========================================="
echo "  Employee frontend  →  http://localhost:3000"
echo "  HR dashboard       →  http://localhost:3001"
echo "  API                →  http://localhost:8080"
echo "  Swagger UI         →  http://localhost:8080/swagger-ui/index.html"
echo "  PostgreSQL         →  localhost:5432"
