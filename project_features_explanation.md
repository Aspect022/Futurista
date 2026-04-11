# Autonomous Vehicle Predictive Maintenance Platform -  Features & Capabilities

This document provides a detailed, granular breakdown of every feature and capability currently implemented in the **Autonomous Vehicle Predictive Maintenance Platform (Futurista)**. It is structured to help identify current system boundaries, capabilities, and gaps for future improvements.

## 1. Executive Summary
The project is a championship-level, enterprise-grade AI system designed to predict vehicle failures before they happen, automate service scheduling, engage with customers autonomously, and create a feedback loop for manufacturing. It is built on a loosely coupled architecture combining a Next.js (React) front end and a Python (FastAPI/Streamlit) backend powered by a multi-agent AI system.

## 2. Frontend Capabilities & Features (User & Admin Facing)

The frontend is a modern Next.js 14 application providing vehicle owners and fleet managers with real-time insights and actions.

### 2.1 Landing Page
*   **Animated Key Metrics:** Highlights core value propositions (92% failure forecast accuracy, -48% downtime, etc.).
*   **Feature Highlights:** Visual breakdown of real-time analytics, predictive diagnostics, and smart scheduling.

### 2.2 Fleet Dashboard (`/dashboard-new`)
*   **Unified Navigation:** Displays real-time overall Fleet Health Score in the navigation bar.
*   **Health Score Ring:** A prominent, interactive radial chart showing aggregated fleet health (e.g., 72%).
*   **Component Level Health Bars:** Quick-glance progress bars for Brake Health, Battery Health, Engine Health, and Tire Health.
*   **Upcoming Maintenance:** A priority-based list (Low, Medium, High) of expected service needs across the fleet with distance-to-due metrics.
*   **Recent Trips History:** Status tracking of origin/destination pairs (planned vs. completed).
*   **Asset Management (Vehicles Tab):** Grid view of all vehicles owned/managed, displaying Year, Mileage, and aggregated health scores, with quick actions to analyze or view deep details.

### 2.3 Interactive Vehicle Details & 3D View (`/vehicle/[id]`)
*   **Interactive 3D Visualizer:** Uses `React Three Fiber` / `Three.js` to render an interactive 3D model of the selected vehicle.
*   **Time-Series Health Trends:** A line chart (using `Recharts`) plotting overall health vs. specific component health (Brake, Battery, Engine) over the last 14+ days.
*   **Granular Vehicle Metadata:** Real-time display of VIN, Mileage, Engine Hours, Last Service Date, Next Service Date, and specific deadlines (e.g., Oil Change Due).
*   **Health Status Quick Actions:** Direct links to What-If Analysis, Service Scheduling, and Diagnostic runs.

### 2.4 AI Predictive Insights (`/vehicle/[id]/predictive-maintenance`)
*   **Risk Categorization:** Vehicles are tagged with real-time risk severity (Critical, High, Medium, Low, Normal).
*   **Critical Emergency Popup:** If health falls below 70%, the UI triggers a critical alarm workflow allowing for single-click emergency mitigation.
*   **Predicted Component Failures Grid:** Cards showing exact components predicted to fail, calculating "Days to Failure," Risk Level, and Confidence Score.
*   **Explainable AI (XAI) Integration:** A "Sparkles" button allows users to ask the AI *why* a component is predicted to fail. It queries an LLM (Groq/Llama 3) to translate raw sensor anomalies into simple, plain English explanations for the driver.
*   **Real-Time Anomalies Feed:** Live list of sensor anomalies detected in the last 24 hours.
*   **Action Automation Engine:** Hooks directly into `n8n Workflows` via an external trigger button to automate downstream logic.

### 2.5 Trip & What-If Analysis (`/dashboard-new` & `/what-if-analysis`)
*   **Trip Parameter Input:** Users can input Origin, Destination, Departure Date, Passenger Count, and Estimated Distance.
*   **AI Trip Safety Sandbox:** The system calculates the exact toll a specific trip will take on the vehicle based on its current component degradation.
*   **Safety Status Engine:** Returns one of three states (`GO`, `CAUTION`, `ACTION_REQUIRED`).
*   **Pre-Trip Checklist:** Generates dynamic, severity-based recommendations (e.g., "Critical: Replace brake pads before mountain terrain," "Info: Check tire pressure").

