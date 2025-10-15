#!/usr/bin/env python3
"""
Data Analysis Worker - Telematics Analysis and Anomaly Detection
Analyzes vehicle sensor data and identifies potential issues
"""

from fastapi import FastAPI
from pydantic import BaseModel, Field
import requests
import numpy as np
import pandas as pd
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Data Analysis Worker", version="1.0")

MOCK_API_BASE = "http://mockapi:8000"

class DataAnalysisTask(BaseModel):
    session_id: str
    vin: str
    customer_id: Optional[str] = None
    analysis_type: str = "predictive"  # predictive, emergency, routine
    time_window_hours: int = Field(24, ge=1, le=168)  # 1 hour to 1 week

class SensorData(BaseModel):
    timestamp: str
    engine_rpm: float
    speed: float
    fuel_level: float
    battery_voltage: float
    engine_temp: float
    oil_pressure: float

class AnomalyDetection:
    """Advanced anomaly detection for automotive sensor data"""
    
    def __init__(self):
        self.baseline_thresholds = {
            "engine_rpm": {"min": 800, "max": 6000, "normal_range": (1000, 4000)},
            "battery_voltage": {"min": 11.5, "max": 14.5, "normal_range": (12.0, 13.5)},
            "engine_temp": {"min": 70, "max": 110, "normal_range": (80, 95)},
            "oil_pressure": {"min": 20, "max": 80, "normal_range": (30, 60)}
        }
    
    def detect_anomalies(self, sensor_data: Dict) -> Dict:
        """Detect anomalies in sensor data"""
        anomalies = []
        risk_score = 0.0
        
        # Check each sensor against thresholds
        for sensor, value in sensor_data.items():
            if sensor in self.baseline_thresholds:
                threshold = self.baseline_thresholds[sensor]
                
                # Check if value is outside normal range
                if value < threshold["min"] or value > threshold["max"]:
                    severity = "CRITICAL"
                    risk_score += 0.8
                    anomalies.append({
                        "sensor": sensor,
                        "value": value,
                        "threshold": threshold,
                        "severity": severity,
                        "description": f"{sensor} is outside safe operating range"
                    })
                elif value < threshold["normal_range"][0] or value > threshold["normal_range"][1]:
                    severity = "WARNING"
                    risk_score += 0.4
                    anomalies.append({
                        "sensor": sensor,
                        "value": value,
                        "threshold": threshold,
                        "severity": severity,
                        "description": f"{sensor} is outside normal operating range"
                    })
        
        # Check for patterns that indicate issues
        if sensor_data.get("engine_rpm", 0) > 0 and sensor_data.get("speed", 0) == 0:
            risk_score += 0.3
            anomalies.append({
                "sensor": "engine_rpm",
                "value": sensor_data["engine_rpm"],
                "severity": "WARNING",
                "description": "Engine running but vehicle not moving - potential transmission issue"
            })
        
        if sensor_data.get("battery_voltage", 0) < 12.0:
            risk_score += 0.5
            anomalies.append({
                "sensor": "battery_voltage",
                "value": sensor_data["battery_voltage"],
                "severity": "HIGH",
                "description": "Low battery voltage - potential charging system issue"
            })
        
        return {
            "anomalies_detected": len(anomalies) > 0,
            "anomaly_count": len(anomalies),
            "risk_score": min(1.0, risk_score),
            "anomalies": anomalies,
            "overall_health": "CRITICAL" if risk_score > 0.8 else "WARNING" if risk_score > 0.4 else "HEALTHY"
        }

class PredictiveAnalytics:
    """Predictive analytics for failure prediction"""
    
    def __init__(self):
        self.failure_models = {
            "ignition_system": {
                "factors": ["ignition_coil_resistance", "spark_plug_gap"],
                "weights": [0.6, 0.4],
                "threshold": 0.7
            },
            "battery_system": {
                "factors": ["battery_voltage", "engine_temp"],
                "weights": [0.8, 0.2],
                "threshold": 0.6
            },
            "transmission": {
                "factors": ["transmission_fluid_level", "oil_pressure"],
                "weights": [0.7, 0.3],
                "threshold": 0.5
            }
        }
    
    def predict_failures(self, sensor_data: Dict, maintenance_history: List[Dict]) -> Dict:
        """Predict potential failures based on sensor data and history"""
        predictions = []
        
        for system, model in self.failure_models.items():
            risk_score = 0.0
            
            for i, factor in enumerate(model["factors"]):
                if factor in sensor_data:
                    value = sensor_data[factor]
                    weight = model["weights"][i]
                    
                    # Normalize value and calculate risk contribution
                    if factor == "ignition_coil_resistance":
                        # Lower resistance = higher risk
                        risk_score += weight * max(0, (2.5 - value) / 2.5)
                    elif factor == "battery_voltage":
                        # Lower voltage = higher risk
                        risk_score += weight * max(0, (12.0 - value) / 2.0)
                    elif factor == "transmission_fluid_level":
                        # Lower level = higher risk
                        risk_score += weight * max(0, (1.0 - value))
                    else:
                        # Generic risk calculation
                        risk_score += weight * 0.3
            
            # Adjust based on maintenance history
            recent_services = [s for s in maintenance_history 
                             if datetime.fromisoformat(s["date"].replace("Z", "+00:00")) > 
                             datetime.now() - timedelta(days=90)]
            
            if recent_services:
                risk_score *= 0.8  # Reduce risk if recently serviced
            
            if risk_score > model["threshold"]:
                predictions.append({
                    "system": system,
                    "failure_probability": min(0.95, risk_score),
                    "time_to_failure_days": self._estimate_time_to_failure(risk_score),
                    "recommended_action": self._get_recommended_action(system, risk_score)
                })
        
        return {
            "predictions": predictions,
            "highest_risk_system": max(predictions, key=lambda x: x["failure_probability"])["system"] if predictions else None,
            "overall_risk_score": max([p["failure_probability"] for p in predictions]) if predictions else 0.0
        }
    
    def _estimate_time_to_failure(self, risk_score: float) -> int:
        """Estimate time to failure in days"""
        if risk_score > 0.8:
            return 7  # 1 week
        elif risk_score > 0.6:
            return 30  # 1 month
        elif risk_score > 0.4:
            return 90  # 3 months
        else:
            return 180  # 6 months
    
    def _get_recommended_action(self, system: str, risk_score: float) -> str:
        """Get recommended action based on system and risk"""
        if risk_score > 0.8:
            return f"Immediate {system} inspection required"
        elif risk_score > 0.6:
            return f"Schedule {system} maintenance within 2 weeks"
        else:
            return f"Monitor {system} closely during next service"

