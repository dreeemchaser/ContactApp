#!/bin/bash

# Test all service connections after docker-compose up

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=========================================="
echo "   Service Connection Tester"
echo "=========================================="
echo ""

# Wait for services to be ready
echo "Waiting for services to stabilize (30 seconds)..."
sleep 30

# Test Database
echo -n "Testing PostgreSQL connection... "
if docker exec employeehub-db pg_isready -U admin &> /dev/null; then
    echo -e "${GREEN}✓ Connected${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

# Test API
echo -n "Testing API health endpoint... "
API_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:8080/actuator/health)
if [ "$API_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ Responding (HTTP $API_RESPONSE)${NC}"
else
    echo -e "${YELLOW}⚠ Got HTTP $API_RESPONSE${NC}"
fi

# Test Frontend
echo -n "Testing Frontend availability... "
FRONTEND_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:3000)
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ Running (HTTP $FRONTEND_RESPONSE)${NC}"
else
    echo -e "${YELLOW}⚠ Got HTTP $FRONTEND_RESPONSE${NC}"
fi

# Test HR Dashboard
echo -n "Testing HR Dashboard availability... "
DASHBOARD_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:3001)
if [ "$DASHBOARD_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ Running (HTTP $DASHBOARD_RESPONSE)${NC}"
else
    echo -e "${YELLOW}⚠ Got HTTP $DASHBOARD_RESPONSE${NC}"
fi

# Test API from Frontend container
echo -n "Testing API access from Frontend container... "
API_FROM_FE=$(docker exec employeehub-frontend wget --quiet --tries=1 -O /dev/null -w "%{http_code}" http://api:8080/actuator/health 2>/dev/null)
if [ "$API_FROM_FE" = "200" ]; then
    echo -e "${GREEN}✓ Frontend can reach API${NC}"
else
    echo -e "${RED}✗ Frontend cannot reach API${NC}"
fi

# Test Database from API container
echo -n "Testing Database access from API container... "
if docker exec employeehub-api pg_isready -h db -U admin &> /dev/null; then
    echo -e "${GREEN}✓ API can reach Database${NC}"
else
    echo -e "${RED}✗ API cannot reach Database${NC}"
fi

echo ""
echo "=========================================="
echo "   Test Summary"
echo "=========================================="
echo "Frontend URL:    http://localhost:3000"
echo "HR Dashboard:    http://localhost:3001"
echo "API URL:         http://localhost:8080"
echo "PostgreSQL:      localhost:5432"
echo ""
echo "Credentials:"
echo "  DB User: admin"
echo "  DB Pass: administrator"
