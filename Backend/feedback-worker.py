# workers/feedback/app.py - Feedback Worker Agent
from fastapi import FastAPI
from pydantic import BaseModel
import requests
import random
from typing import Dict, List, Optional
from datetime import datetime, timedelta

app = FastAPI(title="Feedback Worker", version="1.0")

MOCK_API_BASE = "http://mockapi:8000"

class FeedbackTask(BaseModel):
    session_id: str
    customer_id: str
    vin: str
    service_type: str
    booking_id: Optional[str] = None
    feedback_type: str = "post_service"  # post_service, follow_up, satisfaction

def generate_feedback_survey(service_type: str, customer_profile: Dict) -> Dict:
    """Generate personalized feedback survey based on service and customer"""
    
    base_questions = [
        {
            "id": "overall_satisfaction",
            "question": "How satisfied are you with the overall service experience?",
            "type": "rating",
            "scale": "1-5"
        },
        {
            "id": "service_quality",
            "question": f"How would you rate the quality of the {service_type}?",
            "type": "rating", 
            "scale": "1-5"
        },
        {
            "id": "technician_expertise",
            "question": "How knowledgeable was the service technician?",
            "type": "rating",
            "scale": "1-5"
        },
        {
            "id": "wait_time",
            "question": "Was the service completed within the expected timeframe?",
            "type": "boolean"
        },
        {
            "id": "communication",
            "question": "How clear was the communication about the service performed?",
            "type": "rating",
            "scale": "1-5"
        }
    ]
    
    # Add service-specific questions
    if "Emergency" in service_type:
        base_questions.append({
            "id": "emergency_response",
            "question": "How satisfied were you with our emergency response time?",
            "type": "rating",
            "scale": "1-5"
        })
    
    # Personalize based on customer communication preference
    comm_pref = customer_profile.get("communication_preference", "app")
    survey_method = "voice_call" if comm_pref == "voice" else "app_notification"
    
    return {
        "survey_id": f"SURVEY_{random.randint(1000, 9999)}",
        "questions": base_questions,
        "delivery_method": survey_method,
        "estimated_duration_minutes": 3,
        "incentive": "₹50 service credit for completion"
    }

def simulate_customer_feedback(service_type: str, service_quality_score: float = 0.8) -> Dict:
    """Simulate customer feedback responses based on service quality"""
    
    # Base satisfaction influenced by service quality
    base_satisfaction = min(5, max(1, int(service_quality_score * 5)))
    
    responses = {
        "overall_satisfaction": base_satisfaction,
        "service_quality": base_satisfaction + random.choice([-1, 0, 1]),
        "technician_expertise": base_satisfaction,
        "wait_time": service_quality_score > 0.7,
        "communication": base_satisfaction + random.choice([-1, 0, 1]),
        "likelihood_to_recommend": min(10, max(1, int(service_quality_score * 10))),
        "comments": generate_feedback_comments(base_satisfaction)
    }
    
    # Add emergency-specific feedback if applicable
    if "Emergency" in service_type:
        responses["emergency_response"] = 5 if service_quality_score > 0.8 else 4
    
    # Ensure ratings are within valid range
    for key, value in responses.items():
        if isinstance(value, int) and key != "likelihood_to_recommend":
            responses[key] = min(5, max(1, value))
    
    return responses

def generate_feedback_comments(satisfaction_score: int) -> str:
    """Generate realistic feedback comments based on satisfaction"""
    
    positive_comments = [
        "Excellent service! Very professional and quick.",
        "Great experience, will definitely recommend to others.",
        "Technician was knowledgeable and explained everything clearly.",
        "Service was completed faster than expected.",
        "Very satisfied with the proactive approach."
    ]
    
    neutral_comments = [
        "Service was okay, met basic expectations.",
        "Average experience, nothing exceptional.",
        "Service was completed as promised.",
        "Fair pricing and reasonable wait time."
    ]
    
    negative_comments = [
        "Service took longer than expected.",
        "Communication could be better.",
        "Had to follow up multiple times.",
        "Expected better quality for the price.",
        "Technician seemed rushed."
    ]
    
    if satisfaction_score >= 4:
        return random.choice(positive_comments)
    elif satisfaction_score >= 3:
        return random.choice(neutral_comments)
    else:
        return random.choice(negative_comments)

