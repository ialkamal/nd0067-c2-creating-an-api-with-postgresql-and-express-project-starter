import client from "./db";
import { User, Product, Order } from "../helpers/types";

//User CRUD Operations

export const createUser = async (user: User): Promise<User> => {
  const conn = await client.connect();
  const query = `INSERT INTO users (firstname, lastname, password) VALUES ($1, $2, $3) RETURNING *`;
  const result = await conn.query<User>(query, [
    user.firstname,
    user.lastname,
    user.hash,
  ]);
  conn.release();
  return result.rows[0];
};

export const getUserByID = async (id: number): Promise<User> => {
  const conn = await client.connect();
  const query = `SELECT id, firstname, lastname FROM users WHERE id=($1)`;
  const result = await conn.query(query, [id]);
  conn.release();
  return result.rows[0];
};

export const getAllUsers = async (): Promise<User[]> => {
  const conn = await client.connect();
  const query = `SELECT id, firstname, lastname FROM users`;
  const result = await conn.query(query, []);
  conn.release();
  return result.rows;
};

//Product CRUD Operations

export const getAllProducts = async (): Promise<Product[]> => {
  const conn = await client.connect();
  const query = `SELECT id, name, price, category FROM products`;
  const result = await conn.query(query, []);
  conn.release();
  return result.rows;
};

export const getProductByID = async (id: number): Promise<Product> => {
  const conn = await client.connect();
  const query = `SELECT id, name, price, category FROM products WHERE id=($1)`;
  const result = await conn.query(query, [id]);
  conn.release();
  return result.rows[0];
};

export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const conn = await client.connect();
  const query = `SELECT * FROM products WHERE category=($1)`;
  const result = await conn.query(query, [category]);
  conn.release();
  return result.rows;
};

export const getTopFivePopularProducts = async (): Promise<Product[]> => {
  const conn = await client.connect();
  const query = `SELECT p.name,count(p.name) as count, p.price, 
                p.category FROM products as p
                JOIN products_orders as po ON p.id=po.product_id
                JOIN orders as o ON po.order_id=o.id
                GROUP BY p.name, p.price, p.category
                ORDER BY count DESC LIMIT 5`;
  const result = await conn.query(query, []);
  conn.release();
  return result.rows;
};

export const createProduct = async (product: Product): Promise<Product> => {
  const conn = await client.connect();
  const query = `INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *`;
  const result = await conn.query<Product>(query, [
    product.name,
    product.price,
    product.category,
  ]);
  conn.release();
  return result.rows[0];
};

//Order CRUD Operations

export const currentOrderByUser = async (
  user_id: number
): Promise<Order | {}> => {
  const conn = await client.connect();
  const query = `SELECT o.id as order_id, p.id as product_id, po.quantity, 
                 u.id as user_id, o.status FROM orders as o
                 JOIN products_orders as po ON o.id=po.order_id
                 JOIN products as p ON po.product_id=p.id
                 JOIN users as u ON o.user_id=u.id
                 WHERE o.status=true AND o.user_id=($1)`;
  const result = await conn.query<any>(query, [user_id]);
  conn.release();
  console.log(result.rows);
  if (result.rows && result.rows.length >= 1) {
    const order = {
      id: result.rows[0].order_id,
      products: result.rows.map((row) => {
        return { product_id: row.product_id, quantity: row.quantity };
      }),
      user_id: result.rows[0].user_id,
      active_status: result.rows[0].status,
    };
    return order as unknown as Order;
  } else return {};
};

export const completedOrdersByUser = async (
  user_id: number
): Promise<Order[] | []> => {
  const conn = await client.connect();
  const query = `SELECT o.id as order_id, p.id as product_id, po.quantity, 
                 u.id as user_id, o.status FROM orders as o
                 JOIN products_orders as po ON o.id=po.order_id
                 JOIN products as p ON po.product_id=p.id
                 JOIN users as u ON o.user_id=u.id
                 WHERE o.status=false AND o.user_id=($1)`;
  const result = await conn.query<any>(query, [user_id]);
  conn.release();

  if (result.rows && result.rows.length >= 1) {
    const OrdersMap = Array.from(
      new Set(
        result.rows.map((row) => {
          return row.order_id;
        })
      )
    );

    const orders = OrdersMap.map((order) => {
      const releventOrder = result.rows.filter((row) => row.order_id === order);
      console.log("RelevantOrder: ", JSON.stringify(releventOrder, null, 2));
      return {
        id: releventOrder[0].order_id,
        products: releventOrder.map((row) => {
          return { product_id: row.product_id, quantity: row.quantity };
        }),
        user_id: releventOrder[0].user_id,
        active_status: releventOrder[0].status,
      };
    });

    return orders as unknown as Order[];
  } else return [];
};
