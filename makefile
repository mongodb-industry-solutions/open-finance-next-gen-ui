# Open Finance Next Gen UI - Makefile
# Frontend development commands (no Docker)

FRONTEND_DIR := frontend

.PHONY: help install dev start build lint clean restart kill fresh

# Default target
help:
	@echo "Available commands:"
	@echo "  make install   - Install dependencies"
	@echo "  make dev       - Start development server (port 3000)"
	@echo "  make start     - Start production server (requires build first)"
	@echo "  make build     - Build for production"
	@echo "  make lint      - Run ESLint"
	@echo "  make clean     - Remove node_modules and .next"
	@echo "  make restart   - Kill existing server and restart dev"
	@echo "  make kill      - Kill process running on port 3000"
	@echo "  make fresh     - Clean install and start dev"

# Install dependencies
install:
	cd $(FRONTEND_DIR) && npm install

# Start development server
dev:
	cd $(FRONTEND_DIR) && npm run dev

# Start production server
start:
	cd $(FRONTEND_DIR) && npm run start

# Build for production
build:
	cd $(FRONTEND_DIR) && npm run build

# Run linter
lint:
	cd $(FRONTEND_DIR) && npm run lint

# Clean build artifacts and dependencies
clean:
	rm -rf $(FRONTEND_DIR)/node_modules
	rm -rf $(FRONTEND_DIR)/.next
	@echo "Cleaned node_modules and .next"

# Kill process on port 3000
kill:
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No process running on port 3000"

# Restart development server
restart: kill
	@sleep 1
	cd $(FRONTEND_DIR) && npm run dev

# Fresh install and start
fresh: clean install dev