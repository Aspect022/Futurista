#!/usr/bin/env python3
"""
Customer Engagement Worker - Personalized Customer Communication
Generates voice scripts, notifications, and multi-channel engagement strategies
"""

from fastapi import FastAPI
from pydantic import BaseModel, Field
import requests
import random
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Customer Engagement Worker", version="1.0")

MOCK_API_BASE = "http://mockapi:8000"

class CustomerEngagementTask(BaseModel):
    session_id: str
    vin: str
    customer_id: Optional[str] = None
    engagement_type: str = "proactive"  # proactive, reactive, emergency, follow_up
    communication_channel: Optional[str] = None  # voice, app, sms, email
    urgency_level: str = "MEDIUM"  # LOW, MEDIUM, HIGH, CRITICAL

class VoiceScriptGenerator:
    """Generates personalized voice scripts for customer calls"""
    
    def __init__(self):
        self.language_templates = {
            "Hindi": {
                "greeting": "नमस्ते {name} जी, मैं {agent_name} हूं Hero/Mahindra सेवा केंद्र से।",
                "maintenance_reminder": "आपकी गाड़ी {vin} के लिए नियमित रखरखाव का समय आ गया है।",
                "urgent_issue": "आपकी गाड़ी में एक महत्वपूर्ण समस्या का पता चला है जिसे तुरंत ठीक कराना चाहिए।",
                "scheduling": "क्या आप {date} को {time} बजे सेवा के लिए आ सकते हैं?",
                "closing": "धन्यवाद, आपका दिन शुभ हो।"
            },
            "English": {
                "greeting": "Hello {name}, this is {agent_name} from Hero/Mahindra service center.",
                "maintenance_reminder": "It's time for regular maintenance of your vehicle {vin}.",
                "urgent_issue": "We've detected an important issue with your vehicle that needs immediate attention.",
                "scheduling": "Would you be available for service on {date} at {time}?",
                "closing": "Thank you, have a great day."
            },
            "Tamil": {
                "greeting": "வணக்கம் {name}, நான் {agent_name} Hero/Mahindra சேவை மையத்திலிருந்து பேசுகிறேன்.",
                "maintenance_reminder": "உங்கள் வாகனம் {vin} க்கு வழக்கமான பராமரிப்பு நேரம் வந்துவிட்டது.",
                "urgent_issue": "உங்கள் வாகனத்தில் ஒரு முக்கியமான பிரச்சினை கண்டறியப்பட்டுள்ளது, அது உடனடியாக சரிசெய்யப்பட வேண்டும்.",
                "scheduling": "நீங்கள் {date} அன்று {time} மணிக்கு சேவைக்கு வர முடியுமா?",
                "closing": "நன்றி, உங்கள் நாள் நல்லதாக இருக்கட்டும்."
            }
        }
        
        self.agent_names = ["Priya", "Rajesh", "Anita", "Suresh", "Kavitha", "Vikram"]
    
    def generate_voice_script(self, customer_data: Dict, engagement_context: Dict) -> Dict:
        """Generate personalized voice script"""
        language = customer_data.get("preferences", {}).get("language", "English")
        customer_name = customer_data.get("name", "Valued Customer")
        agent_name = random.choice(self.agent_names)
        
        templates = self.language_templates.get(language, self.language_templates["English"])
        
        # Build script based on engagement type
        script_parts = []
        
        # Greeting
        script_parts.append(templates["greeting"].format(
            name=customer_name.split()[0],  # Use first name
            agent_name=agent_name
        ))
        
        # Main message based on engagement type
        engagement_type = engagement_context.get("engagement_type", "proactive")
        urgency = engagement_context.get("urgency_level", "MEDIUM")
        
        if engagement_type == "emergency" or urgency == "CRITICAL":
            script_parts.append(templates["urgent_issue"])
            script_parts.append("We recommend immediate service to ensure your safety.")
        elif engagement_type == "proactive":
            script_parts.append(templates["maintenance_reminder"])
            script_parts.append("This will help prevent future issues and maintain optimal performance.")
        else:
            script_parts.append("We have some important information about your vehicle.")
        
        # Add specific details
        if "issue_description" in engagement_context:
            script_parts.append(f"The issue detected is: {engagement_context['issue_description']}")
        
        # Scheduling information
        if "suggested_date" in engagement_context and "suggested_time" in engagement_context:
            script_parts.append(templates["scheduling"].format(
                date=engagement_context["suggested_date"],
                time=engagement_context["suggested_time"]
            ))
        
        # Closing
        script_parts.append(templates["closing"])
        
        return {
            "script": " ".join(script_parts),
            "language": language,
            "agent_name": agent_name,
            "estimated_duration_minutes": len(script_parts) * 0.5,  # Rough estimate
            "tone": "professional" if urgency == "CRITICAL" else "friendly"
        }

