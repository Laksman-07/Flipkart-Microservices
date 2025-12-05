# Flipkart Clone - Microservices Architecture

## Overview

This is a Flipkart clone built with a microservices architecture. The application consists of 4 independent services:

- **Frontend (Next.js)** - Port 3000
- **Product Service** - Port 3001
- **Cart Service** - Port 3002
- **Order Service** - Port 3003

Each service runs independently and communicates via REST APIs.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Port 3000)                 │
│                       Next.js App                       │
└─────────────────────────────────────────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Product Service  │  │  Cart Service    │  │  Order Service   │
│   (Port 3001)    │  │  (Port 3002)     │  │  (Port 3003)     │
│   - Product data │  │  - Shopping cart │  │  - Order history │
│   - Filtering    │  │  - Cart items    │  │  - Order status  │
│   - Search       │  │  - Persistence   │  │  - Persistence   │
└──────────────────┘  └──────────────────┘  └──────────────────┘
     data.json            carts.json           orders.json
```

## Data Storage

Each microservice uses JSON files for data persistence:

- **Product Service**: `microservices/product-service/data.json`
- **Cart Service**: `microservices/cart-service/carts.json`
- **Order Service**: `microservices/order-service/orders.json`

## Quick Start

### Option 1: Using Shell Script (Linux/Mac)

```bash
chmod +x start-services.sh
./start-services.sh
```

### Option 2: Using Batch Script (Windows)

```bash
start-services.bat
```

### Option 3: Using Docker Compose

```bash
docker-compose up
```

### Option 4: Manual Start

Open 4 terminal windows and run:

```bash
# Terminal 1 - Product Service
cd microservices/product-service
npm install
npm run dev

# Terminal 2 - Cart Service
cd microservices/cart-service
npm install
npm run dev

# Terminal 3 - Order Service
cd microservices/order-service
npm install
npm run dev

# Terminal 4 - Frontend
npm install
npm run dev
```

## Access the Application

Once all services are running:

- Frontend: http://localhost:3000
- Product Service API: http://localhost:3001
- Cart Service API: http://localhost:3002
- Order Service API: http://localhost:3003

## API Endpoints

### Product Service (Port 3001)

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /categories` - Get all categories
- `GET /brands` - Get all brands
- `GET /search?q=<query>` - Search products
- `POST /filter` - Filter products with criteria

### Cart Service (Port 3002)

- `GET /cart/:userId` - Get user's cart
- `POST /cart/:userId/add` - Add item to cart
- `POST /cart/:userId/remove` - Remove item from cart
- `POST /cart/:userId/update` - Update item quantity
- `POST /cart/:userId/clear` - Clear entire cart
- `GET /cart/:userId/total` - Get cart total

### Order Service (Port 3003)

- `GET /orders/:userId` - Get user's orders
- `POST /orders/:userId` - Create new order
- `GET /orders/:userId/:orderId` - Get order details
- `PATCH /orders/:userId/:orderId/status` - Update order status

## Features

- Browse products with filters (category, price, rating)
- Search functionality
- Add/remove items from cart
- View cart and checkout
- Place orders
- Order history and tracking
- Responsive design
- Toast notifications

## Environment

All services run on localhost with the following ports:

- Frontend: 3000
- Product Service: 3001
- Cart Service: 3002
- Order Service: 3003

## Scaling

To add more instances of a service:

1. Modify `docker-compose.yml` to add new service definitions
2. Change port mappings to avoid conflicts
3. Update environment variables in the frontend as needed

## Troubleshooting

### Services won't start
- Ensure ports 3000-3003 are available
- Check Node.js version (18+ recommended)
- Delete `node_modules` and reinstall dependencies

### Cart not persisting
- Check `microservices/cart-service/carts.json` has write permissions
- Ensure the service is running on port 3002

### Products not loading
- Check `microservices/product-service/data.json` exists
- Verify Product Service is running on port 3001

### CORS errors
- All services have CORS enabled
- Check browser console for detailed errors

## Development

To modify a microservice:

1. Edit the service files in `microservices/<service-name>/`
2. Restart that service
3. No need to restart other services

## Production Deployment

For production:

1. Build frontend: `npm run build`
2. Deploy each microservice separately
3. Update API base URLs in `lib/api-client.ts`
4. Use environment variables for configuration
5. Implement load balancing for multiple instances
