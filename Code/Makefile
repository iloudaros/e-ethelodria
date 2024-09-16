# Paths
BACKEND_DIR := App/backend
FRONTEND_DIR := App/frontend
DB_DIR := DB
MYSQL := mysql

include $(BACKEND_DIR)/.env


.PHONY: create_DB initialise_DB DB start_e-ethelodria stop_e-ethelodria 


# Database
create_DB:
	@$(MYSQL) -u $(DB_USER) -p$(DB_PASSWORD) < $(DB_DIR)/e-ethelodria.create.sql
	@$(MYSQL) -u $(DB_USER) -p$(DB_PASSWORD) < $(DB_DIR)/e-ethelodria.triggers.sql
	@echo "✅"
	

initialise_DB:
	@node Data/import-data.js
	@$(MYSQL) -u $(DB_USER) -p$(DB_PASSWORD) < $(DB_DIR)/e-ethelodria.inserts.sql
	@echo "✅"

DB: create_DB initialise_DB


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
	@-screen -S e-ethelodria-backend -XS quit
	@-screen -S e-ethelodria-frontend -XS quit
	@pkill -f "npx nodemon index.js" || true
	@pkill -f "npm start" || true
	@echo "Backend and Frontend screen sessions have been stopped."



# Tests
test_env_exists:
	@echo $(DB_NAME)



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

clean: delete_node_modules drop_DB
