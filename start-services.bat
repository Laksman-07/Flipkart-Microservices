@echo off
setlocal enabledelayedexpansion

echo Installing dependencies for microservices...

cd microservices\product-service
call npm install
cd ..\..

cd microservices\cart-service
call npm install
cd ..\..

cd microservices\order-service
call npm install
cd ..\..

echo Starting all microservices...
echo.
echo Product Service will start on: http://localhost:3001
echo Cart Service will start on: http://localhost:3002
echo Order Service will start on: http://localhost:3003
echo Frontend will start on: http://localhost:3000
echo.

echo Starting Product Service...
start "Product Service" cmd /k "cd microservices\product-service && npm run dev"

echo Starting Cart Service...
start "Cart Service" cmd /k "cd microservices\cart-service && npm run dev"

echo Starting Order Service...
start "Order Service" cmd /k "cd microservices\order-service && npm run dev"

timeout /t 2 /nobreak

echo Starting Frontend...
start "Frontend" cmd /k "npm run dev"

echo All services are starting. Check the individual windows for logs.
pause
