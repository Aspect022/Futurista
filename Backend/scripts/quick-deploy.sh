#!/bin/bash
# Quick Deployment Script for Automotive Predictive Maintenance System

set -e  # Exit on any error

echo "🚗 Techathon 6.0 - Automotive AI Solution Quick Deploy"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Build and start services
deploy_services() {
    print_status "Building and starting services..."
    
    # Build all images
    print_status "Building Docker images..."
    docker-compose build --parallel
    
    # Start all services
    print_status "Starting services..."
    docker-compose up -d
    
    print_success "Services started successfully"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to initialize..."
    
    # Wait for services to be healthy
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        print_status "Health check attempt $attempt/$max_attempts"
        
        # Check master agent health
        if curl -f -s http://localhost:8001/health > /dev/null 2>&1; then
            print_success "Master Agent is healthy"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Services failed to start within expected time"
            print_status "Checking service logs..."
            docker-compose logs --tail=50
            exit 1
        fi
        
        sleep 2
        ((attempt++))
    done
}

# Perform health checks
health_check() {
    print_status "Performing comprehensive health checks..."
    
    local services=(
        "http://localhost:8000/health:Mock API"
        "http://localhost:8001/health:Master Agent"
        "http://localhost:8002/health:Data Analysis Worker"
        "http://localhost:8003/health:Diagnosis Worker"
        "http://localhost:8004/health:Customer Engagement Worker"
        "http://localhost:8005/health:Scheduling Worker"
        "http://localhost:8006/health:Feedback Worker"
        "http://localhost:8007/health:Manufacturing Insights Worker"
    )
    
    local all_healthy=true
    
    for service in "${services[@]}"; do
        local url=$(echo $service | cut -d: -f1,2)
        local name=$(echo $service | cut -d: -f3-)
        
        if curl -f -s "$url" > /dev/null 2>&1; then
            print_success "$name is healthy"
        else
            print_error "$name is not responding"
            all_healthy=false
        fi
    done
    
    # Check dashboard
    if curl -f -s "http://localhost:8501/_stcore/health" > /dev/null 2>&1; then
        print_success "Dashboard is accessible"
    else
        print_error "Dashboard is not accessible"
        all_healthy=false
    fi
    
    if [ "$all_healthy" = true ]; then
        print_success "All services are healthy!"
        return 0
    else
        print_error "Some services are not healthy"
        return 1
    fi
}

# Run quick test
run_quick_test() {
    print_status "Running quick system test..."
    
    # Test maintenance analysis
    local test_response=$(curl -s -X POST http://localhost:8001/maintenance/analyze \
        -H "Content-Type: application/json" \
        -d '{"vin": "VIN123ABC", "customer_id": "CUST001", "priority": "MEDIUM"}' \
        -w "%{http_code}")
    
    local http_code="${test_response: -3}"
    
    if [ "$http_code" = "200" ]; then
        print_success "System test passed - maintenance analysis working"
    else
        print_warning "System test failed - HTTP $http_code"
    fi
}

# Display access information
show_access_info() {
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "🔗 Access Points:"
    echo "   📊 Dashboard:        http://localhost:8501"
    echo "   🤖 Master Agent:     http://localhost:8001"
    echo "   📚 API Docs:         http://localhost:8001/docs"
    echo "   🔧 Mock API:         http://localhost:8000"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Open the dashboard: http://localhost:8501"
    echo "   2. Run tests: cd tests && python run_tests.py"
    echo "   3. View API documentation: http://localhost:8001/docs"
    echo ""
    echo "🛠️  Management Commands:"
    echo "   View logs:           docker-compose logs -f"
    echo "   Stop services:       docker-compose down"
    echo "   Restart services:    docker-compose restart"
    echo "   Update services:     docker-compose pull && docker-compose up -d"
    echo ""
}

# Main execution
main() {
    check_prerequisites
    deploy_services
    wait_for_services
    
    if health_check; then
        run_quick_test
        show_access_info
    else
        print_error "Deployment failed - some services are not healthy"
        print_status "Troubleshooting:"
        echo "   1. Check Docker resources: docker system df"
        echo "   2. View service logs: docker-compose logs"
        echo "   3. Restart services: docker-compose restart"
        echo "   4. Check port conflicts: netstat -tulpn | grep :800"
        exit 1
    fi
}

# Handle script interruption
trap 'print_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"
