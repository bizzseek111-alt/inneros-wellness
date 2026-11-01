.PHONY: help dev dev-web dev-api test test-api test-web lint clean seed

help:
	@echo "InnerOS Development Commands:"
	@echo "  make dev        Start both web and api in development mode"
	@echo "  make dev-api    Start the FastAPI backend with hot reloading"
	@echo "  make dev-web    Start the Next.js frontend"
	@echo "  make test       Run all unit and safety tests (api + web)"
	@echo "  make test-api   Run pytest test suite for FastAPI backend"
	@echo "  make test-web   Run web unit tests"
	@echo "  make lint       Run linting and format checks"
	@echo "  make seed       Seed local synthetic development data"
	@echo "  make clean      Remove caches, temp files, and build artifacts"

dev:
	bash scripts/dev.sh

dev-api:
	bash scripts/dev_api.sh

dev-web:
	pnpm --filter @inneros/web dev

test:
	bash scripts/test.sh

test-api:
	bash scripts/test_api.sh

test-web:
	pnpm --filter @inneros/web test

lint:
	bash scripts/lint.sh

seed:
	python3 scripts/seed_synthetic_data.py

clean:
	rm -rf apps/web/.next apps/web/node_modules node_modules apps/api/.pytest_cache apps/api/__pycache__
