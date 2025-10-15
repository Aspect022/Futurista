#!/usr/bin/env python3
"""
Diagnosis Worker - DTC Code Analysis and Failure Prediction
Interprets diagnostic trouble codes and predicts component failures
"""

from fastapi import FastAPI
from pydantic import BaseModel, Field
import requests
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Diagnosis Worker", version="1.0")

MOCK_API_BASE = "http://mockapi:8000"

class DiagnosisTask(BaseModel):
    session_id: str
    vin: str
    customer_id: Optional[str] = None
    diagnosis_type: str = "predictive"  # predictive, emergency, routine
    focus_components: Optional[List[str]] = None

class DTCDatabase:
    """Database of Diagnostic Trouble Codes and their interpretations"""
    
    def __init__(self):
        self.dtc_codes = {
            # Engine/Powertrain codes
            "P0301": {
                "description": "Cylinder 1 Misfire Detected",
                "severity": "HIGH",
                "component": "Ignition System",
                "common_causes": ["Faulty spark plug", "Bad ignition coil", "Fuel injector issue"],
                "repair_priority": "HIGH",
                "estimated_cost": 2000,
                "repair_time_hours": 2
            },
            "P0302": {
                "description": "Cylinder 2 Misfire Detected",
                "severity": "HIGH",
                "component": "Ignition System",
                "common_causes": ["Faulty spark plug", "Bad ignition coil", "Fuel injector issue"],
                "repair_priority": "HIGH",
                "estimated_cost": 2000,
                "repair_time_hours": 2
            },
            "P0303": {
                "description": "Cylinder 3 Misfire Detected",
                "severity": "HIGH",
                "component": "Ignition System",
                "common_causes": ["Faulty spark plug", "Bad ignition coil", "Fuel injector issue"],
                "repair_priority": "HIGH",
                "estimated_cost": 2000,
                "repair_time_hours": 2
            },
            "P0304": {
                "description": "Cylinder 4 Misfire Detected",
                "severity": "HIGH",
                "component": "Ignition System",
                "common_causes": ["Faulty spark plug", "Bad ignition coil", "Fuel injector issue"],
                "repair_priority": "HIGH",
                "estimated_cost": 2000,
                "repair_time_hours": 2
            },
            "P0171": {
                "description": "System Too Lean (Bank 1)",
                "severity": "MEDIUM",
                "component": "Fuel System",
                "common_causes": ["Vacuum leak", "MAF sensor issue", "Fuel filter clogged"],
                "repair_priority": "MEDIUM",
                "estimated_cost": 1500,
                "repair_time_hours": 1.5
            },
            "P0172": {
                "description": "System Too Rich (Bank 1)",
                "severity": "MEDIUM",
                "component": "Fuel System",
                "common_causes": ["Faulty oxygen sensor", "Fuel injector leak", "MAF sensor issue"],
                "repair_priority": "MEDIUM",
                "estimated_cost": 1800,
                "repair_time_hours": 2
            },
            "P0420": {
                "description": "Catalyst System Efficiency Below Threshold",
                "severity": "MEDIUM",
                "component": "Emission System",
                "common_causes": ["Failing catalytic converter", "Oxygen sensor issue", "Exhaust leak"],
                "repair_priority": "MEDIUM",
                "estimated_cost": 8000,
                "repair_time_hours": 3
            },
            "P0430": {
                "description": "Catalyst System Efficiency Below Threshold (Bank 2)",
                "severity": "MEDIUM",
                "component": "Emission System",
                "common_causes": ["Failing catalytic converter", "Oxygen sensor issue", "Exhaust leak"],
                "repair_priority": "MEDIUM",
                "estimated_cost": 8000,
                "repair_time_hours": 3
            },
            # Transmission codes
            "P0700": {
                "description": "Transmission Control System Malfunction",
                "severity": "HIGH",
                "component": "Transmission",
                "common_causes": ["Transmission control module issue", "Solenoid problem", "Fluid level low"],
                "repair_priority": "HIGH",
                "estimated_cost": 5000,
                "repair_time_hours": 4
            },
            "P0701": {
                "description": "Transmission Control System Range/Performance",
                "severity": "MEDIUM",
                "component": "Transmission",
                "common_causes": ["Transmission fluid issue", "Solenoid malfunction", "Sensor problem"],
                "repair_priority": "MEDIUM",
                "estimated_cost": 3000,
                "repair_time_hours": 3
            },
            # Electrical codes
            "P0102": {
                "description": "Mass or Volume Air Flow Circuit Low Input",
                "severity": "MEDIUM",
                "component": "Air Intake System",
                "common_causes": ["MAF sensor failure", "Wiring issue", "Air filter clogged"],
                "repair_priority": "MEDIUM",
                "estimated_cost": 2500,
                "repair_time_hours": 1
            },
            "P0103": {
                "description": "Mass or Volume Air Flow Circuit High Input",
                "severity": "MEDIUM",
                "component": "Air Intake System",
                "common_causes": ["MAF sensor failure", "Wiring issue", "Air intake leak"],
                "repair_priority": "MEDIUM",
                "estimated_cost": 2500,
                "repair_time_hours": 1
            },
            # EVAP system codes
            "P0443": {
                "description": "Evaporative Emission Control System Purge Control Valve Circuit",
                "severity": "LOW",
                "component": "Emission System",
                "common_causes": ["Purge valve failure", "Wiring issue", "Vacuum leak"],
                "repair_priority": "LOW",
                "estimated_cost": 1200,
                "repair_time_hours": 1
            },
            "P0445": {
                "description": "Evaporative Emission Control System Purge Control Valve Circuit Shorted",
                "severity": "LOW",
                "component": "Emission System",
                "common_causes": ["Purge valve failure", "Wiring short", "Control module issue"],
                "repair_priority": "LOW",
                "estimated_cost": 1200,
                "repair_time_hours": 1
            },
            # Variable valve timing codes
            "P0010": {
                "description": "Intake Camshaft Position Actuator Circuit (Bank 1)",
                "severity": "MEDIUM",
                "component": "Variable Valve Timing",
                "common_causes": ["VVT solenoid failure", "Oil pressure issue", "Timing chain problem"],
                "repair_priority": "MEDIUM",
                "estimated_cost": 4000,
                "repair_time_hours": 3
            },
            "P0011": {
                "description": "Intake Camshaft Position Timing - Over-Advanced (Bank 1)",
                "severity": "MEDIUM",
                "component": "Variable Valve Timing",
                "common_causes": ["VVT solenoid issue", "Oil pressure low", "Timing chain stretch"],
                "repair_priority": "MEDIUM",
                "estimated_cost": 4000,
                "repair_time_hours": 3
            }
        }
    
    def get_dtc_info(self, dtc_code: str) -> Optional[Dict]:
        """Get information about a specific DTC code"""
        return self.dtc_codes.get(dtc_code)
    
    def analyze_dtc_codes(self, dtc_codes: List[str]) -> Dict:
        """Analyze multiple DTC codes and provide comprehensive diagnosis"""
        analysis_results = {
            "total_codes": len(dtc_codes),
            "codes_analyzed": [],
            "severity_summary": {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0},
            "component_issues": {},
            "estimated_total_cost": 0,
            "estimated_total_time": 0,
            "repair_priority": "LOW"
        }
        
        for dtc in dtc_codes:
            dtc_info = self.get_dtc_info(dtc)
            if dtc_info:
                analysis_results["codes_analyzed"].append({
                    "code": dtc,
                    "description": dtc_info["description"],
                    "severity": dtc_info["severity"],
                    "component": dtc_info["component"],
                    "common_causes": dtc_info["common_causes"],
                    "estimated_cost": dtc_info["estimated_cost"],
                    "repair_time_hours": dtc_info["repair_time_hours"]
                })
                
                # Update severity summary
                analysis_results["severity_summary"][dtc_info["severity"]] += 1
                
                # Group by component
                component = dtc_info["component"]
                if component not in analysis_results["component_issues"]:
                    analysis_results["component_issues"][component] = []
                analysis_results["component_issues"][component].append(dtc)
                
                # Accumulate costs and time
                analysis_results["estimated_total_cost"] += dtc_info["estimated_cost"]
                analysis_results["estimated_total_time"] += dtc_info["repair_time_hours"]
        
        # Determine overall repair priority
        if analysis_results["severity_summary"]["CRITICAL"] > 0:
            analysis_results["repair_priority"] = "CRITICAL"
        elif analysis_results["severity_summary"]["HIGH"] > 0:
            analysis_results["repair_priority"] = "HIGH"
        elif analysis_results["severity_summary"]["MEDIUM"] > 0:
            analysis_results["repair_priority"] = "MEDIUM"
        
        return analysis_results

