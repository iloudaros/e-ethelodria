# Paths
BACKEND_DIR := App/backend
FRONTEND_DIR := App/frontend

include $(BACKEND_DIR)/config/.env


.PHONY: create_DB initialise_DB DB start_e-ethelodria stop_e-ethelodria


# Database
create_DB:
	@$(MYSQL) -u $(USER) -p$(PASSWORD) < DB/e-ethelodria.create.sql
	@$(MYSQL) -u $(USER) -p$(PASSWORD) < DB/e-ethelodria.triggers.sql
	@echo "✅"
	

initialise_DB:
	@node ../Data/import-data.js
	@$(MYSQL) -u $(USER) -p$(PASSWORD) < e-ethelodria.inserts.sql
	@echo "✅"

DB: create_DB initialise_DB

# Server
# Recipe to start backend and frontend in separate screen sessions
start_e-ethelodria:
	@echo "Starting backend and frontend in separate screen sessions..."
	@screen -dmS e-ethelodria-backend bash -c "cd $(BACKEND_DIR) && npx nodemon index.js"
	@screen -dmS e-ethelodria-frontend bash -c "cd $(FRONTEND_DIR) && npm start"
	@echo "Backend and Frontend are starting in separate screen sessions."
	@echo "Use 'screen -ls' to list sessions."
	@echo "Use 'screen -r e-ethelodria-backend' to attach to the backend session."
	@echo "Use 'screen -r e-ethelodria-frontend' to attach to the frontend session."

# Recipe to stop backend and frontend screen sessions
stop_e-ethelodria:
	@echo "Stopping backend and frontend screen sessions..."
	@-screen -S e-ethelodria-backend -XS quit
	@-screen -S e-ethelodria-frontend -XS quit
	@pkill -f "npx nodemon index.js" || true
	@pkill -f "npm start" || true
	@echo "Backend and Frontend screen sessions have been stopped."
 

# Recipe to forcefully kill backend and frontend processes if screen sessions don't stop
kill_e-ethelodria:
	@echo "Forcefully killing backend and frontend processes..."
	@pkill -f "npx nodemon index.js"
	@pkill -f "npm start"
	@echo "Backend and Frontend processes have been forcefully killed."

# Tests

test_env_exists:
	@echo $(DB_NAME)