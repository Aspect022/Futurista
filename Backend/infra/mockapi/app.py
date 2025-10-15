#!/usr/bin/env python3
"""
Mock API Server for Automotive Predictive Maintenance System
Simulates real automotive data sources including telematics, customer data, and service centers
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import random
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Load sample data
def load_sample_data():
    """Load sample data from JSON files"""
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    
    try:
        with open(os.path.join(data_dir, 'telematics.json'), 'r') as f:
            telematics_data = json.load(f)
    except FileNotFoundError:
        telematics_data = generate_sample_telematics()
    
    try:
        with open(os.path.join(data_dir, 'customers.json'), 'r') as f:
            customers_data = json.load(f)
    except FileNotFoundError:
        customers_data = generate_sample_customers()
    
    try:
        with open(os.path.join(data_dir, 'service_centers.json'), 'r') as f:
            service_centers_data = json.load(f)
    except FileNotFoundError:
        service_centers_data = generate_sample_service_centers()
    
    return telematics_data, customers_data, service_centers_data

def generate_sample_telematics():
    """Generate sample telematics data"""
    return {
        "VIN123ABC": {
            "vehicle_info": {
                "vin": "VIN123ABC",
                "make": "Hero",
                "model": "Splendor",
                "year": 2023,
                "engine_type": "4-stroke",
                "mileage": 15420
            },
            "current_status": {
                "engine_rpm": 1200,
                "speed": 0,
                "fuel_level": 75,
                "battery_voltage": 12.4,
                "engine_temp": 85,
                "oil_pressure": 45,
                "last_updated": datetime.now().isoformat()
            },
            "sensor_data": {
                "ignition_coil_resistance": 2.1,
                "spark_plug_gap": 0.8,
                "air_filter_condition": 0.7,
                "brake_pad_thickness": 8.5,
                "tire_pressure": [32, 31, 33, 32],
                "transmission_fluid_level": 0.8
            },
            "dtc_codes": ["P0301", "P0171"],
            "maintenance_history": [
                {
                    "date": "2024-01-15",
                    "service_type": "Oil Change",
                    "mileage": 12000,
                    "cost": 800,
                    "center": "Hero Service Center Bangalore"
                },
                {
                    "date": "2023-12-01",
                    "service_type": "General Checkup",
                    "mileage": 10000,
                    "cost": 1200,
                    "center": "Hero Service Center Bangalore"
                }
            ]
        },
        "VIN456DEF": {
            "vehicle_info": {
                "vin": "VIN456DEF",
                "make": "Mahindra",
                "model": "XUV300",
                "year": 2022,
                "engine_type": "Diesel",
                "mileage": 28500
            },
            "current_status": {
                "engine_rpm": 0,
                "speed": 0,
                "fuel_level": 20,
                "battery_voltage": 11.8,
                "engine_temp": 0,
                "oil_pressure": 0,
                "last_updated": datetime.now().isoformat()
            },
            "sensor_data": {
                "ignition_coil_resistance": 1.8,
                "spark_plug_gap": 0.9,
                "air_filter_condition": 0.4,
                "brake_pad_thickness": 6.2,
                "tire_pressure": [30, 29, 31, 30],
                "transmission_fluid_level": 0.6
            },
            "dtc_codes": ["P0420", "P0700"],
            "maintenance_history": [
                {
                    "date": "2024-02-01",
                    "service_type": "Transmission Service",
                    "mileage": 25000,
                    "cost": 3500,
                    "center": "Mahindra Service Center Mumbai"
                }
            ]
        }
    }

def generate_sample_customers():
    """Generate sample customer data"""
    return {
        "CUST001": {
            "customer_id": "CUST001",
            "name": "Rajesh Kumar",
            "phone": "+91-9876543210",
            "email": "rajesh.kumar@email.com",
            "address": {
                "street": "123 MG Road",
                "city": "Bangalore",
                "state": "Karnataka",
                "pincode": "560001"
            },
            "preferences": {
                "communication_method": "voice",
                "service_reminders": True,
                "language": "Hindi",
                "preferred_time": "morning"
            },
            "vehicles": ["VIN123ABC"],
            "service_history": {
                "total_services": 5,
                "last_service_date": "2024-01-15",
                "satisfaction_score": 4.2,
                "loyalty_tier": "Gold"
            }
        },
        "CUST002": {
            "customer_id": "CUST002",
            "name": "Priya Sharma",
            "phone": "+91-9876543211",
            "email": "priya.sharma@email.com",
            "address": {
                "street": "456 Park Street",
                "city": "Mumbai",
                "state": "Maharashtra",
                "pincode": "400001"
            },
            "preferences": {
                "communication_method": "app",
                "service_reminders": True,
                "language": "English",
                "preferred_time": "evening"
            },
            "vehicles": ["VIN456DEF"],
            "service_history": {
                "total_services": 3,
                "last_service_date": "2024-02-01",
                "satisfaction_score": 4.5,
                "loyalty_tier": "Silver"
            }
        }
    }

def generate_sample_service_centers():
    """Generate sample service center data"""
    return {
        "centers": [
            {
                "id": "SC001",
                "name": "Hero Service Center Bangalore",
                "location": "Bangalore, Karnataka",
                "address": "123 Service Road, Bangalore",
                "phone": "+91-80-12345678",
                "capacity": 50,
                "specializations": ["Engine", "Transmission", "Electrical"],
                "availability": [
                    "2024-03-10T09:00:00",
                    "2024-03-10T14:00:00",
                    "2024-03-11T10:00:00",
                    "2024-03-11T15:00:00"
                ],
                "ratings": 4.3,
                "services_offered": ["General Maintenance", "Emergency Repair", "Warranty Service"]
            },
            {
                "id": "SC002",
                "name": "Mahindra Service Center Mumbai",
                "location": "Mumbai, Maharashtra",
                "address": "456 Auto Street, Mumbai",
                "phone": "+91-22-87654321",
                "capacity": 75,
                "specializations": ["Diesel Engine", "Transmission", "Suspension"],
                "availability": [
                    "2024-03-10T08:00:00",
                    "2024-03-10T13:00:00",
                    "2024-03-11T09:00:00",
                    "2024-03-11T16:00:00"
                ],
                "ratings": 4.1,
                "services_offered": ["General Maintenance", "Emergency Repair", "Warranty Service", "Fleet Service"]
            }
        ]
    }

# Load data
telematics_data, customers_data, service_centers_data = load_sample_data()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "mock-api",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.route('/telematics/<vin>', methods=['GET'])
def get_telematics(vin):
    """Get telematics data for a specific vehicle"""
    try:
        if vin in telematics_data:
            # Simulate real-time data updates
            vehicle_data = telematics_data[vin].copy()
            vehicle_data['current_status']['last_updated'] = datetime.now().isoformat()
            
            # Add some realistic variations
            if vehicle_data['current_status']['engine_rpm'] > 0:
                vehicle_data['current_status']['engine_rpm'] += random.randint(-50, 50)
                vehicle_data['current_status']['engine_temp'] += random.randint(-2, 2)
            
            return jsonify(vehicle_data)
        else:
            return jsonify({"error": "Vehicle not found"}), 404
    except Exception as e:
        logger.error(f"Error fetching telematics for {vin}: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/customers/<customer_id>', methods=['GET'])
def get_customer(customer_id):
    """Get customer information"""
    try:
        if customer_id in customers_data:
            return jsonify(customers_data[customer_id])
        else:
            return jsonify({"error": "Customer not found"}), 404
    except Exception as e:
        logger.error(f"Error fetching customer {customer_id}: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/service-centers/availability', methods=['GET'])
def get_service_centers():
    """Get available service centers"""
    try:
        return jsonify(service_centers_data)
    except Exception as e:
        logger.error(f"Error fetching service centers: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/service-centers/<center_id>/book', methods=['POST'])
def book_service(center_id):
    """Book a service appointment"""
    try:
        booking_data = request.get_json()
        
        # Find the service center
        center = None
        for sc in service_centers_data['centers']:
            if sc['id'] == center_id:
                center = sc
                break
        
        if not center:
            return jsonify({"error": "Service center not found"}), 404
        
        # Generate booking confirmation
        booking_id = f"BOOK_{uuid.uuid4().hex[:8].upper()}"
        
        booking_result = {
            "booking_id": booking_id,
            "status": "confirmed",
            "center_id": center_id,
            "center_name": center['name'],
            "customer_id": booking_data.get('customer_id'),
            "vin": booking_data.get('vin'),
            "service_type": booking_data.get('service_type'),
            "appointment_date": booking_data.get('preferred_date'),
            "estimated_duration": "2-3 hours",
            "estimated_cost": random.randint(1000, 5000),
            "confirmation_code": f"CONF_{random.randint(100000, 999999)}",
            "created_at": datetime.now().isoformat()
        }
        
        logger.info(f"Service booking created: {booking_id} for {booking_data.get('vin')}")
        return jsonify(booking_result)
        
    except Exception as e:
        logger.error(f"Error booking service: {str(e)}")
        return jsonify({"error": "Booking failed"}), 500

@app.route('/manufacturing/feedback', methods=['POST'])
def submit_manufacturing_feedback():
    """Submit feedback to manufacturing team"""
    try:
        feedback_data = request.get_json()
        
        feedback_id = f"MF_{uuid.uuid4().hex[:8].upper()}"
        
        feedback_result = {
            "feedback_id": feedback_id,
            "status": "submitted",
            "component": feedback_data.get('component'),
            "issue_type": feedback_data.get('issue_type'),
            "priority": feedback_data.get('priority'),
            "recommendations": feedback_data.get('recommendations'),
            "submitted_at": datetime.now().isoformat(),
            "estimated_review_time": "2-3 business days"
        }
        
        logger.info(f"Manufacturing feedback submitted: {feedback_id}")
        return jsonify(feedback_result)
        
    except Exception as e:
        logger.error(f"Error submitting manufacturing feedback: {str(e)}")
        return jsonify({"error": "Feedback submission failed"}), 500

@app.route('/ueba/monitor', methods=['POST'])
def ueba_monitor():
    """UEBA security monitoring endpoint"""
    try:
        monitoring_data = request.get_json()
        
        # Simulate UEBA analysis
        agent_id = monitoring_data.get('agent_id', 'unknown')
        action = monitoring_data.get('action', 'unknown')
        
        # Calculate risk score based on action type
        risk_factors = {
            'data_access': 0.2,
            'customer_contact': 0.3,
            'service_booking': 0.1,
            'manufacturing_feedback': 0.4,
            'emergency_override': 0.8
        }
        
        base_risk = risk_factors.get(action, 0.5)
        risk_score = base_risk + random.uniform(-0.1, 0.1)
        risk_score = max(0.0, min(1.0, risk_score))
        
        ueba_result = {
            "monitoring_id": f"UEBA_{uuid.uuid4().hex[:8].upper()}",
            "agent_id": agent_id,
            "action": action,
            "risk_score": round(risk_score, 3),
            "risk_level": "HIGH" if risk_score > 0.7 else "MEDIUM" if risk_score > 0.4 else "LOW",
            "anomaly_detected": risk_score > 0.7,
            "recommended_action": "BLOCK" if risk_score > 0.7 else "MONITOR" if risk_score > 0.4 else "ALLOW",
            "timestamp": datetime.now().isoformat(),
            "confidence": random.uniform(0.8, 0.95)
        }
        
        logger.info(f"UEBA monitoring: {agent_id} - Risk: {risk_score:.3f}")
        return jsonify(ueba_result)
        
    except Exception as e:
        logger.error(f"Error in UEBA monitoring: {str(e)}")
        return jsonify({"error": "UEBA monitoring failed"}), 500

@app.route('/analytics/predictions', methods=['POST'])
def get_predictions():
    """Get failure predictions for analytics"""
    try:
        request_data = request.get_json()
        vin = request_data.get('vin')
        
        if vin not in telematics_data:
            return jsonify({"error": "Vehicle not found"}), 404
        
        # Simulate ML prediction
        vehicle_data = telematics_data[vin]
        dtc_codes = vehicle_data.get('dtc_codes', [])
        
        # Calculate failure probability based on DTC codes and sensor data
        base_probability = 0.1
        for dtc in dtc_codes:
            if dtc in ['P0301', 'P0420', 'P0700']:
                base_probability += 0.3
        
        # Add sensor-based factors
        sensor_data = vehicle_data.get('sensor_data', {})
        if sensor_data.get('ignition_coil_resistance', 2.0) < 1.5:
            base_probability += 0.2
        if sensor_data.get('air_filter_condition', 1.0) < 0.5:
            base_probability += 0.1
        
        failure_probability = min(0.95, base_probability)
        
        prediction_result = {
            "vin": vin,
            "failure_prediction": {
                "probability": round(failure_probability, 3),
                "component": "Ignition System" if 'P0301' in dtc_codes else "Transmission" if 'P0700' in dtc_codes else "Engine",
                "time_to_failure_days": random.randint(7, 30),
                "confidence": random.uniform(0.7, 0.9)
            },
            "recommendations": [
                "Schedule immediate inspection",
                "Monitor sensor readings closely",
                "Prepare for potential component replacement"
            ],
            "generated_at": datetime.now().isoformat()
        }
        
        return jsonify(prediction_result)
        
    except Exception as e:
        logger.error(f"Error generating predictions: {str(e)}")
        return jsonify({"error": "Prediction generation failed"}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    logger.info("Starting Mock API Server...")
    app.run(host='0.0.0.0', port=8000, debug=False)
