import client from "../db";
import { User } from "../../helpers/types";

//User CRUD Operations

export const createUser = async (user: User): Promise<User> => {
  try {
    const conn = await client.connect();
    const query = `INSERT INTO users (firstname, lastname, password) VALUES ($1, $2, $3) RETURNING *`;
    const result = await conn.query<User>(query, [
      user.firstname,
      user.lastname,
      user.hash,
    ]);
    conn.release();
    return result.rows[0];
  } catch (e) {
    throw Error("DB Error in creating a new user.");
  }
};

export const getUserByID = async (id: number): Promise<User> => {
  try {
    const conn = await client.connect();
    const query = `SELECT id, firstname, lastname FROM users WHERE id=($1)`;
    const result = await conn.query(query, [id]);
    conn.release();
    return result.rows[0];
  } catch (e) {
    throw Error("DB Error in getting user by ID.");
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const conn = await client.connect();
    const query = `SELECT id, firstname, lastname FROM users`;
    const result = await conn.query(query, []);
    conn.release();
    return result.rows;
  } catch (e) {
    throw Error("DB Error in getting all users.");
  }
};