class FailurePredictor:
    """Predicts component failures based on DTC patterns and vehicle history"""
    
    def __init__(self):
        self.failure_patterns = {
            "ignition_system": {
                "indicators": ["P0301", "P0302", "P0303", "P0304"],
                "failure_threshold": 2,
                "time_to_failure_days": 30
            },
            "fuel_system": {
                "indicators": ["P0171", "P0172"],
                "failure_threshold": 1,
                "time_to_failure_days": 60
            },
            "transmission": {
                "indicators": ["P0700", "P0701"],
                "failure_threshold": 1,
                "time_to_failure_days": 45
            },
            "emission_system": {
                "indicators": ["P0420", "P0430", "P0443", "P0445"],
                "failure_threshold": 2,
                "time_to_failure_days": 90
            }
        }
    
    def predict_failures(self, dtc_codes: List[str], maintenance_history: List[Dict]) -> Dict:
        """Predict component failures based on DTC patterns"""
        predictions = []
        
        for system, pattern in self.failure_patterns.items():
            matching_codes = [code for code in dtc_codes if code in pattern["indicators"]]
            
            if len(matching_codes) >= pattern["failure_threshold"]:
                # Calculate failure probability based on code count and recency
                base_probability = min(0.9, len(matching_codes) * 0.3)
                
                # Adjust based on maintenance history
                recent_services = [s for s in maintenance_history 
                                 if datetime.fromisoformat(s["date"].replace("Z", "+00:00")) > 
                                 datetime.now() - timedelta(days=90)]
                
                if recent_services:
                    base_probability *= 0.7  # Reduce probability if recently serviced
                
                predictions.append({
                    "system": system,
                    "failure_probability": base_probability,
                    "time_to_failure_days": pattern["time_to_failure_days"],
                    "indicating_codes": matching_codes,
                    "confidence": 0.8 if len(matching_codes) >= 2 else 0.6
                })
        
        return {
            "predictions": predictions,
            "highest_risk_system": max(predictions, key=lambda x: x["failure_probability"])["system"] if predictions else None,
            "overall_risk_score": max([p["failure_probability"] for p in predictions]) if predictions else 0.0
        }

