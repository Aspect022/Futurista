#!/usr/bin/env python3
"""
Comprehensive test runner for Automotive Predictive Maintenance System
Tests all 10 scenarios including normal operations, edge cases, and UEBA monitoring
"""

import requests
import json
import time
import sys
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8001"
MOCK_API_URL = "http://localhost:8000"

class TestRunner:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.results = []
    
    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
    
    def run_test(self, test_case):
        """Execute individual test case"""
        test_id = test_case['test_id']
        test_name = test_case['name']
        
        self.log(f"Running {test_id}: {test_name}")
        
        try:
            # Prepare request
            endpoint = test_case['input']['endpoint']
            payload = test_case['input']['payload']
            
            url = f"{BASE_URL}{endpoint}"
            
            # Make request
            start_time = time.time()
            response = requests.post(url, json=payload, timeout=30)
            duration = time.time() - start_time
            
            # Check response
            if response.status_code == 200:
                result = response.json()
                
                # Validate expected outputs
                passed = self.validate_response(result, test_case['expected_output'])
                
                if passed:
                    self.log(f"✅ PASSED: {test_id} ({duration:.2f}s)", "SUCCESS")
                    self.passed += 1
                else:
                    self.log(f"❌ FAILED: {test_id} - Output validation failed", "ERROR")
                    self.failed += 1
                
                self.results.append({
                    "test_id": test_id,
                    "name": test_name,
                    "status": "PASSED" if passed else "FAILED",
                    "duration": duration,
                    "response": result
                })
                
            else:
                self.log(f"❌ FAILED: {test_id} - HTTP {response.status_code}", "ERROR")
                self.failed += 1
                self.results.append({
                    "test_id": test_id,
                    "name": test_name,
                    "status": "FAILED",
                    "error": f"HTTP {response.status_code}",
                    "duration": duration
                })
                
        except Exception as e:
            self.log(f"❌ ERROR: {test_id} - {str(e)}", "ERROR")
            self.failed += 1
            self.results.append({
                "test_id": test_id,
                "name": test_name,
                "status": "ERROR",
                "error": str(e),
                "duration": 0
            })
    
    def validate_response(self, actual, expected):
        """Validate response against expected output"""
        for key, expected_value in expected.items():
            if key not in actual:
                return False
            
            if isinstance(expected_value, bool) and actual[key] != expected_value:
                return False
            elif isinstance(expected_value, (int, float)) and actual[key] < expected_value:
                return False
                
        return True
    
    def check_system_health(self):
        """Check if all services are running"""
        self.log("Checking system health...")
        
        services = [
            ("Mock API", MOCK_API_URL),
            ("Master Agent", BASE_URL),
        ]
        
        for service_name, url in services:
            try:
                response = requests.get(f"{url}/health", timeout=5)
                if response.status_code == 200:
                    self.log(f"✅ {service_name} is healthy")
                else:
                    self.log(f"❌ {service_name} unhealthy (HTTP {response.status_code})", "ERROR")
                    return False
            except Exception as e:
                self.log(f"❌ {service_name} unreachable: {str(e)}", "ERROR")
                return False
        
        return True
    
    def run_all_tests(self):
        """Run all test cases"""
        # Load test cases
        try:
            with open('testcases.json', 'r') as f:
                test_data = json.load(f)
                test_cases = test_data['automotive_test_suite']['test_cases']
        except FileNotFoundError:
            self.log("testcases.json not found!", "ERROR")
            return False
        
        # Check system health first
        if not self.check_system_health():
            self.log("System health check failed. Please start services with 'docker-compose up -d'", "ERROR")
            return False
        
        self.log(f"Starting test suite with {len(test_cases)} test cases")
        
        # Run each test
        for test_case in test_cases:
            self.run_test(test_case)
            time.sleep(1)  # Brief pause between tests
        
        # Generate summary
        self.generate_summary()
        
        return self.failed == 0
    
    def generate_summary(self):
        """Generate test summary report"""
        total = self.passed + self.failed
        success_rate = (self.passed / total * 100) if total > 0 else 0
        
        print("\n" + "="*60)
        print("TEST EXECUTION SUMMARY")
        print("="*60)
        print(f"Total Tests:    {total}")
        print(f"Passed:         {self.passed}")
        print(f"Failed:         {self.failed}")
        print(f"Success Rate:   {success_rate:.1f}%")
        print("="*60)
        
        # Detailed results
        if self.failed > 0:
            print("\nFAILED TESTS:")
            for result in self.results:
                if result['status'] != 'PASSED':
                    print(f"  - {result['test_id']}: {result['name']}")
                    if 'error' in result:
                        print(f"    Error: {result['error']}")
        
        # Save results to file
        with open('test_results/test_report.json', 'w') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "summary": {
                    "total": total,
                    "passed": self.passed,
                    "failed": self.failed,
                    "success_rate": success_rate
                },
                "results": self.results
            }, f, indent=2)
        
        print(f"\nDetailed results saved to: test_results/test_report.json")

def main():
    """Main execution function"""
    print("Techathon 6.0 - Automotive Solution Test Runner")
    print("="*50)
    
    runner = TestRunner()
    success = runner.run_all_tests()
    
    # Create test results directory if it doesn't exist
    import os
    os.makedirs('test_results', exist_ok=True)
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()