class NotificationGenerator:
    """Generates multi-channel notifications"""
    
    def __init__(self):
        self.notification_templates = {
            "app": {
                "title": "Vehicle Maintenance Alert",
                "body": "Your vehicle {vin} needs attention. Tap to schedule service.",
                "action": "Schedule Service",
                "priority": "high"
            },
            "sms": {
                "text": "Hero/Mahindra Alert: Your vehicle {vin} needs service. Call {phone} to schedule. Reply STOP to opt out.",
                "max_length": 160
            },
            "email": {
                "subject": "Vehicle Maintenance Required - {vin}",
                "body": """
Dear {name},

We hope this message finds you well. Our advanced monitoring system has detected that your vehicle {vin} requires attention.

{issue_description}

We recommend scheduling a service appointment at your earliest convenience to ensure optimal vehicle performance and safety.

To schedule your service:
- Call us at {phone}
- Use our mobile app
- Visit our website

Thank you for choosing Hero/Mahindra.

Best regards,
Service Team
                """,
                "priority": "normal"
            }
        }
    
    def generate_notifications(self, customer_data: Dict, engagement_context: Dict) -> Dict:
        """Generate notifications for all channels"""
        notifications = {}
        
        # App notification
        app_template = self.notification_templates["app"]
        notifications["app"] = {
            "title": app_template["title"],
            "body": app_template["body"].format(vin=engagement_context.get("vin", "your vehicle")),
            "action": app_template["action"],
            "priority": "high" if engagement_context.get("urgency_level") == "CRITICAL" else "normal",
            "deep_link": f"app://service/schedule?vin={engagement_context.get('vin')}"
        }
        
        # SMS notification
        sms_template = self.notification_templates["sms"]
        notifications["sms"] = {
            "text": sms_template["text"].format(
                vin=engagement_context.get("vin", "your vehicle"),
                phone="+91-80-12345678"
            ),
            "max_length": sms_template["max_length"]
        }
        
        # Email notification
        email_template = self.notification_templates["email"]
        notifications["email"] = {
            "subject": email_template["subject"].format(vin=engagement_context.get("vin", "your vehicle")),
            "body": email_template["body"].format(
                name=customer_data.get("name", "Valued Customer"),
                vin=engagement_context.get("vin", "your vehicle"),
                issue_description=engagement_context.get("issue_description", "Regular maintenance is recommended."),
                phone="+91-80-12345678"
            ),
            "priority": "high" if engagement_context.get("urgency_level") == "CRITICAL" else "normal"
        }
        
        return notifications