dtc_database = DTCDatabase()
failure_predictor = FailurePredictor()

@app.post("/task")
def diagnose_vehicle(task: DiagnosisTask):
    """Diagnose vehicle issues based on DTC codes and sensor data"""
    try:
        # Fetch telematics data from mock API
        try:
            response = requests.get(f"{MOCK_API_BASE}/telematics/{task.vin}", timeout=10)
            if response.status_code != 200:
                return {
                    "worker": "diagnosis",
                    "error": f"Failed to fetch vehicle data: {response.status_code}",
                    "confidence": 0.0
                }
            
            telematics_data = response.json()
        except Exception as e:
            return {
                "worker": "diagnosis",
                "error": f"Error fetching vehicle data: {str(e)}",
                "confidence": 0.0
            }
        
        # Extract DTC codes and maintenance history
        dtc_codes = telematics_data.get("dtc_codes", [])
        maintenance_history = telematics_data.get("maintenance_history", [])
        vehicle_info = telematics_data.get("vehicle_info", {})
        
        # Analyze DTC codes
        dtc_analysis = dtc_database.analyze_dtc_codes(dtc_codes)
        
        # Predict component failures
        failure_predictions = failure_predictor.predict_failures(dtc_codes, maintenance_history)
        
        # Generate diagnosis summary
        diagnosis_summary = generate_diagnosis_summary(dtc_analysis, failure_predictions, task.diagnosis_type)
        
        # Calculate confidence based on data quality and analysis results
        data_quality = 0.9 if len(dtc_codes) > 0 else 0.5
        analysis_confidence = 0.9 if dtc_analysis["total_codes"] > 0 else 0.6
        confidence = min(0.95, (data_quality + analysis_confidence) / 2)
        
        diagnosis_result = {
            "diagnosis_completed": True,
            "vehicle_info": vehicle_info,
            "dtc_analysis": dtc_analysis,
            "failure_predictions": failure_predictions,
            "diagnosis_summary": diagnosis_summary,
            "diagnosis_timestamp": datetime.now().isoformat()
        }
        
        return {
            "worker": "diagnosis",
            "data": diagnosis_result,
            "confidence": confidence,
            "sources": [
                f"telematics/{task.vin}",
                f"dtc_codes/{len(dtc_codes)}_codes",
                f"maintenance_history/{len(maintenance_history)}_records"
            ]
        }
        
    except Exception as e:
        logger.error(f"Diagnosis error: {str(e)}")
        return {
            "worker": "diagnosis",
            "error": f"Diagnosis failed: {str(e)}",
            "confidence": 0.0
        }

