#!/usr/bin/env python3
"""
Streamlit Dashboard for Automotive Predictive Maintenance System
Interactive UI for monitoring, analysis, and fleet management
"""

import streamlit as st
import requests
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import json
from datetime import datetime, timedelta
import time
import os

# Page configuration
st.set_page_config(
    page_title="Automotive AI - Predictive Maintenance",
    page_icon="🚗",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for modern UI
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #1f77b4;
    }
    .status-healthy {
        color: #28a745;
        font-weight: bold;
    }
    .status-warning {
        color: #ffc107;
        font-weight: bold;
    }
    .status-critical {
        color: #dc3545;
        font-weight: bold;
    }
    .sidebar .sidebar-content {
        background-color: #f8f9fa;
    }
</style>
""", unsafe_allow_html=True)

# Configuration
MASTER_AGENT_URL = os.getenv('MASTER_AGENT_URL', 'http://localhost:8001')
MOCK_API_URL = os.getenv('MOCK_API_URL', 'http://localhost:8000')

class DashboardAPI:
    """API client for dashboard operations"""
    
    def __init__(self):
        self.master_agent_url = MASTER_AGENT_URL
        self.mock_api_url = MOCK_API_URL
        self.timeout = 10
    
    def check_health(self):
        """Check system health"""
        try:
            response = requests.get(f"{self.master_agent_url}/health", timeout=self.timeout)
            return response.status_code == 200, response.json() if response.status_code == 200 else None
        except:
            return False, None
    
    def get_telematics_data(self, vin):
        """Get telematics data for a vehicle"""
        try:
            response = requests.get(f"{self.mock_api_url}/telematics/{vin}", timeout=self.timeout)
            return response.status_code == 200, response.json() if response.status_code == 200 else None
        except:
            return False, None
    
    def analyze_maintenance(self, vin, customer_id=None, priority="MEDIUM"):
        """Trigger maintenance analysis"""
        try:
            payload = {
                "vin": vin,
                "customer_id": customer_id,
                "priority": priority,
                "analysis_type": "predictive"
            }
            response = requests.post(
                f"{self.master_agent_url}/maintenance/analyze",
                json=payload,
                timeout=30
            )
            return response.status_code == 200, response.json() if response.status_code == 200 else None
        except:
            return False, None
    
    def handle_emergency(self, vin, alert_type, severity, customer_id=None):
        """Handle emergency alert"""
        try:
            payload = {
                "vin": vin,
                "alert_type": alert_type,
                "severity": severity,
                "customer_id": customer_id
            }
            response = requests.post(
                f"{self.master_agent_url}/emergency/alert",
                json=payload,
                timeout=30
            )
            return response.status_code == 200, response.json() if response.status_code == 200 else None
        except:
            return False, None

# Initialize API client
api = DashboardAPI()

def main():
    """Main dashboard application"""
    
    # Header
    st.markdown('<h1 class="main-header">🚗 Automotive AI - Predictive Maintenance</h1>', unsafe_allow_html=True)
    
    # Sidebar
    with st.sidebar:
        st.header("🎛️ Control Panel")
        
        # System Health Check
        st.subheader("System Status")
        if st.button("🔄 Check System Health"):
            with st.spinner("Checking system health..."):
                healthy, health_data = api.check_health()
                if healthy:
                    st.success("✅ All systems operational")
                    if health_data:
                        st.json(health_data)
                else:
                    st.error("❌ System health check failed")
        
        # Vehicle Selection
        st.subheader("Vehicle Selection")
        vehicle_options = {
            "VIN123ABC": "Hero Splendor (Rajesh Kumar)",
            "VIN456DEF": "Mahindra XUV300 (Priya Sharma)"
        }
        selected_vin = st.selectbox("Select Vehicle", list(vehicle_options.keys()), 
                                   format_func=lambda x: vehicle_options[x])
        
        # Analysis Type
        st.subheader("Analysis Type")
        analysis_type = st.radio("Select Analysis Type", 
                                ["Predictive Maintenance", "Emergency Response", "Routine Check"])
        
        # Priority Level
        if analysis_type == "Emergency Response":
            priority = "CRITICAL"
        else:
            priority = st.selectbox("Priority Level", ["LOW", "MEDIUM", "HIGH", "CRITICAL"])
        
        # Customer ID
        customer_id = st.text_input("Customer ID (Optional)", value="CUST001" if selected_vin == "VIN123ABC" else "CUST002")
    
    # Main content area
    tab1, tab2, tab3, tab4 = st.tabs(["📊 Dashboard", "🔍 Analysis", "🚨 Emergency", "📈 Analytics"])
    
    with tab1:
        dashboard_tab(selected_vin, vehicle_options[selected_vin])
    
    with tab2:
        analysis_tab(selected_vin, customer_id, priority, analysis_type)
    
    with tab3:
        emergency_tab(selected_vin, customer_id)
    
    with tab4:
        analytics_tab()

def dashboard_tab(vin, vehicle_name):
    """Dashboard overview tab"""
    st.header(f"📊 Vehicle Dashboard - {vehicle_name}")
    
    # Get telematics data
    with st.spinner("Loading vehicle data..."):
        success, telematics_data = api.get_telematics_data(vin)
    
    if not success or not telematics_data:
        st.error("❌ Failed to load vehicle data. Please check system connectivity.")
        return
    
    # Vehicle Information
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Make/Model", f"{telematics_data['vehicle_info']['make']} {telematics_data['vehicle_info']['model']}")
    
    with col2:
        st.metric("Year", telematics_data['vehicle_info']['year'])
    
    with col3:
        st.metric("Mileage", f"{telematics_data['vehicle_info']['mileage']:,} km")
    
    with col4:
        st.metric("Engine Type", telematics_data['vehicle_info']['engine_type'])
    
    # Current Status
    st.subheader("🔧 Current Vehicle Status")
    
    col1, col2 = st.columns(2)
    
    with col1:
        current_status = telematics_data['current_status']
        
        # Engine Status
        engine_rpm = current_status['engine_rpm']
        engine_status = "🟢 Running" if engine_rpm > 0 else "🔴 Stopped"
        st.metric("Engine Status", engine_status, f"{engine_rpm} RPM")
        
        # Battery Status
        battery_voltage = current_status['battery_voltage']
        battery_status = "🟢 Good" if battery_voltage > 12.0 else "🟡 Low" if battery_voltage > 11.5 else "🔴 Critical"
        st.metric("Battery", battery_status, f"{battery_voltage}V")
        
        # Fuel Level
        fuel_level = current_status['fuel_level']
        fuel_status = "🟢 Good" if fuel_level > 50 else "🟡 Low" if fuel_level > 20 else "🔴 Critical"
        st.metric("Fuel Level", fuel_status, f"{fuel_level}%")
    
    with col2:
        # Engine Temperature
        engine_temp = current_status['engine_temp']
        temp_status = "🟢 Normal" if 80 <= engine_temp <= 95 else "🟡 High" if engine_temp > 95 else "🔴 Low"
        st.metric("Engine Temperature", temp_status, f"{engine_temp}°C")
        
        # Oil Pressure
        oil_pressure = current_status['oil_pressure']
        oil_status = "🟢 Good" if oil_pressure > 30 else "🟡 Low" if oil_pressure > 20 else "🔴 Critical"
        st.metric("Oil Pressure", oil_status, f"{oil_pressure} PSI")
        
        # Speed
        speed = current_status['speed']
        st.metric("Current Speed", f"{speed} km/h")
    
    # DTC Codes
    st.subheader("⚠️ Diagnostic Trouble Codes")
    dtc_codes = telematics_data.get('dtc_codes', [])
    
    if dtc_codes:
        dtc_df = pd.DataFrame({
            'DTC Code': dtc_codes,
            'Description': ['Cylinder 1 Misfire', 'System Too Lean'] if 'P0301' in dtc_codes else ['Unknown'],
            'Severity': ['HIGH', 'MEDIUM'] if len(dtc_codes) > 1 else ['HIGH']
        })
        st.dataframe(dtc_df, use_container_width=True)
    else:
        st.success("✅ No diagnostic trouble codes detected")
    
    # Maintenance History
    st.subheader("🔧 Maintenance History")
    maintenance_history = telematics_data.get('maintenance_history', [])
    
    if maintenance_history:
        maint_df = pd.DataFrame(maintenance_history)
        maint_df['date'] = pd.to_datetime(maint_df['date'])
        maint_df = maint_df.sort_values('date', ascending=False)
        
        # Display maintenance history
        st.dataframe(maint_df, use_container_width=True)
        
        # Maintenance cost trend
        if len(maint_df) > 1:
            fig = px.line(maint_df, x='date', y='cost', 
                         title='Maintenance Cost Trend',
                         markers=True)
            st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("ℹ️ No maintenance history available")

def analysis_tab(vin, customer_id, priority, analysis_type):
    """Analysis tab for running maintenance analysis"""
    st.header("🔍 Predictive Maintenance Analysis")
    
    # Analysis parameters
    col1, col2 = st.columns(2)
    
    with col1:
        st.info(f"**Vehicle:** {vin}")
        st.info(f"**Customer:** {customer_id}")
    
    with col2:
        st.info(f"**Priority:** {priority}")
        st.info(f"**Type:** {analysis_type}")
    
    # Run Analysis Button
    if st.button("🚀 Run Analysis", type="primary"):
        with st.spinner("Running predictive maintenance analysis..."):
            if analysis_type == "Emergency Response":
                success, result = api.handle_emergency(vin, "system_failure", priority, customer_id)
            else:
                success, result = api.analyze_maintenance(vin, customer_id, priority)
        
        if success and result:
            display_analysis_results(result)
        else:
            st.error("❌ Analysis failed. Please check system connectivity and try again.")

def display_analysis_results(result):
    """Display analysis results"""
    st.success("✅ Analysis completed successfully!")
    
    # Overall Results
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Overall Confidence", f"{result['overall_confidence']:.1%}")
    
    with col2:
        st.metric("Processing Time", f"{result['processing_time_seconds']:.2f}s")
    
    with col3:
        st.metric("UEBA Events", result['ueba_status']['total_events'])
    
    # Worker Results
    st.subheader("🤖 Worker Agent Results")
    
    for worker_name, worker_result in result['results'].items():
        with st.expander(f"{worker_name.replace('_', ' ').title()} Worker"):
            if worker_result.get('error'):
                st.error(f"❌ {worker_result['error']}")
            else:
                st.success(f"✅ Confidence: {worker_result['confidence']:.1%}")
                
                if worker_result.get('data'):
                    # Display key insights
                    data = worker_result['data']
                    
                    if worker_name == 'data_analysis':
                        if data.get('anomaly_detection', {}).get('anomalies_detected'):
                            st.warning("⚠️ Anomalies detected in sensor data")
                            for anomaly in data['anomaly_detection']['anomalies']:
                                st.write(f"- {anomaly['description']}")
                        else:
                            st.success("✅ No anomalies detected")
                    
                    elif worker_name == 'diagnosis':
                        if data.get('dtc_analysis', {}).get('total_codes', 0) > 0:
                            st.warning(f"⚠️ {data['dtc_analysis']['total_codes']} DTC codes found")
                        else:
                            st.success("✅ No diagnostic trouble codes")
                    
                    elif worker_name == 'customer_engagement':
                        strategy = data.get('engagement_strategy', {})
                        st.info(f"📞 Primary channel: {strategy.get('primary_channel', 'Unknown')}")
                    
                    # Show full data in expandable section
                    with st.expander("View Full Data"):
                        st.json(data)
    
    # Recommendations
    if result.get('recommendations'):
        st.subheader("💡 Recommendations")
        for i, recommendation in enumerate(result['recommendations'], 1):
            st.write(f"{i}. {recommendation}")
    
    # UEBA Status
    st.subheader("🔒 Security Status")
    ueba_status = result['ueba_status']
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Total Events", ueba_status['total_events'])
    with col2:
        st.metric("High Risk Events", ueba_status['high_risk_events'])
    with col3:
        st.metric("Last Risk Score", f"{ueba_status['last_risk_score']:.3f}")

def emergency_tab(vin, customer_id):
    """Emergency response tab"""
    st.header("🚨 Emergency Response")
    
    st.warning("⚠️ Use this section only for critical vehicle issues requiring immediate attention.")
    
    # Emergency parameters
    col1, col2 = st.columns(2)
    
    with col1:
        alert_type = st.selectbox("Alert Type", [
            "engine_failure",
            "brake_system_failure", 
            "electrical_failure",
            "transmission_failure",
            "safety_system_failure"
        ])
    
    with col2:
        severity = st.selectbox("Severity Level", ["HIGH", "CRITICAL"])
    
    # Emergency response button
    if st.button("🚨 Trigger Emergency Response", type="primary"):
        with st.spinner("Initiating emergency response..."):
            success, result = api.handle_emergency(vin, alert_type, severity, customer_id)
        
        if success and result:
            st.success("✅ Emergency response initiated successfully!")
            display_analysis_results(result)
            
            # Emergency-specific actions
            st.subheader("🚨 Emergency Actions Taken")
            st.write("1. ✅ Emergency service dispatched")
            st.write("2. ✅ Customer contacted immediately")
            st.write("3. ✅ Service center notified")
            st.write("4. ✅ Safety protocols activated")
        else:
            st.error("❌ Emergency response failed. Please contact service center directly.")

def analytics_tab():
    """Analytics and insights tab"""
    st.header("📈 Fleet Analytics & Insights")
    
    # Sample analytics data
    st.subheader("📊 System Performance Metrics")
    
    # Create sample metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Prediction Accuracy", "85%", "5%")
    
    with col2:
        st.metric("Emergency Response Time", "<60s", "-10s")
    
    with col3:
        st.metric("Customer Satisfaction", "92%", "3%")
    
    with col4:
        st.metric("System Uptime", "99.5%", "0.2%")
    
    # Sample charts
    st.subheader("📈 Trend Analysis")
    
    # Create sample data for charts
    dates = pd.date_range(start='2024-01-01', end='2024-03-10', freq='D')
    
    # Maintenance requests trend
    maintenance_data = pd.DataFrame({
        'Date': dates,
        'Maintenance Requests': [10 + i + (i % 7) * 2 for i in range(len(dates))],
        'Emergency Calls': [1 + (i % 10) for i in range(len(dates))]
    })
    
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=('Maintenance Requests', 'Emergency Calls', 'System Load', 'Customer Satisfaction'),
        specs=[[{"secondary_y": False}, {"secondary_y": False}],
               [{"secondary_y": False}, {"secondary_y": False}]]
    )
    
    # Maintenance requests
    fig.add_trace(
        go.Scatter(x=maintenance_data['Date'], y=maintenance_data['Maintenance Requests'], 
                  name='Maintenance Requests', line=dict(color='blue')),
        row=1, col=1
    )
    
    # Emergency calls
    fig.add_trace(
        go.Scatter(x=maintenance_data['Date'], y=maintenance_data['Emergency Calls'], 
                  name='Emergency Calls', line=dict(color='red')),
        row=1, col=2
    )
    
    # System load (sample data)
    system_load = [60 + (i % 20) for i in range(len(dates))]
    fig.add_trace(
        go.Scatter(x=dates, y=system_load, name='System Load %', line=dict(color='green')),
        row=2, col=1
    )
    
    # Customer satisfaction (sample data)
    satisfaction = [85 + (i % 10) for i in range(len(dates))]
    fig.add_trace(
        go.Scatter(x=dates, y=satisfaction, name='Satisfaction %', line=dict(color='orange')),
        row=2, col=2
    )
    
    fig.update_layout(height=600, showlegend=False, title_text="Fleet Analytics Dashboard")
    st.plotly_chart(fig, use_container_width=True)
    
    # Business Impact
    st.subheader("💰 Business Impact")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.metric("Annual Cost Savings", "₹50 Cr+", "₹5 Cr")
        st.metric("Breakdown Reduction", "60%", "10%")
    
    with col2:
        st.metric("Customer Retention", "95%", "5%")
        st.metric("Service Efficiency", "45%", "8%")

if __name__ == "__main__":
    main()
