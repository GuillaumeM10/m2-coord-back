.PHONY : start
start:
	@echo "start api"
	@pnpm run start:dev

.PHONY: up
up:
	docker compose -f ./docker-compose.yml up -d

.PHONY: down
down:
	docker compose -f ./docker-compose.yml down

.PHONY: stop
stop:
	docker compose -f ./docker-compose.yml stop

.PHONY: install
install:
	pnpm install

.PHONY: reset
reset:
	docker stop $$(docker ps -a -q) \
	&& docker rm $$(docker ps -a -q) \
	&& docker rmi $$(docker images -q) \
	&& docker volume rm $$(docker volume ls -q) \
	&& docker system prune -a -f
