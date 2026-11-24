#!/bin/bash
set -e

echo -e "Starting deployment..."

git pull origin main

docker compose down -v
docker system prune -f

docker compose up -d --build
