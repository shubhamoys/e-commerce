# Microservice based E-Commerce application

A full-stack e-commerce application built with microservices architecture, featuring NestJS backend services, Next.js frontend, and RabbitMQ for inter-service communication.

## Tech Stack

**Backend:**

- NestJS (Node.js framework)
- TypeORM with PostgreSQL
- RabbitMQ (Message Broker)
- JWT Authentication
- Passport.js

**Frontend:**

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui Components
- Zustand (State Management)
- Axios

## Project Structure

```
e-commerce/
├── customer-management/        # Customer Service (Port: 3002)
│   ├── src/
│   │   ├── auth/              # Authentication (register, login)
│   │   ├── customers/         # Customer management
│   │   ├── cart/              # Shopping cart operations
│   │   ├── messaging/         # RabbitMQ message handling
│   │   └── database/
│   │       └── migrations/    # Database migrations
│   └── .env.example
│
├── product-order-management/   # Product & Order Service (Port: 3001)
│   ├── src/
│   │   ├── products/          # Product catalog
│   │   ├── orders/            # Order management
│   │   └── database/
│   │       ├── migrations/    # Database migrations
│   │       └── seeds/         # Database seeders
│   └── .env.example
│
└── e-commerce-frontend/        # Next.js Frontend (Port: 3000)
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/        # Auth pages (login, register)
    │   │   └── (main)/        # Main pages (products, cart, orders)
    │   ├── components/
    │   ├── services/          # API services
    │   ├── store/             # Zustand stores
    │   └── types/             # TypeScript types
    └── .env.local (create manually)
```

## Setup Instructions

### Prerequisites

- Node.js (v20 or higher)
- PostgreSQL (v14 or higher)
- RabbitMQ
- Git

### 1. Clone Repository

```bash
git clone git@github.com:shubhamoys/e-commerce.git
cd e-commerce
git pull origin master
```

### 2. Database Setup

Create two PostgreSQL databases:

```sql
CREATE DATABASE customer_db;
CREATE DATABASE product_order_db;
```

### 3. RabbitMQ Setup

**Option A: Using Docker (Recommended)**

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```

**Option B: Local Installation**

- Install RabbitMQ from https://www.rabbitmq.com/download.html
- Start RabbitMQ service
- Access management UI at http://localhost:15672 (guest/guest)

### 4. Customer Management Service

```bash
cd customer-management

# Copy environment file
cp .env.example .env

# Edit .env and configure:
# - Database credentials (DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD)
# - JWT secret (JWT_SECRET)
# - RabbitMQ URL (RABBITMQ_URL)

# Install dependencies
npm install

# Run migrations
npm run migration:run

# Start service
npm run start:dev
```

Service will run on **http://localhost:3002**

### 5. Product Order Management Service

```bash
cd product-order-management

# Copy environment file
cp .env.example .env

# Edit .env and configure:
# - Database credentials (DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD)
# - RabbitMQ URL (RABBITMQ_URL)

# Install dependencies
npm install

# Run migrations
npm run migration:run

# Run seeder (adds sample products)
npm run seed

# Start service
npm run start:dev
```

Service will run on **http://localhost:3001**

### 6. Frontend

```bash
cd e-commerce-frontend

# Create environment file
# Create .env.local with the following:
NEXT_PUBLIC_CUSTOMER_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:3001

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on **http://localhost:3000**

## Microservices Architecture

### Service Communication

```
┌─────────────────┐
│   Frontend      │
│  (Next.js)      │
│   Port: 3000    │
└────────┬────────┘
         │
         │ HTTP REST APIs
         │
    ┌────┴────────────────────┐
    │                         │
┌───▼──────────────┐   ┌──────▼────────────┐
│ Customer Service │   │ Product & Order   │
│  (NestJS)        │   │ Service (NestJS)  │
│  Port: 3002      │   │  Port: 3001       │
│                  │   │                   │
│ - Auth           │   │ - Products        │
│ - Customers      │   │ - Orders          │
│ - Cart           │   │                   │
└───┬──────────────┘   └──────┬────────────┘
    │                         │
    │      ┌─────────┐        │
    └──────► RabbitMQ ◄───────┘
           │ Message  │
           │  Broker  │
           └─────────┘
```

### RabbitMQ Events

**Published by Product & Order Service:**

- `order.created` → Notifies Customer Service when order is created

**Consumed by Customer Service:**

- Clears customer cart after order creation
- Creates customer order record

## API Endpoints (Postman API Documentaton available)

### Customer Service (Port: 3002)

#### Authentication

- `POST /auth/register` - Register new customer
- `POST /auth/login` - Customer login
- `GET /auth/me` - Get current user (Protected)

#### Cart

- `GET /cart` - Get customer cart (Protected)
- `POST /cart/items` - Add item to cart (Protected)
- `PUT /cart/items/:itemId` - Update cart item quantity (Protected)
- `DELETE /cart/items/:itemId` - Remove item from cart (Protected)
- `DELETE /cart` - Clear cart (Protected)

#### Orders

- `GET /customers/orders` - Get order history (Protected)

### Product & Order Service (Port: 3001)

#### Products

- `GET /products` - Get all products
- `GET /products/:id` - Get single product

#### Orders

- `POST /orders` - Create new order (Protected)
- `GET /orders/:id` - Get order details (Protected)

## Frontend Pages

### Auth Routes (No Header)

- `/login` - Customer login page
- `/register` - Customer registration page

### Main Routes (With Header)

- `/products` - Product catalog with pagination
- `/cart` - Shopping cart with quantity management
- `/orders` - Order history listing
- `/orders/[id]` - Order details view

### Features

- JWT-based authentication with persistent session
- Real-time cart count in header
- Responsive design (mobile-first)
- Order creation from cart
- Order authorization (users can only view their own orders)
- Indian locale (INR currency, Indian date format)

## Running Migrations

### Create New Migration

**Customer Service:**

```bash
cd customer-management
npm run migration:generate -- src/database/migrations/MigrationName
```

**Product Service:**

```bash
cd product-order-management
npm run migration:generate -- src/database/migrations/MigrationName
```

### Run Migrations

```bash
npm run migration:run
```

### Revert Migration

```bash
npm run migration:revert
```

## Development

### Start All Services

You need to run all three services simultaneously:

1. **Terminal 1:** Customer Service

   ```bash
   cd customer-management && npm run start:dev
   ```

2. **Terminal 2:** Product Order Service

   ```bash
   cd product-order-management && npm run start:dev
   ```

3. **Terminal 3:** Frontend

   ```bash
   cd e-commerce-frontend && npm run dev
   ```

4. **Ensure RabbitMQ is running** (Docker or local)

### Access Points

- Frontend: http://localhost:3000
- Customer Service: http://localhost:3002
- Product Service: http://localhost:3001
- RabbitMQ Management: http://localhost:15672

## Troubleshooting

**Database connection failed:**

- Ensure PostgreSQL is running
- Verify database credentials in `.env` files
- Check if databases `customer_db` and `product_order_db` exist

**RabbitMQ connection failed:**

- Ensure RabbitMQ is running on port 5672
- Check `RABBITMQ_URL` in both service `.env` files

**Migration errors:**

- Run `npm run migration:run` in each service directory
- Ensure database exists before running migrations

**Port already in use:**

- Check if ports 3000, 3001, 3002 are available
- Change port in respective `.env` files if needed