def calculate_customer_retention_score(feedback_responses: Dict) -> Dict:
    """Calculate customer retention probability based on feedback"""
    
    # Weight different factors
    weights = {
        "overall_satisfaction": 0.3,
        "service_quality": 0.25,
        "technician_expertise": 0.2,
        "communication": 0.15,
        "wait_time": 0.1
    }
    
    weighted_score = 0
    for factor, weight in weights.items():
        if factor in feedback_responses:
            if isinstance(feedback_responses[factor], bool):
                score = 5 if feedback_responses[factor] else 1
            else:
                score = feedback_responses[factor]
            weighted_score += (score / 5) * weight
    
    retention_probability = min(1.0, weighted_score * 1.2)  # Boost for good service
    
    return {
        "retention_probability": retention_probability,
        "retention_category": get_retention_category(retention_probability),
        "recommended_actions": get_retention_actions(retention_probability)
    }

def get_retention_category(probability: float) -> str:
    """Categorize retention probability"""
    if probability >= 0.8:
        return "HIGH_LOYALTY"
    elif probability >= 0.6:
        return "MODERATE_LOYALTY"
    elif probability >= 0.4:
        return "AT_RISK"
    else:
        return "CHURN_RISK"

def get_retention_actions(probability: float) -> List[str]:
    """Recommend actions based on retention probability"""
    if probability >= 0.8:
        return [
            "Send thank you message",
            "Offer loyalty program enrollment",
            "Request referral"
        ]
    elif probability >= 0.6:
        return [
            "Follow up with satisfaction call",
            "Offer service reminders",
            "Provide maintenance tips"
        ]
    elif probability >= 0.4:
        return [
            "Schedule retention call",
            "Offer service discount",
            "Address specific concerns"
        ]
    else:
        return [
            "Immediate manager follow-up",
            "Offer service credit",
            "Implement service recovery plan"
        ]

@app.post("/task")
def process_feedback(task: FeedbackTask):
    """Process customer feedback and generate insights"""
    try:
        # Get customer profile
        customer_data = {"name": "Valued Customer", "communication_preference": "app"}
        if task.customer_id:
            try:
                customer_response = requests.get(f"{MOCK_API_BASE}/customers/{task.customer_id}", timeout=5)
                if customer_response.status_code == 200:
                    customer_data = customer_response.json()
            except:
                pass  # Continue with default data
        
        # Generate feedback survey
        survey = generate_feedback_survey(task.service_type, customer_data)
        
        # Simulate customer response (in real implementation, this would come from customer)
        service_quality = random.uniform(0.6, 0.95)  # Mock service quality
        feedback_responses = simulate_customer_feedback(task.service_type, service_quality)
        
        # Calculate retention metrics
        retention_analysis = calculate_customer_retention_score(feedback_responses)
        
        # Generate improvement recommendations
        improvement_areas = []
        for key, value in feedback_responses.items():
            if isinstance(value, int) and value < 4:
                improvement_areas.append(key.replace("_", " ").title())
        
        feedback_result = {
            "feedback_collected": True,
            "survey_details": survey,
            "customer_responses": feedback_responses,
            "retention_analysis": retention_analysis,
            "satisfaction_metrics": {
                "overall_score": feedback_responses.get("overall_satisfaction", 4),
                "nps_score": feedback_responses.get("likelihood_to_recommend", 8),
                "service_quality_score": feedback_responses.get("service_quality", 4)
            },
            "improvement_areas": improvement_areas,
            "follow_up_required": retention_analysis["retention_probability"] < 0.6,
            "next_contact_date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
        }
        
        # Calculate confidence based on response completeness
        response_completeness = len([v for v in feedback_responses.values() if v is not None]) / len(survey["questions"])
        confidence = min(0.9, 0.5 + (response_completeness * 0.4))
        
        return {
            "worker": "feedback",
            "data": feedback_result,
            "confidence": confidence,
            "sources": [f"customer/{task.customer_id}", f"survey/{survey['survey_id']}"]
        }
        
    except Exception as e:
        return {
            "worker": "feedback",
            "error": f"Feedback processing failed: {str(e)}",
            "confidence": 0.0
        }

@app.get("/health")
def health_check():
    return {"status": "healthy", "worker": "feedback"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)