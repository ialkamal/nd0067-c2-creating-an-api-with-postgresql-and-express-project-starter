import express, { Request, Response } from "express";
import users from "./api/users";
import products from "./api/products";
import orders from "./api/orders";
import bodyParser from "body-parser";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.status(200).json({ msg: "API is up!" });
});

app.use("/users", users);
app.use("/products", products);
app.use("/orders", orders);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