class EngagementStrategy:
    """Determines optimal engagement strategy based on customer profile and context"""
    
    def __init__(self):
        self.strategy_rules = {
            "communication_preference": {
                "voice": {"primary": "voice", "secondary": "sms", "tertiary": "app"},
                "app": {"primary": "app", "secondary": "email", "tertiary": "sms"},
                "email": {"primary": "email", "secondary": "app", "tertiary": "sms"}
            },
            "urgency_level": {
                "CRITICAL": {"immediate": "voice", "follow_up": "sms"},
                "HIGH": {"immediate": "app", "follow_up": "email"},
                "MEDIUM": {"immediate": "app", "follow_up": "email"},
                "LOW": {"immediate": "email", "follow_up": "app"}
            },
            "loyalty_tier": {
                "Gold": {"priority": "high", "channels": ["voice", "app", "email"]},
                "Silver": {"priority": "medium", "channels": ["app", "email", "sms"]},
                "Bronze": {"priority": "normal", "channels": ["app", "email"]}
            }
        }
    
    def determine_strategy(self, customer_data: Dict, engagement_context: Dict) -> Dict:
        """Determine optimal engagement strategy"""
        preferences = customer_data.get("preferences", {})
        loyalty_tier = customer_data.get("service_history", {}).get("loyalty_tier", "Bronze")
        urgency = engagement_context.get("urgency_level", "MEDIUM")
        
        # Determine primary communication channel
        comm_pref = preferences.get("communication_method", "app")
        primary_channel = self.strategy_rules["communication_preference"][comm_pref]["primary"]
        
        # Adjust for urgency
        if urgency == "CRITICAL":
            primary_channel = "voice"  # Always use voice for critical issues
        
        # Determine engagement sequence
        engagement_sequence = []
        
        # Immediate engagement
        engagement_sequence.append({
            "channel": primary_channel,
            "timing": "immediate",
            "priority": "high"
        })
        
        # Follow-up engagement
        if urgency in ["CRITICAL", "HIGH"]:
            follow_up_channel = self.strategy_rules["urgency_level"][urgency]["follow_up"]
            engagement_sequence.append({
                "channel": follow_up_channel,
                "timing": "1_hour",
                "priority": "medium"
            })
        
        # Additional engagement for high-value customers
        if loyalty_tier == "Gold" and urgency != "LOW":
            engagement_sequence.append({
                "channel": "email",
                "timing": "24_hours",
                "priority": "low"
            })
        
        return {
            "primary_channel": primary_channel,
            "engagement_sequence": engagement_sequence,
            "personalization_level": "high" if loyalty_tier == "Gold" else "medium",
            "escalation_required": urgency == "CRITICAL"
        }

voice_generator = VoiceScriptGenerator()
notification_generator = NotificationGenerator()
engagement_strategy = EngagementStrategy()

@app.post("/task")
def engage_customer(task: CustomerEngagementTask):
    """Generate customer engagement strategy and content"""
    try:
        # Fetch customer data from mock API
        customer_data = {"name": "Valued Customer", "preferences": {"communication_method": "app", "language": "English"}}
        if task.customer_id:
            try:
                response = requests.get(f"{MOCK_API_BASE}/customers/{task.customer_id}", timeout=5)
                if response.status_code == 200:
                    customer_data = response.json()
            except:
                pass  # Continue with default data
        
        # Prepare engagement context
        engagement_context = {
            "vin": task.vin,
            "engagement_type": task.engagement_type,
            "urgency_level": task.urgency_level,
            "customer_id": task.customer_id,
            "session_id": task.session_id
        }
        
        # Add issue description based on engagement type
        if task.engagement_type == "emergency":
            engagement_context["issue_description"] = "Critical system malfunction detected"
        elif task.engagement_type == "proactive":
            engagement_context["issue_description"] = "Preventive maintenance recommended"
        else:
            engagement_context["issue_description"] = "Service required based on vehicle analysis"
        
        # Add scheduling information
        engagement_context["suggested_date"] = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        engagement_context["suggested_time"] = "10:00 AM"
        
        # Determine engagement strategy
        strategy = engagement_strategy.determine_strategy(customer_data, engagement_context)
        
        # Generate voice script
        voice_script = voice_generator.generate_voice_script(customer_data, engagement_context)
        
        # Generate notifications
        notifications = notification_generator.generate_notifications(customer_data, engagement_context)
        
        # Create engagement plan
        engagement_plan = create_engagement_plan(strategy, voice_script, notifications, customer_data, engagement_context)
        
        # Calculate confidence based on data quality and personalization
        data_quality = 0.9 if task.customer_id else 0.6
        personalization_score = 0.9 if strategy["personalization_level"] == "high" else 0.7
        confidence = min(0.95, (data_quality + personalization_score) / 2)
        
        engagement_result = {
            "engagement_completed": True,
            "customer_profile": {
                "name": customer_data.get("name"),
                "preferences": customer_data.get("preferences", {}),
                "loyalty_tier": customer_data.get("service_history", {}).get("loyalty_tier", "Bronze")
            },
            "engagement_strategy": strategy,
            "voice_script": voice_script,
            "notifications": notifications,
            "engagement_plan": engagement_plan,
            "engagement_timestamp": datetime.now().isoformat()
        }
        
        return {
            "worker": "customer_engagement",
            "data": engagement_result,
            "confidence": confidence,
            "sources": [
                f"customer/{task.customer_id}" if task.customer_id else "default_profile",
                f"vehicle/{task.vin}",
                f"engagement_type/{task.engagement_type}"
            ]
        }
        
    except Exception as e:
        logger.error(f"Customer engagement error: {str(e)}")
        return {
            "worker": "customer_engagement",
            "error": f"Customer engagement failed: {str(e)}",
            "confidence": 0.0
        }

