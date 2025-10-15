# Deployment Guide - Automotive Predictive Maintenance System

## Overview

This guide provides comprehensive instructions for deploying the Automotive Predictive Maintenance System in various environments, from development to production.

## Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+), macOS, or Windows 10+
- **RAM**: Minimum 8GB, Recommended 16GB
- **CPU**: Minimum 4 cores, Recommended 8 cores
- **Storage**: Minimum 20GB free space
- **Network**: Internet connectivity for package downloads

### Software Requirements
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **Git**: For cloning the repository
- **Python**: 3.10+ (for local development)

## Quick Start (5 Minutes)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/techathon-automotive-ai
cd techathon-automotive-ai
```

### 2. One-Command Deployment
```bash
# Start entire system
docker-compose up -d

# Wait for services to initialize
sleep 45

# Verify system health
curl http://localhost:8001/health
```

### 3. Access Services
- **Dashboard**: http://localhost:8501
- **Master Agent API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs
- **Mock API**: http://localhost:8000

## Detailed Deployment

### Development Environment

#### 1. Environment Setup
```bash
# Create development environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements-master.txt
pip install -r requirements-worker.txt
pip install -r requirements-mockapi.txt
pip install -r requirements-streamlit.txt
```

#### 2. Local Development
```bash
# Start mock API server
cd infra/mockapi
python app.py

# Start master agent (new terminal)
cd master-agent
uvicorn app:app --reload --port 8001

# Start worker agents (separate terminals)
cd workers/data_analysis
uvicorn app:app --reload --port 8002

# Start dashboard (new terminal)
cd ui
streamlit run streamlit_app.py --server.port 8501
```

### Production Deployment

#### 1. Docker Compose Production
```bash
# Build and start all services
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

#### 2. Individual Service Deployment
```bash
# Build individual services
docker build -f dockerfile-master -t automotive-master-agent .
docker build -f dockerfile-worker -t automotive-worker .
docker build -f dockerfile-mockapi -t automotive-mockapi .
docker build -f dockerfile-streamlit -t automotive-dashboard .

# Run services individually
docker run -d -p 8001:8001 --name master-agent automotive-master-agent
docker run -d -p 8002:8002 --name data-analysis automotive-worker
docker run -d -p 8000:8000 --name mockapi automotive-mockapi
docker run -d -p 8501:8501 --name dashboard automotive-dashboard
```

### Kubernetes Deployment

#### 1. Create Namespace
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: automotive-ai
```

#### 2. Master Agent Deployment
```yaml
# k8s/master-agent-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: master-agent
  namespace: automotive-ai
spec:
  replicas: 2
  selector:
    matchLabels:
      app: master-agent
  template:
    metadata:
      labels:
        app: master-agent
    spec:
      containers:
      - name: master-agent
        image: automotive-master-agent:latest
        ports:
        - containerPort: 8001
        env:
        - name: MOCK_API_URL
          value: "http://mockapi:8000"
        - name: UEBA_THRESHOLD
          value: "0.7"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8001
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: master-agent
  namespace: automotive-ai
spec:
  selector:
    app: master-agent
  ports:
  - port: 8001
    targetPort: 8001
  type: ClusterIP
```

#### 3. Apply Kubernetes Manifests
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/master-agent-deployment.yaml
kubectl apply -f k8s/workers-deployment.yaml
kubectl apply -f k8s/dashboard-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

## Configuration

### Environment Variables

#### Master Agent
```bash
MOCK_API_URL=http://mockapi:8000
UEBA_THRESHOLD=0.7
LOG_LEVEL=INFO
FASTAPI_ENV=production
```

#### Worker Agents
```bash
WORKER_TYPE=data_analysis
MOCK_API_URL=http://mockapi:8000
LOG_LEVEL=INFO
```

#### Mock API
```bash
FLASK_ENV=production
LOG_LEVEL=INFO
```

#### Dashboard
```bash
MASTER_AGENT_URL=http://master-agent:8001
LOG_LEVEL=INFO
```

### Docker Compose Configuration

#### Resource Limits
```yaml
services:
  master-agent:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

#### Health Checks
```yaml
services:
  master-agent:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8001/health"]
      interval: 30s
      timeout: 15s
      retries: 5
      start_period: 30s
```

## Monitoring and Observability