def generate_diagnosis_summary(dtc_analysis: Dict, failure_predictions: Dict, diagnosis_type: str) -> Dict:
    """Generate comprehensive diagnosis summary"""
    summary = {
        "overall_health": "HEALTHY",
        "immediate_concerns": [],
        "recommended_actions": [],
        "estimated_repair_cost": dtc_analysis["estimated_total_cost"],
        "estimated_repair_time": dtc_analysis["estimated_total_time"],
        "urgency_level": "LOW"
    }
    
    # Determine overall health
    if dtc_analysis["severity_summary"]["CRITICAL"] > 0:
        summary["overall_health"] = "CRITICAL"
        summary["urgency_level"] = "IMMEDIATE"
    elif dtc_analysis["severity_summary"]["HIGH"] > 0:
        summary["overall_health"] = "POOR"
        summary["urgency_level"] = "HIGH"
    elif dtc_analysis["severity_summary"]["MEDIUM"] > 0:
        summary["overall_health"] = "FAIR"
        summary["urgency_level"] = "MEDIUM"
    
    # Generate immediate concerns
    for code_info in dtc_analysis["codes_analyzed"]:
        if code_info["severity"] in ["CRITICAL", "HIGH"]:
            summary["immediate_concerns"].append({
                "code": code_info["code"],
                "description": code_info["description"],
                "component": code_info["component"],
                "severity": code_info["severity"]
            })
    
    # Generate recommended actions
    if summary["urgency_level"] == "IMMEDIATE":
        summary["recommended_actions"].append("Schedule immediate vehicle inspection")
        summary["recommended_actions"].append("Avoid driving until critical issues are resolved")
    elif summary["urgency_level"] == "HIGH":
        summary["recommended_actions"].append("Schedule service appointment within 48 hours")
        summary["recommended_actions"].append("Monitor vehicle performance closely")
    elif summary["urgency_level"] == "MEDIUM":
        summary["recommended_actions"].append("Schedule service appointment within 1 week")
        summary["recommended_actions"].append("Continue normal driving with caution")
    
    # Add failure prediction recommendations
    for prediction in failure_predictions["predictions"]:
        if prediction["failure_probability"] > 0.7:
            summary["recommended_actions"].append(f"Monitor {prediction['system']} closely - high failure risk")
    
    return summary

@app.get("/health")
def health_check():
    return {"status": "healthy", "worker": "diagnosis"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
