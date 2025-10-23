# API Requirements

This document outlines the API endpoints, database schema, and data shapes for the Storefront Backend API.

---

## API Endpoints

### Users

| HTTP Verb | Route        | Description       | Authentication     |
| --------- | ------------ | ----------------- | ------------------ |
| **POST**  | `/users`     | Create a new user | None               |
| **GET**   | `/users`     | Get all users     | **Token Required** |
| **GET**   | `/users/:id` | Get user by ID    | **Token Required** |

### Products

| HTTP Verb | Route                          | Description                     | Authentication     |
| --------- | ------------------------------ | ------------------------------- | ------------------ |
| **GET**   | `/products`                    | Get all products                | None               |
| **GET**   | `/products/:id`                | Get product by ID               | None               |
| **GET**   | `/products/category/:category` | Get products by category        | None               |
| **GET**   | `/products/top_five`           | Get top 5 most popular products | None               |
| **POST**  | `/products`                    | Create a new product            | **Token Required** |

### Orders

| HTTP Verb | Route                              | Description                   | Authentication     |
| --------- | ---------------------------------- | ----------------------------- | ------------------ |
| **GET**   | `/orders/current/:user_id`   | Get current order for user    | **Token Required** |
| **GET**   | `/orders/completed/:user_id` | Get completed orders for user | **Token Required** |

---

## Database Schema

### Table: users

| Column        | Data Type | Constraints |
| ------------- | --------- | ----------- |
| **id**        | SERIAL    | PRIMARY KEY |
| **firstname** | VARCHAR   | NOT NULL    |
| **lastname**  | VARCHAR   | NOT NULL    |
| **password**  | VARCHAR   | NOT NULL    |

### Table: products

| Column       | Data Type | Constraints |
| ------------ | --------- | ----------- |
| **id**       | SERIAL    | PRIMARY KEY |
| **name**     | VARCHAR   | NOT NULL    |
| **price**    | DECIMAL   | NOT NULL    |
| **category** | VARCHAR   | NOT NULL    |

### Table: orders

| Column      | Data Type | Constraints                      |
| ----------- | --------- | -------------------------------- |
| **id**      | SERIAL    | PRIMARY KEY                      |
| **user_id** | INTEGER   | FOREIGN KEY REFERENCES users(id) |
| **status**  | BOOLEAN   | NOT NULL                         |

_Note: status = true means active order, status = false means completed order_

### Table: products_orders (Join Table)

| Column         | Data Type | Constraints                         |
| -------------- | --------- | ----------------------------------- |
| **order_id**   | INTEGER   | FOREIGN KEY REFERENCES orders(id)   |
| **product_id** | INTEGER   | FOREIGN KEY REFERENCES products(id) |
| **quantity**   | INTEGER   | NOT NULL                            |
|                |           | PRIMARY KEY (order_id, product_id)  |

---

## Data Shapes

### User

```typescript
type User = {
  id: number;
  firstname: string;
  lastname: string;
  password: string;
};
```

### Product

```typescript
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};
```

### Order

```typescript
type Order = {
  id: number;
  user_id: number;
  status: boolean;
};
```

### Product in Order

```typescript
type ProductInOrder = {
  order_id: number;
  product_id: number;
  quantity: number;
};
```

---

## Authentication

Routes marked with **Token Required** need a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are generated when creating a new user via `POST /users`.