### 2.6 Service Booking & Geo-Routing (`/appointment-booking`)
*   **Integrated Service Center Maps:** Visual rendering of nearby service centers, calculated distances, and current operational status.
*   **Dynamic Booking Engine:** Users select their vehicle, specific service type (Engine, Brakes, Oil), and date/time.
*   **Context Passing:** Appointment details are automatically pushed to the backend `Scheduling Worker` for optimization.

### 2.7 Fleet Quality & Engineering Reports (`/reports`)
*   **AI Executive Summary Generator:** A button that generates a high-level, natural language health summary of the entire fleet.
*   **Production Batch Analysis:** Tracks and correlates component failures back to specific Manufacturing/Production Batches (e.g., "BP-2024-Q1").
*   **Time-Filtered Analytics:** 30/90/180-day trend toggles.
*   **Engineering KPIs:** Tracks "Total Incidents," "Top Failing Component," "Most Affected Model," and "Open Investigations (CAPA/RCA)."
*   **Failure Analysis Table:** Deep dive table calculating Failure Rates, Avg Mileage at Failure, Avg Age at Failure, and the status of ongoing Engineering Investigations.

---

## 3. Backend Multi-Agent Architecture

The backend completely eschews monolithic design in favor of a sophisticated asynchronous multi-agent system built on FastAPI, choreographed to handle real-time telematics.

### 3.1 Master Agent (Orchestrator)
*   **Role:** The brain of the operation. It receives incoming telemetry and user requests, determining which worker agents need to be invoked.
*   **Features:** Async workflow orchestration, context preservation (session memory across agent interactions), rigorous retry logic, and grade degradation.

### 3.2 The 6 Specialized Worker Agents
1.  **Data Analysis Worker:** Ingests raw telematics time-series data. Handles anomaly detection and identifies out-of-bound sensor readings.
2.  **Diagnosis Worker:** Analyzes anomalies alongside DTC (Diagnostic Trouble Codes). Responsible for failure prediction and emitting the "Days to failure" and "Confidence Score" metrics.
3.  **Customer engagement Worker:** Handles automated outbound communication. Capable of generating dynamic voice scripts, SMS, and app notifications to warn users of impending failures.
4.  **Scheduling Worker:** Processes service appointment requests. Intelligent workload distribution ensuring service centers are not overbooked.
5.  **Feedback Worker:** Executes post-service follow-ups to track customer satisfaction and close the loop.
6.  **Manufacturing Insights Worker:** The RCA/CAPA bridge. It aggregates failure data to provide actionable design feedback and failure correlations to the manufacturing floor.

---

## 4. Security, ML, and Simulation Capabilities

### 4.1 UEBA (User and Entity Behavior Analytics)
*   An industry-first implementation for internal AI agents.
*   **Behavioral Tracking:** Monitors what the internal AI agents and users are doing in real-time.
*   **Risk Scoring:** Assigns a risk score (0.0 to 1.0) to every system action.
*   **Auto-Blocking:** If a threshold (e.g., 0.7) is breached—say, the Scheduling agent attempts to access unauthorized telematics bypassing the master agent—the action is inherently blocked, logged, and audited.

### 4.2 Machine Learning Infrastructure
*   **Model Confidence:** Every diagnosis includes an uncertainty quantification (variance score).
*   **Algorithms:** Designed to utilize Scikit-learn, XGBoost/LightGBM, and Pandas/NumPy for statistical aggregation and time-series forecasting.
*   *(Note: XAI text generation is currently mocked via an API route pulling from an LLM).*

### 4.3 Simulation & Mock Data API
*   To prove the concept during the Techathon, the system includes a robust **Mock API Server** capable of generating realistic telematics streams, simulating UEBA security events, and mimicking service center availability logic.

---

## 5. DevOps & Observability
*   **Containerization:** The entire backend ecosystem is containerized using Docker and orchestrated via a massive `docker-compose.yml`.
*   **Structured Logging:** Deep JSON-formatted system logs with Correlation IDs that track requests as they bounce across the various Agent microservices.
*   **Test Suite:** Automated testing suite validating normal operations, emergency routing (<60s critical alert handling), and graceful degradation.

---

## Instructions for Claude: Review Objective
*Please review the feature set above. What are the logical gaps in this architecture? What modern cloud or AI capabilities (e.g., specific memory architectures, real-time streaming pipelines, edge computing integrations) are missing that would take this from a "Championship Prototype" to a "Production SaaS"?*
