# Cloud IDE Platform

A browser-based coding workspace with authentication, project/file storage, and sandboxed multi-language code execution.

## Features

- React + Vite frontend with an IDE-style editor experience
- User registration and login with JWT authentication
- Project and file APIs backed by PostgreSQL through Prisma
- Gateway service that routes frontend API traffic to backend services
- Execution engine for Python, JavaScript, C++, and Java
- Docker-based runner containers with memory, CPU, and network limits
- Redis-ready execution infrastructure
- Docker Compose and Kubernetes deployment manifests

## Tech Stack

| Area           | Technology                                    |
| -------------- | --------------------------------------------- |
| Frontend       | React, Vite, Tailwind CSS, Monaco Editor      |
| Gateway        | Node.js, Express, http-proxy-middleware       |
| Auth API       | Node.js, Express, Prisma, PostgreSQL, JWT     |
| Execution      | Node.js, Dockerode, Docker runner images      |
| Infrastructure | Docker Compose, Kubernetes, Redis, PostgreSQL |

## Architecture

```text
Browser
  |
  v
Frontend (Nginx / Vite build)
  |
  v
Gateway :5000
  |----------------------|
  v                      v
Auth Service :5001       Execution Engine :5002
  |                      |
  v                      v
PostgreSQL               Docker runner containers
                         Python / JS / C++ / Java
```

The execution engine creates a temporary workspace for each run, copies it into a language runner container, captures stdout/stderr, and removes the container afterward.

## Repository Structure

```text
apps/frontend/                 React frontend
services/gateway/              API gateway
services/auth-service/         Auth, users, projects, files
services/execution-engine/     Code execution API and runners
services/execution-engine/docker/
  python/ javascript/ cpp/ java/  Language runner images
k8s/                            Kubernetes manifests
docker-compose.yml              Local full-stack Compose setup
```

## Prerequisites

- Node.js 18+
- Docker Desktop or Docker Engine
- Docker Compose
- PostgreSQL and Redis if running services outside Docker

For code execution, Docker must be available to the execution engine. In Compose this repo mounts `/var/run/docker.sock` into the execution-engine service.

## Environment

Copy the example file and update secrets before running outside local development:

```bash
cp .env.example .env
```

Important variables:

| Variable            | Purpose                                 |
| ------------------- | --------------------------------------- |
| `JWT_SECRET`        | Secret used to sign auth tokens         |
| `DATABASE_URL`      | PostgreSQL connection string for Prisma |
| `POSTGRES_USER`     | Local Postgres username                 |
| `POSTGRES_PASSWORD` | Local Postgres password                 |
| `POSTGRES_DB`       | Local Postgres database                 |
| `REDIS_HOST`        | Redis host used by execution services   |
| `VITE_API_BASE_URL` | Frontend API base URL                   |

## Local Development

Build the language runner images first:

```bash
docker build -t cloud-ide-python ./services/execution-engine/docker/python
docker build -t cloud-ide-node ./services/execution-engine/docker/javascript
docker build -t cloud-ide-cpp ./services/execution-engine/docker/cpp
docker build -t cloud-ide-java ./services/execution-engine/docker/java
```

Start the backend stack:

```bash
docker compose up --build
```

Run the frontend locally:

```bash
cd apps/frontend
npm install
npm run dev
```

Default URLs:

- Frontend dev server: `http://localhost:5173`
- Gateway API: `http://localhost:5000`
- Auth service: `http://localhost:5001`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Run With Docker Compose

After building runner images, start the complete stack including the production frontend container:

```bash
docker compose up --build
```

Open:

```text
http://localhost:5173
```

The frontend container proxies `/api` requests to the gateway service.

## API Routes

Gateway routes:

| Route         | Target           |
| ------------- | ---------------- |
| `/api/auth/*` | Auth service     |
| `/api/code/*` | Execution engine |

Core endpoints:

| Method | Path                 | Description            |
| ------ | -------------------- | ---------------------- |
| `POST` | `/api/auth/register` | Create a user          |
| `POST` | `/api/auth/login`    | Login and receive JWT  |
| `GET`  | `/api/auth/projects` | List user projects     |
| `POST` | `/api/auth/projects` | Create project         |
| `POST` | `/api/code/execute`  | Execute submitted code |

Example execution request:

```bash
curl -X POST http://localhost:5000/api/code/execute \
  -H "Content-Type: application/json" \
  -d '{"language":"python","code":"print(\"hello\")"}'
```

## Deployment

### CI/CD

This repository now includes a GitHub Actions workflow at [/.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml) and a Jenkins pipeline at [/Jenkinsfile](Jenkinsfile).

Both pipelines:

- validate the frontend and backend services
- build the Docker images for the app and runner containers
- push images to GHCR on `main`
- deploy to Kubernetes when a kubeconfig is available

The execution engine can resolve runner images from `RUNNER_IMAGE_PREFIX` and `RUNNER_IMAGE_TAG`. That is what makes registry-based deployment work instead of relying on local Docker image names.

For GitHub Actions deployment, provide `KUBE_CONFIG_DATA` as a base64-encoded kubeconfig secret. If you use a private registry, make sure the cluster has image pull credentials for the published GHCR packages.

### Docker Compose Deployment

1. Build and tag runner images on the deployment host:

```bash
docker build -t cloud-ide-python ./services/execution-engine/docker/python
docker build -t cloud-ide-node ./services/execution-engine/docker/javascript
docker build -t cloud-ide-cpp ./services/execution-engine/docker/cpp
docker build -t cloud-ide-java ./services/execution-engine/docker/java
```

2. Set production secrets in `.env`.

3. Start the stack:

```bash
docker compose up --build -d
```

4. Run database migrations if the auth container did not run them during startup:

```bash
docker compose exec auth-service npm run migrate:deploy
```

### Kubernetes Deployment

The `k8s/` folder contains baseline manifests for Postgres, Redis, gateway, auth service, and execution engine.

Before applying them:

- Push application images to a registry and replace `cloud-ide-*` image names.
- Set `RUNNER_IMAGE_PREFIX` and `RUNNER_IMAGE_TAG` for the execution engine so it can pull runner images from the same registry.
- Store `JWT_SECRET`, `DATABASE_URL`, and database credentials in Kubernetes Secrets.
- Use a PersistentVolumeClaim for PostgreSQL instead of ephemeral storage in production.
- Provide Docker access to the execution engine, or replace Dockerode execution with a Kubernetes Job-based runner model.

Apply manifests:

```bash
kubectl apply -f k8s/
```

Check status:

```bash
kubectl get pods
kubectl get services
```

## Security Notes

- Do not commit real `.env` files or production secrets.
- Rotate `JWT_SECRET` before public deployment.
- The execution engine intentionally disables runner networking and applies CPU/memory limits.
- Mounting the Docker socket gives the execution engine high control over the host Docker daemon. For production, isolate it on dedicated nodes or move execution to a stricter sandbox model.

## Useful Commands

```bash
# Frontend build
cd apps/frontend && npm run build

# Auth database migrations
cd services/auth-service && npm run migrate:deploy

# Check execution-engine syntax
node --check services/execution-engine/src/index.js

# View service logs
docker compose logs -f execution-engine
```

## License

ISC
