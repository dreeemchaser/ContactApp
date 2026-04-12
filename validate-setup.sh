#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Always run relative to the script's own directory
cd "$(dirname "$0")" || exit 1

echo "=========================================="
echo "   Docker Compose Setup Validator"
echo "=========================================="
echo ""

# ── Docker ────────────────────────────────────────────────────────────
echo -n "✓ Checking Docker installation... "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC} — Docker is not installed or not in PATH"
    exit 1
fi

# ── Docker Compose (plugin or standalone) ────────────────────────────
echo -n "✓ Checking Docker Compose installation... "
if docker compose version &> /dev/null; then
    echo -e "${GREEN}OK${NC} (docker compose plugin)"
elif command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}OK${NC} (standalone docker-compose)"
else
    echo -e "${RED}FAILED${NC} — Docker Compose not found"
    echo "  Install via: https://docs.docker.com/compose/install/"
    exit 1
fi

# ── File structure ────────────────────────────────────────────────────
echo ""
echo "Verifying project structure..."
files=(
    "employeeapi/Dockerfile"
    "employeeapi/pom.xml"
    "employeehub/Dockerfile"
    "employeehub/nginx.conf"
    "employeehub/package.json"
    "hrdashboard/Dockerfile"
    "hrdashboard/nginx.conf"
    "hrdashboard/package.json"
    "docker-compose.yml"
)

all_files_ok=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file ${RED}(MISSING)${NC}"
        all_files_ok=false
    fi
done

if [ "$all_files_ok" = false ]; then
    echo ""
    echo -e "${RED}One or more required files are missing. Please check the project structure.${NC}"
    exit 1
fi

# ── Port availability ─────────────────────────────────────────────────
echo ""
echo "Checking if required ports are available..."
ports=(3000 3001 5432 8080)
for port in "${ports[@]}"; do
    in_use=false
    if command -v nc &> /dev/null; then
        nc -z localhost "$port" 2>/dev/null && in_use=true
    elif command -v lsof &> /dev/null; then
        lsof -i :"$port" &> /dev/null && in_use=true
    fi

    if [ "$in_use" = false ]; then
        echo -e "  ${GREEN}✓${NC} Port $port is available"
    else
        echo -e "  ${YELLOW}⚠${NC}  Port $port is already in use — this may cause a conflict"
    fi
done

# ── Done ──────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}Setup validation complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Run: docker compose build"
echo "  2. Run: docker compose up"
echo "  3. Employee frontend  →  http://localhost:3000"
echo "  4. HR dashboard       →  http://localhost:3001"
echo "  5. API                →  http://localhost:8080"
echo "  6. Swagger UI         →  http://localhost:8080/swagger-ui/index.html"
