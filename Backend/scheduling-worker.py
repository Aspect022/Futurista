# workers/scheduling/app.py - Scheduling Worker Agent
from fastapi import FastAPI
from pydantic import BaseModel
import requests
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional

app = FastAPI(title="Scheduling Worker", version="1.0")

MOCK_API_BASE = "http://mockapi:8000"

class SchedulingTask(BaseModel):
    session_id: str
    customer_id: Optional[str] = None
    vin: str
    service_type: str = "General Maintenance"
    priority: str = "MEDIUM"  # LOW, MEDIUM, HIGH, CRITICAL
    preferred_date: Optional[str] = None

def find_optimal_service_center(customer_location: str = None, priority: str = "MEDIUM") -> Dict:
    """Find the best available service center based on location and priority"""
    try:
        # Fetch available service centers
        centers_response = requests.get(f"{MOCK_API_BASE}/service-centers/availability", timeout=5)
        if centers_response.status_code != 200:
            return {"error": "Service centers unavailable"}
        
        centers = centers_response.json().get("centers", [])
        
        # Filter by availability and priority
        available_centers = []
        for center in centers:
            if center.get("availability") and len(center["availability"]) > 0:
                # Priority customers get better time slots
                if priority in ["HIGH", "CRITICAL"]:
                    # Reserve earliest slots for high priority
                    available_slots = center["availability"][:2]
                else:
                    available_slots = center["availability"]
                
                if available_slots:
                    available_centers.append({
                        **center,
                        "available_slots": available_slots,
                        "distance_score": random.uniform(0.5, 1.0)  # Mock distance scoring
                    })
        
        if not available_centers:
            return {"error": "No available service centers"}
        
        # Sort by distance and capacity
        best_center = sorted(available_centers, 
                           key=lambda x: (x["distance_score"], -x["capacity"]))[0]
        
        return {
            "center_id": best_center["id"],
            "center_name": best_center["name"],
            "location": best_center["location"],
            "available_dates": best_center["available_slots"],
            "recommended_date": best_center["available_slots"][0],
            "capacity": best_center["capacity"]
        }
    
    except Exception as e:
        return {"error": f"Center lookup failed: {str(e)}"}

def book_service_appointment(center_id: str, customer_id: str, vin: str, 
                           service_type: str, preferred_date: str) -> Dict:
    """Book a service appointment at the selected center"""
    try:
        booking_data = {
            "customer_id": customer_id,
            "vin": vin,
            "service_type": service_type,
            "preferred_date": preferred_date
        }
        
        booking_response = requests.post(
            f"{MOCK_API_BASE}/service-centers/{center_id}/book",
            json=booking_data,
            timeout=10
        )
        
        if booking_response.status_code == 200:
            return booking_response.json()
        else:
            return {"error": f"Booking failed with status {booking_response.status_code}"}
    
    except Exception as e:
        return {"error": f"Booking request failed: {str(e)}"}

def calculate_service_urgency(priority: str, service_type: str) -> Dict:
    """Calculate scheduling urgency and time allocation"""
    urgency_mapping = {
        "CRITICAL": {"slots_needed": 2, "max_wait_days": 1},
        "HIGH": {"slots_needed": 1.5, "max_wait_days": 3},
        "MEDIUM": {"slots_needed": 1, "max_wait_days": 7},
        "LOW": {"slots_needed": 0.5, "max_wait_days": 14}
    }
    
    service_complexity = {
        "Emergency Repair": 2.0,
        "Ignition System Service": 1.5,
        "Transmission Service": 2.5,
        "General Maintenance": 1.0,
        "Sensor Replacement": 0.5
    }
    
    base_urgency = urgency_mapping.get(priority, urgency_mapping["MEDIUM"])
    complexity_factor = service_complexity.get(service_type, 1.0)
    
    return {
        "time_slots_needed": base_urgency["slots_needed"] * complexity_factor,
        "max_wait_days": base_urgency["max_wait_days"],
        "estimated_duration_hours": complexity_factor * 2,
        "requires_specialist": complexity_factor > 1.5
    }

@app.post("/task")
def schedule_service(task: SchedulingTask):
    """Schedule service appointment for vehicle"""
    try:
        # Calculate service urgency
        urgency_info = calculate_service_urgency(task.priority, task.service_type)
        
        # Find optimal service center
        center_info = find_optimal_service_center(priority=task.priority)
        
        if "error" in center_info:
            return {
                "worker": "scheduling",
                "error": center_info["error"],
                "confidence": 0.0
            }
        
        # Book the appointment
        booking_result = book_service_appointment(
            center_id=center_info["center_id"],
            customer_id=task.customer_id,
            vin=task.vin,
            service_type=task.service_type,
            preferred_date=task.preferred_date or center_info["recommended_date"]
        )
        
        if "error" in booking_result:
            return {
                "worker": "scheduling",
                "error": booking_result["error"],
                "confidence": 0.3,
                "fallback_centers": [center_info]
            }
        
        # Successful booking
        scheduling_result = {
            "booking_confirmed": True,
            "booking_details": booking_result,
            "service_center": center_info,
            "urgency_assessment": urgency_info,
            "scheduling_metrics": {
                "response_time_minutes": 5 if task.priority == "CRITICAL" else 15,
                "confirmation_sent": True,
                "calendar_integration": True
            }
        }
        
        # Calculate confidence based on booking success and center availability
        confidence = 0.95 if booking_result.get("status") == "confirmed" else 0.7
        
        return {
            "worker": "scheduling",
            "data": scheduling_result,
            "confidence": confidence,
            "sources": [f"service_center/{center_info['center_id']}", f"booking/{booking_result.get('booking_id')}"]
        }
        
    except Exception as e:
        return {
            "worker": "scheduling",
            "error": f"Scheduling failed: {str(e)}",
            "confidence": 0.0
        }

@app.post("/batch-schedule")
def batch_schedule_fleet(fleet_vehicles: List[Dict]):
    """Schedule multiple vehicles for fleet management"""
    try:
        batch_results = []
        
        # Sort by priority for optimal scheduling
        sorted_vehicles = sorted(fleet_vehicles, 
                               key=lambda x: {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}.get(x.get("priority", "MEDIUM"), 2),
                               reverse=True)
        
        for vehicle in sorted_vehicles:
            task = SchedulingTask(**vehicle)
            result = schedule_service(task)
            batch_results.append({
                "vin": vehicle["vin"],
                "result": result
            })
        
        successful_bookings = sum(1 for r in batch_results if r["result"].get("confidence", 0) > 0.7)
        
        return {
            "worker": "scheduling",
            "data": {
                "batch_scheduling": True,
                "total_vehicles": len(fleet_vehicles),
                "successful_bookings": successful_bookings,
                "success_rate": successful_bookings / len(fleet_vehicles),
                "results": batch_results
            },
            "confidence": successful_bookings / len(fleet_vehicles),
            "sources": ["fleet_management"]
        }
        
    except Exception as e:
        return {
            "worker": "scheduling",
            "error": f"Batch scheduling failed: {str(e)}",
            "confidence": 0.0
        }

@app.get("/health")
def health_check():
    return {"status": "healthy", "worker": "scheduling"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)