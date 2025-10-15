# workers/manufacturing_insights/app.py - Manufacturing Insights Worker Agent
from fastapi import FastAPI
from pydantic import BaseModel
import requests
import json
from typing import Dict, List, Optional
from datetime import datetime
from collections import Counter

app = FastAPI(title="Manufacturing Insights Worker", version="1.0")

MOCK_API_BASE = "http://mockapi:8000"

class ManufacturingTask(BaseModel):
    session_id: str
    vin: str
    failure_analysis: Dict
    maintenance_history: List[Dict]
    component_focus: Optional[str] = None

def analyze_failure_patterns(failure_data: Dict, maintenance_history: List[Dict]) -> Dict:
    """Analyze component failure patterns for manufacturing insights"""
    
    # Extract failure information
    component = failure_data.get("failure_prediction", {}).get("component", "Unknown")
    probability = failure_data.get("failure_prediction", {}).get("probability", 0.0)
    
    # Analyze maintenance history for patterns
    component_failures = []
    dtc_patterns = []
    
    for service in maintenance_history:
        if service.get("dtc_resolved"):
            dtc_patterns.extend(service["dtc_resolved"])
    
    # Count DTC occurrences
    dtc_frequency = Counter(dtc_patterns)
    
    # Identify recurring issues
    recurring_issues = []
    for dtc, count in dtc_frequency.items():
        if count >= 2:  # Occurred 2+ times
            recurring_issues.append({
                "dtc_code": dtc,
                "frequency": count,
                "component": get_component_from_dtc(dtc)
            })
    
    return {
        "primary_component": component,
        "failure_probability": probability,
        "recurring_failures": recurring_issues,
        "maintenance_frequency": len(maintenance_history),
        "pattern_severity": "HIGH" if len(recurring_issues) > 0 else "MEDIUM" if probability > 0.7 else "LOW"
    }

def get_component_from_dtc(dtc_code: str) -> str:
    """Map DTC codes to components"""
    dtc_component_map = {
        "P0301": "Ignition Coil",
        "P0420": "Catalytic Converter", 
        "P0171": "Fuel System",
        "P0700": "Transmission Control Module",
        "P0102": "Mass Air Flow Sensor",
        "P0443": "EVAP System",
        "P0010": "Variable Valve Timing"
    }
    return dtc_component_map.get(dtc_code, "Unknown Component")

def generate_manufacturing_recommendations(failure_patterns: Dict, vin: str) -> Dict:
    """Generate recommendations for manufacturing team"""
    
    recommendations = []
    priority = "MEDIUM"
    
    # High frequency failures
    if failure_patterns["pattern_severity"] == "HIGH":
        priority = "HIGH"
        recommendations.extend([
            "Conduct design review for recurring failure components",
            "Analyze supplier quality for affected parts",
            "Implement additional quality checks in production",
            "Consider component redesign or material upgrade"
        ])
    
    # Specific component recommendations
    component = failure_patterns["primary_component"]
    
    if component == "Ignition Coil":
        recommendations.extend([
            "Review ignition coil wire harness routing",
            "Evaluate heat shielding effectiveness",
            "Consider upgraded coil specifications"
        ])
    elif component == "Battery":
        recommendations.extend([
            "Assess battery mounting and vibration isolation",
            "Review charging system calibration",
            "Evaluate battery supplier specifications"
        ])
    elif component == "Transmission":
        recommendations.extend([
            "Review transmission fluid specifications",
            "Analyze gear shift programming",
            "Evaluate transmission cooling system"
        ])
    
    # Extract vehicle model info from VIN (simplified)
    model_year = "2024"  # Simplified extraction
    model_series = vin[:3] if len(vin) >= 3 else "UNK"
    
    return {
        "recommendations": recommendations,
        "priority": priority,
        "affected_model": {
            "series": model_series,
            "year": model_year,
            "estimated_fleet_impact": estimate_fleet_impact(failure_patterns)
        },
        "cost_impact": calculate_cost_impact(failure_patterns),
        "timeline": {
            "investigation": "2-4 weeks",
            "implementation": "6-12 weeks",
            "validation": "4-8 weeks"
        }
    }

def estimate_fleet_impact(failure_patterns: Dict) -> Dict:
    """Estimate the potential fleet impact of the identified issues"""
    
    base_impact = 1000  # Assumed fleet size
    failure_rate = failure_patterns.get("failure_probability", 0.0)
    recurring_multiplier = len(failure_patterns.get("recurring_failures", []))
    
    potentially_affected = int(base_impact * failure_rate * (1 + recurring_multiplier * 0.5))
    
    return {
        "potentially_affected_vehicles": potentially_affected,
        "estimated_failure_rate": f"{failure_rate:.1%}",
        "warranty_risk": "HIGH" if potentially_affected > 500 else "MEDIUM" if potentially_affected > 200 else "LOW"
    }

