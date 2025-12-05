#!/bin/bash

set -e

echo "Installing dependencies for microservices..."

cd microservices/product-service
npm install
cd ../..

cd microservices/cart-service
npm install
cd ../..

cd microservices/order-service
npm install
cd ../..

echo "Starting all microservices..."
echo ""
echo "Product Service will start on: http://localhost:3001"
echo "Cart Service will start on: http://localhost:3002"
echo "Order Service will start on: http://localhost:3003"
echo "Frontend will start on: http://localhost:3000"
echo ""

(
  echo "Starting Product Service..."
  cd microservices/product-service
  npm run dev
) &
PRODUCT_PID=$!

(
  echo "Starting Cart Service..."
  cd microservices/cart-service
  npm run dev
) &
CART_PID=$!

(
  echo "Starting Order Service..."
  cd microservices/order-service
  npm run dev
) &
ORDER_PID=$!

sleep 2

(
  echo "Starting Frontend..."
  npm run dev
) &
FRONTEND_PID=$!

trap "kill $PRODUCT_PID $CART_PID $ORDER_PID $FRONTEND_PID 2>/dev/null" EXIT

wait
