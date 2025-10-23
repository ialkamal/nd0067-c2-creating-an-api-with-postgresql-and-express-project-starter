import client from "../db";
import { Order } from "../../helpers/types";

//Order CRUD Operations

export const currentOrderByUser = async (
  user_id: number
): Promise<Order | {}> => {
  try {
    const conn = await client.connect();
    const query = `SELECT o.id as order_id, p.id as product_id, po.quantity, 
                   u.id as user_id, o.status FROM orders as o
                   JOIN products_orders as po ON o.id=po.order_id
                   JOIN products as p ON po.product_id=p.id
                   JOIN users as u ON o.user_id=u.id
                   WHERE o.status=true AND o.user_id=($1)`;
    const result = await conn.query<any>(query, [user_id]);
    conn.release();
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
  } catch (e) {
    throw Error("DB Error in getting current order by user.");
  }
};

export const completedOrdersByUser = async (
  user_id: number
): Promise<Order[] | []> => {
  try {
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
        const releventOrder = result.rows.filter(
          (row) => row.order_id === order
        );
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
  } catch (e) {
    throw Error("DB Error in getting completed orders by users.");
  }
};
