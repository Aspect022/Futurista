#!/bin/bash
# deploy.sh - Production Deployment Script

echo "🚀 Techathon 6.0 - Production Deployment"
echo "========================================"

# Build all Docker images
echo "🔨 Building Docker images..."
docker-compose build

# Start all services
echo "🌟 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 45

# Health check
echo "🏥 Performing health checks..."

services=(
    "http://localhost:8000/health:Mock API"
    "http://localhost:8001/health:Master Agent"
    "http://localhost:8002/health:Data Analysis Worker"
    "http://localhost:8003/health:Diagnosis Worker"
    "http://localhost:8004/health:Customer Engagement Worker"
    "http://localhost:8005/health:Scheduling Worker"
    "http://localhost:8006/health:Feedback Worker"
    "http://localhost:8007/health:Manufacturing Insights Worker"
)

all_healthy=true

for service in "${services[@]}"
do
    url=$(echo $service | cut -d: -f1,2)
    name=$(echo $service | cut -d: -f3-)
    
    if curl -f -s "$url" > /dev/null; then
        echo "✅ $name is healthy"
    else
        echo "❌ $name is not responding"
        all_healthy=false
    fi
done

# Check dashboard accessibility
if curl -f -s "http://localhost:8501/_stcore/health" > /dev/null; then
    echo "✅ Dashboard is accessible"
else
    echo "❌ Dashboard is not accessible"
    all_healthy=false
fi

if [ "$all_healthy" = true ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "🔗 Access Points:"
    echo "   Dashboard:    http://localhost:8501"
    echo "   Master Agent: http://localhost:8001"
    echo "   Mock API:     http://localhost:8000"
    echo ""
    echo "📊 Next Steps:"
    echo "   1. Access the dashboard to view the demo"
    echo "   2. Run tests: cd tests && python run_tests.py"
    echo "   3. View API docs: http://localhost:8001/docs"
else
    echo ""
    echo "❌ Deployment failed - some services are not healthy"
    echo "🔧 Troubleshooting:"
    echo "   1. Check Docker logs: docker-compose logs"
    echo "   2. Verify Docker resources: docker system df"
    echo "   3. Restart services: docker-compose restart"
    exit 1
fi