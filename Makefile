build-app:
	@echo "Building the application..."
	docker build -t app:testing -f apps/app/Dockerfile --build-arg NODE_VERSION=`cat .nvmrc` .

dev-config:
	@echo "Setting up development environment..."
	@echo "NODE_VERSION=$(cat .nvmrc)" > .env.local
	@cat .env.development >> .env.local

logs:
	@echo "Displaying logs..."
	docker compose logs -f

start: dev-config
	@echo "Starting the application..."
	docker compose --env-file .env.local up -d
	docker ps -a

stop:
	@echo "Stopping the application..."
	docker compose down --remove-orphans --rmi local --volumes

restart:
	docker compose down
	@make start
