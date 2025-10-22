import client from "../db";
import { Product } from "../../helpers/types";

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
