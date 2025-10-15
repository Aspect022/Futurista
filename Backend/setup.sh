#!/bin/bash
# setup.sh - Development Environment Setup Script

echo "🚗 Techathon 6.0 - Automotive AI Solution Setup"
echo "================================================"

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is required but not installed. Aborting." >&2; exit 1; }

echo "✅ Prerequisites check passed"

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p {infra/mockapi/data,master-agent,workers/{data_analysis,diagnosis,customer_engagement,scheduling,feedback,manufacturing_insights},ui/assets,tests/test_results,docs/images,slides,k8s,scripts}

# Set permissions
chmod +x scripts/*.sh

# Create .env file for development
echo "🔧 Creating environment configuration..."
cat > .env << EOF
# Development Environment Configuration
MOCK_API_URL=http://localhost:8000
MASTER_AGENT_URL=http://localhost:8001
DASHBOARD_URL=http://localhost:8501

# Service Configuration
FLASK_ENV=development
FASTAPI_ENV=development
LOG_LEVEL=INFO

# Database
REDIS_URL=redis://localhost:6379

# Security
UEBA_THRESHOLD=0.7
SESSION_TIMEOUT=3600
EOF

# Initialize test results directory
touch tests/test_results/.gitkeep
touch docs/images/.gitkeep
touch ui/assets/.gitkeep

echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Run: docker-compose up -d"
echo "2. Wait 30 seconds for services to start"
echo "3. Access dashboard: http://localhost:8501"
echo "4. Run tests: cd tests && python run_tests.py"