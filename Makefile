add-slack-contact-point:
	@echo "Adding Slack contact point..."
	curl -X POST http://localhost:8080/api/v1/provisioning/contact-points \
		-H "Authorization: Bearer $$API_KEY" \
		-H "Content-Type: application/json" \
		-d @development/grafana/slack-contacts-point.json

build-admin:
	@echo "Building the application..."
	docker rmi admin:testing || true
	docker build -t admin:testing -f apps/admin/Dockerfile --build-arg NODE_VERSION=`cat .nvmrc` --debug .

build-app:
	@echo "Building the application..."
	docker rmi app:testing || true
	docker build -t app:testing -f apps/app/Dockerfile --build-arg NODE_VERSION=`cat .nvmrc` --debug .

build-app-and-serve: build-app
	@echo "Serving the application..."
	docker run -it --rm -v `pwd`/development/app/tokens:/tokens -p 3000:3000 --name app app:testing

dev-config:
	@echo "Setting up development environment..."
	@rm .env.local || true
	@echo "NODE_VERSION=`cat .nvmrc`" > .env.local
	@cat .env.development >> .env.local
	@echo "Local config:"
	@cat .env.local

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
