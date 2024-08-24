MYSQL = mysql
USER = root
PASSWORD = john2000


all: create_DB initialise_DB

create_DB:
	@$(MYSQL) -u $(USER) -p$(PASSWORD) < e-ethelodria.create.sql
	@$(MYSQL) -u $(USER) -p$(PASSWORD) < e-ethelodria.triggers.sql
	@echo "✅"
	

initialise_DB:
	@node ../Data/import-data.js
	@$(MYSQL) -u $(USER) -p$(PASSWORD) < e-ethelodria.inserts.sql
	@echo "✅"


	
