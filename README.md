A full-stack Flipkart clone implemented using a microservices architecture. The project includes:

Frontend: Built with Next.js (App Router) and React, styled with Tailwind CSS.

Microservices: Three backend services (Product, Cart, Order) built with Node.js / Express.

Containerized: All services have their own Dockerfiles, enabling containerized development and production.

Orchestrated: Development and production environments can be run locally using Docker Compose.

Kubernetes Ready: Deployment manifests provided for AKS with Deployments, Services, and Ingress.

Environment Configuration: Frontend connects to microservices via environment variables, supporting seamless local and cluster deployments.

Features:

Independent microservices for scalability and maintainability.

Production-ready Docker setup.

CI/CD ready for Azure DevOps pipeline integration.

Healthchecks and restart policies configured for microservices.

Getting Started:

Clone the repository.

Build and run locally using Docker Compose:

docker-compose up --build


Access the frontend: http://localhost:3000
