SHELL = /bin/bash
MYSQL = 
USER = 
PASSWORD = 


all: create_DB initialise_DB

create_DB:
	$(MYSQL) -u $(USER) -p$(PASSWORD) < e-ethelodria.create.sql
	$(MYSQL) -u $(USER) -p$(PASSWORD) e-ethelodria < e-ethelodria.triggers.sql
	

initialise_DB:
	