def create_engagement_plan(strategy: Dict, voice_script: Dict, notifications: Dict, customer_data: Dict, context: Dict) -> Dict:
    """Create comprehensive engagement execution plan"""
    plan = {
        "execution_sequence": [],
        "expected_outcomes": [],
        "success_metrics": {},
        "fallback_actions": []
    }
    
    # Build execution sequence based on strategy
    for engagement in strategy["engagement_sequence"]:
        channel = engagement["channel"]
        timing = engagement["timing"]
        
        if channel == "voice":
            plan["execution_sequence"].append({
                "action": "voice_call",
                "content": voice_script,
                "timing": timing,
                "priority": engagement["priority"]
            })
        elif channel == "app":
            plan["execution_sequence"].append({
                "action": "push_notification",
                "content": notifications["app"],
                "timing": timing,
                "priority": engagement["priority"]
            })
        elif channel == "sms":
            plan["execution_sequence"].append({
                "action": "sms_send",
                "content": notifications["sms"],
                "timing": timing,
                "priority": engagement["priority"]
            })
        elif channel == "email":
            plan["execution_sequence"].append({
                "action": "email_send",
                "content": notifications["email"],
                "timing": timing,
                "priority": engagement["priority"]
            })
    
    # Define expected outcomes
    urgency = context.get("urgency_level", "MEDIUM")
    if urgency == "CRITICAL":
        plan["expected_outcomes"] = [
            "Customer acknowledges the issue",
            "Service appointment scheduled within 24 hours",
            "Customer confirms understanding of urgency"
        ]
    else:
        plan["expected_outcomes"] = [
            "Customer receives notification",
            "Service appointment scheduled within 1 week",
            "Customer engagement score maintained"
        ]
    
    # Define success metrics
    plan["success_metrics"] = {
        "response_rate": 0.8 if urgency == "CRITICAL" else 0.6,
        "appointment_scheduling_rate": 0.7,
        "customer_satisfaction_score": 4.0
    }
    
    # Define fallback actions
    if urgency == "CRITICAL":
        plan["fallback_actions"] = [
            "Escalate to senior service advisor",
            "Send emergency SMS with direct contact number",
            "Initiate outbound call if no response in 30 minutes"
        ]
    else:
        plan["fallback_actions"] = [
            "Send follow-up notification after 24 hours",
            "Update customer preference based on response",
            "Schedule automatic reminder for next week"
        ]
    
    return plan

@app.get("/health")
def health_check():
    return {"status": "healthy", "worker": "customer_engagement"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
