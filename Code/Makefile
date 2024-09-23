# Paths
BACKEND_DIR := App/backend
FRONTEND_DIR := App/frontend
DB_DIR := DB
MYSQL := mysql

include $(BACKEND_DIR)/.env


.PHONY: create_DB initialise_DB DB start_e-ethelodria stop_e-ethelodria 


# Database
create_DB:
	@echo "Creating database..."
	@$(MYSQL) -u $(DB_USER) -p$(DB_PASSWORD) < $(DB_DIR)/e-ethelodria.create.sql
	@$(MYSQL) -u $(DB_USER) -p$(DB_PASSWORD) < $(DB_DIR)/e-ethelodria.triggers.sql
	@echo "✅"

insert_users:
	@echo "Inserting users..."
	@$(MYSQL) -u $(DB_USER) -p$(DB_PASSWORD) < $(DB_DIR)/e-ethelodria.insertUsers.sql
	@echo "✅"
	
import_json:
	@echo "Inserting json data..."
	@node Data/import-data.js
	@echo "✅"

insert_tasks_announcements_inventories:
	@echo "Inserting tasks, announcements and inventories ..."
	@$(MYSQL) -u $(DB_USER) -p$(DB_PASSWORD) < $(DB_DIR)/e-ethelodria.inserts.sql
	@echo "✅"



DB: create_DB insert_users import_json insert_tasks_announcements_inventories
DB_only_users: create_DB insert_users


# Installation
install_dependencies:
	@echo "Installing backend dependencies..."
	@cd $(BACKEND_DIR) && npm install
	@echo "Installing frontend dependencies..."
	@cd $(FRONTEND_DIR) && npm install --legacy-peer-deps
	@echo "✅"
	

# Initialisation
init: create_DB install_dependencies # Initialise the database and install dependencies
demo: DB install_dependencies # Initialise the database, install dependencies and insert demo data
demo_only_users: DB install_dependencies insert_users # Initialise the database, install dependencies and insert demo data without tasks and announcements



# Run
## Recipe to start backend and frontend in separate screen sessions
start_e-ethelodria:
	@echo "Starting backend and frontend in separate screen sessions..."
	@screen -dmS e-ethelodria-backend bash -c "cd $(BACKEND_DIR) && npx nodemon index.js"
	@screen -dmS e-ethelodria-frontend bash -c "cd $(FRONTEND_DIR) && npm start"
	@echo "Backend and Frontend are starting in separate screen sessions."
	@echo "Use 'screen -ls' to list sessions."
	@echo "Use 'screen -r e-ethelodria-backend' to attach to the backend session."
	@echo "Use 'screen -r e-ethelodria-frontend' to attach to the frontend session."

## Recipe to stop backend and frontend screen sessions
stop_e-ethelodria:
	@echo "Stopping backend and frontend screen sessions..."
	@-screen -XS e-ethelodria-backend quit
	@-screen -XS e-ethelodria-frontend quit
	@pkill -f "npx nodemon index.js" || true
	@pkill -f "npm start" || true
	@echo "Backend and Frontend screen sessions have been stopped."



# Tests
test_env_exists:
	@echo $(DB_NAME)

test_db_exists: # Check if the database exists and is accessible. 
	@echo "Checking if the database exists and is accessible..."
	@$(MYSQL) -u $(DB_USER) -p$(DB_PASSWORD) -e "USE $(DB_NAME);" 



# Clean
drop_DB:
	@echo "Dropping database..."
	@$(MYSQL) -u $(DB_USER) -p$(DB_PASSWORD) < $(DB_DIR)/e-ethelodria.clean.sql
	@echo "✅"

delete_node_modules:
	@echo "Deleting node_modules..."
	@rm -rf $(BACKEND_DIR)/node_modules
	@rm -rf $(FRONTEND_DIR)/node_modules 
	@echo "✅"

delete_package_lock:
	@echo "Deleting package-lock.json..."
	@rm -f $(BACKEND_DIR)/package-lock.json
	@rm -f $(FRONTEND_DIR)/package-lock.json
	@echo "✅"

clean: delete_node_modules delete_package_lock drop_DB
