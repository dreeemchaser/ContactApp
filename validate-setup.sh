#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "   Docker Compose Setup Validator"
echo "=========================================="
echo ""

# Check Docker
echo -n "✓ Checking Docker installation... "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    exit 1
fi

# Check Docker Compose
echo -n "✓ Checking Docker Compose installation... "
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    exit 1
fi

# Check file structure
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

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file (MISSING)"
    fi
done

# Check ports
echo ""
echo "Checking if required ports are available..."
ports=(3000 3001 5432 8080)
for port in "${ports[@]}"; do
    if ! nc -z localhost $port 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} Port $port is available"
    else
        echo -e "  ${YELLOW}⚠${NC} Port $port is in use"
    fi
done

echo ""
echo -e "${GREEN}Setup validation complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Run: docker-compose build"
echo "  2. Run: docker-compose up"
echo "  3. Access frontend at http://localhost:3000"
echo "  4. Access HR dashboard at http://localhost:3001"
echo "  5. Access API at http://localhost:8080"
