import { Router, Request, Response } from "express";
import { Order } from "../helpers/types";
import { auth } from "../middleware";
import { currentOrderByUser, completedOrdersByUser } from "../data/models/orders";

const orders = Router();

orders.get("/current/:id", auth, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id)))
    return res.status(400).json({ error: "Malformed ID, must be a number!" });
  const order: Order | {} = await currentOrderByUser(Number(id));
  if (order) return res.status(200).json(order);
  else return res.status(200).json({});
});

orders.get("/completed/:id", auth, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id)))
    return res.status(400).json({ error: "Malformed ID, must be a number!" });
  const orders: Order[] | [] = await completedOrdersByUser(Number(id));
  if (orders) return res.status(200).json(orders);
  else return res.status(200).json([]);
});

export default orders;
