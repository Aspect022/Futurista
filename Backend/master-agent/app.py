#!/usr/bin/env python3
"""
Master Agent - Central Orchestrator for Automotive Predictive Maintenance System
Coordinates all worker agents and manages the complete workflow
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
import asyncio
import aiohttp
import logging
import uuid
import json
from datetime import datetime, timedelta
import os
from contextlib import asynccontextmanager

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(correlation_id)s] - %(message)s'
)
logger = logging.getLogger(__name__)

# Global session store
session_store = {}

class CorrelationIDFilter(logging.Filter):
    def filter(self, record):
        record.correlation_id = getattr(record, 'correlation_id', 'unknown')
        return True

logger.addFilter(CorrelationIDFilter())

# Configuration
MOCK_API_URL = os.getenv('MOCK_API_URL', 'http://mockapi:8000')
UEBA_THRESHOLD = float(os.getenv('UEBA_THRESHOLD', '0.7'))
WORKER_URLS = {
    'data_analysis': 'http://data-analysis-worker:8002',
    'diagnosis': 'http://diagnosis-worker:8003',
    'customer_engagement': 'http://customer-engagement-worker:8004',
    'scheduling': 'http://scheduling-worker:8005',
    'feedback': 'http://feedback-worker:8006',
    'manufacturing_insights': 'http://manufacturing-insights-worker:8007'
}

# Pydantic models
class MaintenanceRequest(BaseModel):
    vin: str = Field(..., description="Vehicle Identification Number")
    customer_id: Optional[str] = Field(None, description="Customer ID")
    priority: str = Field("MEDIUM", description="Priority level: LOW, MEDIUM, HIGH, CRITICAL")
    analysis_type: str = Field("predictive", description="Type of analysis: predictive, emergency, routine")

class EmergencyRequest(BaseModel):
    vin: str = Field(..., description="Vehicle Identification Number")
    alert_type: str = Field(..., description="Type of emergency alert")
    severity: str = Field(..., description="Severity level: LOW, MEDIUM, HIGH, CRITICAL")
    location: Optional[str] = Field(None, description="Vehicle location")
    customer_id: Optional[str] = Field(None, description="Customer ID")

class WorkerResponse(BaseModel):
    worker: str
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    confidence: float = Field(0.0, ge=0.0, le=1.0)
    sources: List[str] = []

class OrchestrationResult(BaseModel):
    session_id: str
    status: str
    results: Dict[str, WorkerResponse]
    overall_confidence: float
    recommendations: List[str]
    ueba_status: Dict[str, Any]
    processing_time_seconds: float
    timestamp: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    logger.info("Starting Master Agent Orchestrator...")
    yield
    logger.info("Shutting down Master Agent Orchestrator...")

app = FastAPI(
    title="Automotive Predictive Maintenance - Master Agent",
    description="Central orchestrator for multi-agent automotive maintenance system",
    version="1.0.0",
    lifespan=lifespan
)

class UEBA:
    """User and Entity Behavior Analytics for AI Agent Security"""
    
    def __init__(self):
        self.baseline_patterns = {}
        self.risk_threshold = UEBA_THRESHOLD
    
    async def monitor_action(self, agent_id: str, action: str, context: Dict) -> Dict:
        """Monitor agent action for security anomalies"""
        try:
            async with aiohttp.ClientSession() as session:
                monitoring_data = {
                    "agent_id": agent_id,
                    "action": action,
                    "context": context,
                    "timestamp": datetime.now().isoformat()
                }
                
                async with session.post(
                    f"{MOCK_API_URL}/ueba/monitor",
                    json=monitoring_data,
                    timeout=5
                ) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        logger.warning(f"UEBA monitoring failed: {response.status}")
                        return {"risk_score": 0.1, "risk_level": "LOW", "anomaly_detected": False}
        except Exception as e:
            logger.error(f"UEBA monitoring error: {str(e)}")
            return {"risk_score": 0.1, "risk_level": "LOW", "anomaly_detected": False}
    
    def should_block_action(self, risk_score: float) -> bool:
        """Determine if action should be blocked based on risk score"""
        return risk_score > self.risk_threshold

ueba = UEBA()

class SessionManager:
    """Manages session state and context across worker interactions"""
    
    def __init__(self):
        self.sessions = {}
    
    def create_session(self, vin: str, customer_id: Optional[str] = None) -> str:
        """Create a new session"""
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "vin": vin,
            "customer_id": customer_id,
            "created_at": datetime.now(),
            "last_updated": datetime.now(),
            "context": {},
            "worker_results": {},
            "ueba_events": []
        }
        return session_id
    
    def update_session(self, session_id: str, updates: Dict):
        """Update session with new information"""
        if session_id in self.sessions:
            self.sessions[session_id].update(updates)
            self.sessions[session_id]["last_updated"] = datetime.now()
    
    def get_session(self, session_id: str) -> Optional[Dict]:
        """Get session information"""
        return self.sessions.get(session_id)
    
    def cleanup_expired_sessions(self, max_age_hours: int = 24):
        """Clean up expired sessions"""
        cutoff_time = datetime.now() - timedelta(hours=max_age_hours)
        expired_sessions = [
            sid for sid, session in self.sessions.items()
            if session["created_at"] < cutoff_time
        ]
        for sid in expired_sessions:
            del self.sessions[sid]
        logger.info(f"Cleaned up {len(expired_sessions)} expired sessions")

session_manager = SessionManager()

class WorkerOrchestrator:
    """Orchestrates communication with worker agents"""
    
    def __init__(self):
        self.timeout = 30
        self.retry_attempts = 3
    
    async def call_worker(self, worker_name: str, endpoint: str, payload: Dict, session_id: str) -> WorkerResponse:
        """Call a specific worker agent"""
        worker_url = WORKER_URLS.get(worker_name)
        if not worker_url:
            return WorkerResponse(
                worker=worker_name,
                error=f"Worker {worker_name} not configured",
                confidence=0.0
            )
        
        # UEBA monitoring before action
        ueba_result = await ueba.monitor_action(
            agent_id=worker_name,
            action=endpoint,
            context={"session_id": session_id, "payload_keys": list(payload.keys())}
        )
        
        # Block action if risk is too high
        if ueba.should_block_action(ueba_result.get("risk_score", 0.0)):
            logger.warning(f"Blocked {worker_name} action due to high risk: {ueba_result['risk_score']}")
            return WorkerResponse(
                worker=worker_name,
                error=f"Action blocked by UEBA security (risk: {ueba_result['risk_score']:.3f})",
                confidence=0.0
            )
        
        # Add UEBA event to session
        session_manager.update_session(session_id, {
            "ueba_events": session_manager.get_session(session_id).get("ueba_events", []) + [ueba_result]
        })
        
        # Attempt to call worker with retries
        for attempt in range(self.retry_attempts):
            try:
                async with aiohttp.ClientSession() as session:
                    url = f"{worker_url}{endpoint}"
                    async with session.post(
                        url,
                        json=payload,
                        timeout=aiohttp.ClientTimeout(total=self.timeout)
                    ) as response:
                        if response.status == 200:
                            result = await response.json()
                            return WorkerResponse(**result)
                        else:
                            error_text = await response.text()
                            logger.error(f"Worker {worker_name} returned {response.status}: {error_text}")
                            if attempt == self.retry_attempts - 1:
                                return WorkerResponse(
                                    worker=worker_name,
                                    error=f"HTTP {response.status}: {error_text}",
                                    confidence=0.0
                                )
            except asyncio.TimeoutError:
                logger.warning(f"Timeout calling {worker_name} (attempt {attempt + 1})")
                if attempt == self.retry_attempts - 1:
                    return WorkerResponse(
                        worker=worker_name,
                        error="Request timeout",
                        confidence=0.0
                    )
            except Exception as e:
                logger.error(f"Error calling {worker_name}: {str(e)}")
                if attempt == self.retry_attempts - 1:
                    return WorkerResponse(
                        worker=worker_name,
                        error=f"Communication error: {str(e)}",
                        confidence=0.0
                    )
            
            # Wait before retry
            await asyncio.sleep(1 * (attempt + 1))
        
        return WorkerResponse(
            worker=worker_name,
            error="Max retry attempts exceeded",
            confidence=0.0
        )
    
    async def orchestrate_maintenance_workflow(self, request: MaintenanceRequest, session_id: str) -> OrchestrationResult:
        """Orchestrate the complete maintenance workflow"""
        start_time = datetime.now()
        
        # Prepare base context
        base_context = {
            "session_id": session_id,
            "vin": request.vin,
            "customer_id": request.customer_id,
            "priority": request.priority,
            "analysis_type": request.analysis_type
        }
        
        # Define workflow steps
        workflow_steps = [
            ("data_analysis", "/task", {
                **base_context,
                "analysis_type": request.analysis_type
            }),
            ("diagnosis", "/task", {
                **base_context,
                "diagnosis_type": "predictive" if request.analysis_type == "predictive" else "emergency"
            })
        ]
        
        # Add customer engagement for non-emergency cases
        if request.analysis_type != "emergency":
            workflow_steps.append(("customer_engagement", "/task", {
                **base_context,
                "engagement_type": "proactive"
            }))
        
        # Execute workflow steps in parallel where possible
        worker_tasks = []
        for worker_name, endpoint, payload in workflow_steps:
            task = self.call_worker(worker_name, endpoint, payload, session_id)
            worker_tasks.append((worker_name, task))
        
        # Wait for all worker responses
        worker_results = {}
        for worker_name, task in worker_tasks:
            result = await task
            worker_results[worker_name] = result
        
        # Determine next steps based on results
        recommendations = []
        overall_confidence = 0.0
        
        # Analyze results and generate recommendations
        if worker_results.get("data_analysis", {}).get("confidence", 0) > 0.7:
            data_analysis = worker_results["data_analysis"]
            if data_analysis.get("data", {}).get("anomaly_detected", False):
                recommendations.append("Schedule immediate inspection")
                recommendations.append("Monitor sensor readings closely")
        
        if worker_results.get("diagnosis", {}).get("confidence", 0) > 0.6:
            diagnosis = worker_results["diagnosis"]
            if diagnosis.get("data", {}).get("failure_prediction", {}).get("probability", 0) > 0.7:
                recommendations.append("Schedule preventive maintenance")
                recommendations.append("Prepare for potential component replacement")
        
        # Calculate overall confidence
        confidences = [result.confidence for result in worker_results.values() if result.confidence > 0]
        overall_confidence = sum(confidences) / len(confidences) if confidences else 0.0
        
        # Get UEBA status
        session = session_manager.get_session(session_id)
        ueba_events = session.get("ueba_events", []) if session else []
        ueba_status = {
            "total_events": len(ueba_events),
            "high_risk_events": len([e for e in ueba_events if e.get("risk_score", 0) > 0.7]),
            "last_risk_score": ueba_events[-1].get("risk_score", 0) if ueba_events else 0
        }
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return OrchestrationResult(
            session_id=session_id,
            status="completed",
            results=worker_results,
            overall_confidence=overall_confidence,
            recommendations=recommendations,
            ueba_status=ueba_status,
            processing_time_seconds=processing_time,
            timestamp=datetime.now().isoformat()
        )

orchestrator = WorkerOrchestrator()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "master-agent",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "active_sessions": len(session_manager.sessions)
    }

@app.post("/maintenance/analyze", response_model=OrchestrationResult)
async def analyze_maintenance(request: MaintenanceRequest, background_tasks: BackgroundTasks):
    """Analyze vehicle maintenance needs using multi-agent workflow"""
    try:
        # Create session
        session_id = session_manager.create_session(request.vin, request.customer_id)
        
        # Set correlation ID for logging
        correlation_id = session_id[:8]
        logger.info(f"Starting maintenance analysis for {request.vin}", extra={"correlation_id": correlation_id})
        
        # Orchestrate workflow
        result = await orchestrator.orchestrate_maintenance_workflow(request, session_id)
        
        # Schedule cleanup in background
        background_tasks.add_task(session_manager.cleanup_expired_sessions)
        
        logger.info(f"Completed maintenance analysis for {request.vin}", extra={"correlation_id": correlation_id})
        return result
        
    except Exception as e:
        logger.error(f"Error in maintenance analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/emergency/alert", response_model=OrchestrationResult)
async def handle_emergency(request: EmergencyRequest, background_tasks: BackgroundTasks):
    """Handle emergency alerts with high-priority workflow"""
    try:
        # Create session with emergency priority
        session_id = session_manager.create_session(request.vin, request.customer_id)
        
        # Set correlation ID for logging
        correlation_id = session_id[:8]
        logger.warning(f"Emergency alert for {request.vin}: {request.alert_type}", extra={"correlation_id": correlation_id})
        
        # Create emergency maintenance request
        emergency_request = MaintenanceRequest(
            vin=request.vin,
            customer_id=request.customer_id,
            priority="CRITICAL",
            analysis_type="emergency"
        )
        
        # Orchestrate emergency workflow
        result = await orchestrator.orchestrate_maintenance_workflow(emergency_request, session_id)
        
        # Add emergency-specific recommendations
        result.recommendations.insert(0, "IMMEDIATE: Dispatch emergency service")
        result.recommendations.insert(1, "Contact customer immediately")
        
        # Schedule cleanup in background
        background_tasks.add_task(session_manager.cleanup_expired_sessions)
        
        logger.warning(f"Emergency response completed for {request.vin}", extra={"correlation_id": correlation_id})
        return result
        
    except Exception as e:
        logger.error(f"Error in emergency handling: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Emergency response failed: {str(e)}")

@app.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """Get session information"""
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@app.get("/sessions")
async def list_sessions():
    """List all active sessions"""
    return {
        "active_sessions": len(session_manager.sessions),
        "sessions": list(session_manager.sessions.keys())
    }

@app.get("/ueba/status")
async def get_ueba_status():
    """Get UEBA monitoring status"""
    return {
        "risk_threshold": UEBA_THRESHOLD,
        "monitoring_active": True,
        "total_sessions_monitored": len(session_manager.sessions)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
