import client from "../db";
import { User } from "../../helpers/types";

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