### Health Checks
```bash
# Check all services
curl http://localhost:8000/health  # Mock API
curl http://localhost:8001/health  # Master Agent
curl http://localhost:8002/health  # Data Analysis Worker
curl http://localhost:8003/health  # Diagnosis Worker
curl http://localhost:8004/health  # Customer Engagement Worker
curl http://localhost:8005/health  # Scheduling Worker
curl http://localhost:8006/health  # Feedback Worker
curl http://localhost:8007/health  # Manufacturing Insights Worker
curl http://localhost:8501/_stcore/health  # Dashboard
```

### Logging
```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f master-agent

# View logs with timestamps
docker-compose logs -f -t
```

### Metrics Collection
```bash
# System metrics
docker stats

# Service-specific metrics
curl http://localhost:8001/metrics
```

## Testing

### Automated Testing
```bash
# Run complete test suite
cd tests
python run_tests.py

# Run specific test category
python run_tests.py --category normal_operations

# Run with verbose output
python run_tests.py --verbose
```

### Manual Testing
```bash
# Test maintenance analysis
curl -X POST http://localhost:8001/maintenance/analyze \
  -H "Content-Type: application/json" \
  -d '{"vin": "VIN123ABC", "customer_id": "CUST001", "priority": "MEDIUM"}'

# Test emergency response
curl -X POST http://localhost:8001/emergency/alert \
  -H "Content-Type: application/json" \
  -d '{"vin": "VIN456DEF", "alert_type": "engine_failure", "severity": "CRITICAL"}'
```

## Troubleshooting

### Common Issues

#### 1. Services Not Starting
```bash
# Check Docker status
docker-compose ps

# Check logs
docker-compose logs service-name

# Restart services
docker-compose restart
```

#### 2. Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :8001

# Kill process using port
sudo kill -9 $(lsof -t -i:8001)
```

#### 3. Memory Issues
```bash
# Check memory usage
docker stats

# Increase Docker memory limit
# Edit Docker Desktop settings or docker-compose.yml
```

#### 4. Network Connectivity
```bash
# Test internal connectivity
docker-compose exec master-agent curl http://mockapi:8000/health

# Check DNS resolution
docker-compose exec master-agent nslookup mockapi
```

### Performance Optimization

#### 1. Resource Allocation
```yaml
# docker-compose.yml
services:
  master-agent:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
```

#### 2. Caching
```bash
# Enable Redis caching
docker-compose up -d redis

# Configure cache in application
CACHE_URL=redis://redis:6379
```

#### 3. Load Balancing
```yaml
# nginx.conf
upstream master_agent {
    server master-agent-1:8001;
    server master-agent-2:8001;
}
```

## Security Considerations

### 1. Network Security
```yaml
# docker-compose.yml
networks:
  automotive-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### 2. Secrets Management
```bash
# Use Docker secrets
echo "mysecret" | docker secret create api_key -

# Reference in docker-compose.yml
secrets:
  - api_key
```

### 3. UEBA Configuration
```bash
# Adjust UEBA threshold
UEBA_THRESHOLD=0.7

# Enable detailed logging
LOG_LEVEL=DEBUG
```

## Backup and Recovery

### 1. Data Backup
```bash
# Backup Redis data
docker-compose exec redis redis-cli BGSAVE

# Backup configuration
tar -czf config-backup.tar.gz docker-compose.yml .env
```

### 2. Disaster Recovery
```bash
# Restore from backup
tar -xzf config-backup.tar.gz

# Restart services
docker-compose up -d
```

## Scaling

### Horizontal Scaling
```bash
# Scale specific services
docker-compose up -d --scale master-agent=3
docker-compose up -d --scale data-analysis-worker=2
```

### Vertical Scaling
```yaml
# Increase resource limits
services:
  master-agent:
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2.0'
```

## Maintenance

### Regular Maintenance Tasks
```bash
# Update images
docker-compose pull
docker-compose up -d

# Clean up unused resources
docker system prune -a

# Update dependencies
pip install --upgrade -r requirements-*.txt
```

### Monitoring Checklist
- [ ] All services healthy
- [ ] Response times < 30s
- [ ] Memory usage < 80%
- [ ] CPU usage < 80%
- [ ] No error logs
- [ ] UEBA monitoring active

## Support

For additional support:
- **Documentation**: Check `docs/` directory
- **Issues**: Create GitHub issue
- **Email**: automotive-ai@techathon2024.com
- **Slack**: #automotive-ai-support
