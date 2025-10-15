# Create a comprehensive mapping of all files for the ZIP structure
files_created = {
    # Root files
    "README.md": 14,
    "LICENSE": 25,
    ".gitignore": 24,
    "docker-compose.yml": 11,
    
    # Infrastructure
    "infra/mockapi/app.py": 3,
    "infra/mockapi/requirements.txt": 19,
    
    # Master Agent
    "master-agent/app.py": 4,
    "master-agent/requirements.txt": 20,
    
    # Workers
    "workers/data_analysis/app.py": 5,
    "workers/data_analysis/requirements.txt": 21,
    "workers/diagnosis/app.py": 6,
    "workers/diagnosis/requirements.txt": 21,
    "workers/customer_engagement/app.py": 7,
    "workers/customer_engagement/requirements.txt": 21,
    "workers/scheduling/app.py": 27,
    "workers/scheduling/requirements.txt": 21,
    "workers/feedback/app.py": 28,
    "workers/feedback/requirements.txt": 21,
    "workers/manufacturing_insights/app.py": 29,
    "workers/manufacturing_insights/requirements.txt": 21,
    
    # UI
    "ui/streamlit_app.py": 8,
    "ui/requirements.txt": 22,
    
    # Tests
    "tests/testcases.json": 12,
    "tests/run_tests.py": 23,
    
    # Documentation
    "docs/architecture.md": 26,
    "docs/implementation-guide.md": 13,
    "slides/5-slide-presentation.md": 10,
    "slides/comprehensive-documentation.md": 9,
    
    # Scripts
    "scripts/setup.sh": 30,
    "scripts/deploy.sh": 31,
    
    # Dockerfiles
    "infra/mockapi/Dockerfile": 15,
    "master-agent/Dockerfile": 16,
    "workers/Dockerfile": 17,
    "ui/Dockerfile": 18
}

print("COMPLETE GITHUB REPOSITORY FILE MAPPING")
print("="*50)
print(f"Total files mapped: {len(files_created)}")

# Show structure
structure = {}
for file_path, file_id in files_created.items():
    parts = file_path.split('/')
    current = structure
    for part in parts[:-1]:
        if part not in current:
            current[part] = {}
        current = current[part]
    current[parts[-1]] = f"code_file:{file_id}"

def print_tree(node, prefix="", is_last=True):
    items = list(node.items())
    for i, (key, value) in enumerate(items):
        is_last_item = i == len(items) - 1
        current_prefix = "└── " if is_last_item else "├── "
        print(f"{prefix}{current_prefix}{key}")
        
        if isinstance(value, dict):
            extension = "    " if is_last_item else "│   "
            print_tree(value, prefix + extension, is_last_item)

print("\n📁 REPOSITORY STRUCTURE:")
print("techathon-automotive-ai/")
print_tree(structure)

# Additional files needed
additional_files = [
    "infra/mockapi/data/telematics.json",
    "infra/mockapi/data/customers.json", 
    "infra/mockapi/data/service_centers.json",
    "master-agent/orchestrator.py",
    "master-agent/context_store.py",
    "docs/api-reference.md",
    "docs/deployment.md",
    "docs/user-guide.md",
    "slides/demo-script.md",
    "tests/test_results/.gitkeep",
    "docs/images/.gitkeep",
    "ui/assets/.gitkeep"
]

print(f"\n📄 ADDITIONAL FILES NEEDED: {len(additional_files)}")
for file in additional_files:
    print(f"   - {file}")

print(f"\n✅ READY FOR ZIP GENERATION")
print(f"   Core files created: {len(files_created)}")
print(f"   Additional files: {len(additional_files)}")
print(f"   Total repository files: {len(files_created) + len(additional_files)}")

# Generate final instructions
final_instructions = """
FINAL REPOSITORY SETUP INSTRUCTIONS:
=====================================

1. Download all created files
2. Copy to project structure:
   - Root files: README.md, LICENSE, .gitignore, docker-compose.yml
   - Infrastructure: infra/mockapi/ folder
   - Master Agent: master-agent/ folder  
   - Workers: workers/ folders for each agent
   - UI: ui/ folder with Streamlit app
   - Tests: tests/ folder with test suite
   - Documentation: docs/ folder
   - Scripts: scripts/ folder
   - Dockerfiles: in respective directories

3. Run setup:
   chmod +x scripts/setup.sh
   ./scripts/setup.sh

4. Deploy:
   chmod +x scripts/deploy.sh  
   ./scripts/deploy.sh

5. Access:
   - Dashboard: http://localhost:8501
   - API Docs: http://localhost:8001/docs
   - Tests: cd tests && python run_tests.py
"""

print(final_instructions)