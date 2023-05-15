NAME = tout-doux

all: frontend backend

frontend backend:
	docker build -t ${NAME}-$@ $@
.PHONY: frontend backend

up:
	docker compose up -d
.PHONY: run

down:
	docker compose down
.PHONY: down

log:
	docker logs ${NAME}-${app} -f
.PHONY: log