def calculate_cost_impact(failure_patterns: Dict) -> Dict:
    """Calculate estimated cost impact of manufacturing changes"""
    
    base_investigation_cost = 500000  # ₹5 lakh base investigation
    recurring_issues = failure_patterns.get("recurring_failures", [])
    
    investigation_cost = base_investigation_cost * (1 + len(recurring_issues) * 0.3)
    
    # Estimated implementation costs
    implementation_cost = investigation_cost * 3  # 3x investigation cost
    
    # Potential savings from preventing failures
    vehicles_affected = estimate_fleet_impact(failure_patterns)["potentially_affected_vehicles"]
    avg_repair_cost = 15000  # ₹15k average repair cost
    potential_savings = vehicles_affected * avg_repair_cost * 0.7  # 70% prevention rate
    
    return {
        "investigation_cost_inr": investigation_cost,
        "implementation_cost_inr": implementation_cost,
        "potential_savings_inr": potential_savings,
        "net_benefit_inr": potential_savings - investigation_cost - implementation_cost,
        "roi_percentage": ((potential_savings - investigation_cost - implementation_cost) / (investigation_cost + implementation_cost)) * 100 if (investigation_cost + implementation_cost) > 0 else 0
    }

def submit_manufacturing_feedback(recommendations: Dict, failure_patterns: Dict) -> Dict:
    """Submit feedback to manufacturing system"""
    
    feedback_data = {
        "component": failure_patterns.get("primary_component"),
        "issue_type": "recurring_failure",
        "frequency": len(failure_patterns.get("recurring_failures", [])),
        "priority": recommendations["priority"],
        "recommendations": recommendations["recommendations"]
    }
    
    try:
        feedback_response = requests.post(
            f"{MOCK_API_BASE}/manufacturing/feedback",
            json=feedback_data,
            timeout=10
        )
        
        if feedback_response.status_code == 200:
            return feedback_response.json()
        else:
            return {"error": f"Feedback submission failed: {feedback_response.status_code}"}
    
    except Exception as e:
        return {"error": f"Feedback submission error: {str(e)}"}

@app.post("/task")
def generate_manufacturing_insights(task: ManufacturingTask):
    """Generate manufacturing insights from failure analysis"""
    try:
        # Analyze failure patterns
        failure_patterns = analyze_failure_patterns(
            task.failure_analysis, 
            task.maintenance_history
        )
        
        # Generate manufacturing recommendations
        manufacturing_recommendations = generate_manufacturing_recommendations(
            failure_patterns, 
            task.vin
        )
        
        # Submit feedback to manufacturing team
        feedback_submission = submit_manufacturing_feedback(
            manufacturing_recommendations,
            failure_patterns
        )
        
        insights_result = {
            "analysis_completed": True,
            "failure_patterns": failure_patterns,
            "manufacturing_recommendations": manufacturing_recommendations,
            "feedback_submission": feedback_submission,
            "quality_metrics": {
                "defect_likelihood": failure_patterns.get("failure_probability", 0.0),
                "recurring_issue_count": len(failure_patterns.get("recurring_failures", [])),
                "fleet_risk_level": manufacturing_recommendations["affected_model"]["estimated_fleet_impact"]["warranty_risk"]
            },
            "business_impact": {
                "cost_avoidance_potential": manufacturing_recommendations["cost_impact"]["potential_savings_inr"],
                "roi_projection": manufacturing_recommendations["cost_impact"]["roi_percentage"],
                "timeline_to_resolution": manufacturing_recommendations["timeline"]["implementation"]
            }
        }
        
        # Calculate confidence based on data quality and pattern strength
        data_quality = 0.8 if len(task.maintenance_history) > 2 else 0.6
        pattern_strength = 0.9 if failure_patterns["pattern_severity"] == "HIGH" else 0.7
        confidence = min(0.95, (data_quality + pattern_strength) / 2)
        
        return {
            "worker": "manufacturing_insights",
            "data": insights_result,
            "confidence": confidence,
            "sources": [
                f"vehicle/{task.vin}",
                f"maintenance_history/{len(task.maintenance_history)}_records",
                f"manufacturing_feedback/{feedback_submission.get('feedback_id', 'unknown')}"
            ]
        }
        
    except Exception as e:
        return {
            "worker": "manufacturing_insights",
            "error": f"Manufacturing insights generation failed: {str(e)}",
            "confidence": 0.0
        }

@app.get("/health")
def health_check():
    return {"status": "healthy", "worker": "manufacturing_insights"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8006)