anomaly_detector = AnomalyDetection()
predictive_analytics = PredictiveAnalytics()

@app.post("/task")
def analyze_telematics_data(task: DataAnalysisTask):
    """Analyze telematics data for anomalies and predictions"""
    try:
        # Fetch telematics data from mock API
        try:
            response = requests.get(f"{MOCK_API_BASE}/telematics/{task.vin}", timeout=10)
            if response.status_code != 200:
                return {
                    "worker": "data_analysis",
                    "error": f"Failed to fetch telematics data: {response.status_code}",
                    "confidence": 0.0
                }
            
            telematics_data = response.json()
        except Exception as e:
            return {
                "worker": "data_analysis",
                "error": f"Error fetching telematics data: {str(e)}",
                "confidence": 0.0
            }
        
        # Extract current sensor data
        current_status = telematics_data.get("current_status", {})
        sensor_data = telematics_data.get("sensor_data", {})
        maintenance_history = telematics_data.get("maintenance_history", [])
        
        # Combine sensor data for analysis
        combined_sensor_data = {**current_status, **sensor_data}
        
        # Perform anomaly detection
        anomaly_results = anomaly_detector.detect_anomalies(combined_sensor_data)
        
        # Perform predictive analytics
        prediction_results = predictive_analytics.predict_failures(combined_sensor_data, maintenance_history)
        
        # Generate insights and recommendations
        insights = generate_insights(anomaly_results, prediction_results, task.analysis_type)
        
        # Calculate confidence based on data quality and analysis results
        data_quality = 0.8 if len(combined_sensor_data) > 5 else 0.6
        analysis_confidence = 0.9 if anomaly_results["anomalies_detected"] or prediction_results["predictions"] else 0.7
        confidence = min(0.95, (data_quality + analysis_confidence) / 2)
        
        analysis_result = {
            "analysis_completed": True,
            "vehicle_info": telematics_data.get("vehicle_info", {}),
            "sensor_data": combined_sensor_data,
            "anomaly_detection": anomaly_results,
            "predictive_analytics": prediction_results,
            "insights": insights,
            "data_quality_score": data_quality,
            "analysis_timestamp": datetime.now().isoformat()
        }
        
        return {
            "worker": "data_analysis",
            "data": analysis_result,
            "confidence": confidence,
            "sources": [
                f"telematics/{task.vin}",
                f"sensor_data/{len(combined_sensor_data)}_sensors",
                f"maintenance_history/{len(maintenance_history)}_records"
            ]
        }
        
    except Exception as e:
        logger.error(f"Data analysis error: {str(e)}")
        return {
            "worker": "data_analysis",
            "error": f"Data analysis failed: {str(e)}",
            "confidence": 0.0
        }

def generate_insights(anomaly_results: Dict, prediction_results: Dict, analysis_type: str) -> Dict:
    """Generate actionable insights from analysis results"""
    insights = {
        "priority_level": "LOW",
        "immediate_actions": [],
        "recommended_actions": [],
        "monitoring_recommendations": []
    }
    
    # Determine priority level
    if anomaly_results["overall_health"] == "CRITICAL" or prediction_results["overall_risk_score"] > 0.8:
        insights["priority_level"] = "CRITICAL"
    elif anomaly_results["overall_health"] == "WARNING" or prediction_results["overall_risk_score"] > 0.5:
        insights["priority_level"] = "HIGH"
    elif anomaly_results["anomalies_detected"] or prediction_results["predictions"]:
        insights["priority_level"] = "MEDIUM"
    
    # Generate immediate actions
    if anomaly_results["anomalies_detected"]:
        critical_anomalies = [a for a in anomaly_results["anomalies"] if a["severity"] == "CRITICAL"]
        if critical_anomalies:
            insights["immediate_actions"].append("Schedule immediate vehicle inspection")
            insights["immediate_actions"].append("Avoid long-distance driving until inspection")
    
    # Generate recommended actions
    for prediction in prediction_results["predictions"]:
        insights["recommended_actions"].append(prediction["recommended_action"])
    
    # Generate monitoring recommendations
    if analysis_type == "predictive":
        insights["monitoring_recommendations"].append("Increase telematics monitoring frequency")
        insights["monitoring_recommendations"].append("Set up automated alerts for sensor anomalies")
    
    return insights

@app.get("/health")
def health_check():
    return {"status": "healthy", "worker": "data_analysis"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
