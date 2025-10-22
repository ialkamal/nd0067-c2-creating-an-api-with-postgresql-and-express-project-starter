import { Router, Request, Response } from "express";
import { Product } from "../helpers/types";
import { auth } from "../middleware";
import {
  getAllProducts,
  getProductByID,
  getProductsByCategory,
  getTopFivePopularProducts,
  createProduct,
} from "../data/models/products";

const products = Router();

products.get("/", async (req: Request, res: Response) => {
  const productsList: Product[] = await getAllProducts();
  if (productsList && productsList.length > 0)
    return res.status(200).json(productsList);
  else return res.status(200).json([]);
});

products.get("/top_five", async (req: Request, res: Response) => {
  const products: Product[] = await getTopFivePopularProducts();
  if (products && products.length > 0) return res.status(200).json(products);
  else return res.status(404).json([]);
});

products.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (isNaN(Number(id)))
      return res.status(400).json({ error: "Malformed ID, must be a number!" });
    const product: Product = await getProductByID(Number(id));
    if (product) return res.status(200).json(product);
    else return res.status(404).json({});
  } catch (e) {
    return res.status(500).json(e);
  }
});

products.get("/category/:category", async (req: Request, res: Response) => {
  const { category } = req.params;
  const products: Product[] = await getProductsByCategory(category);
  if (products && products.length > 0) return res.status(200).json(products);
  else return res.status(404).json([]);
});

products.post("/", auth, async (req: Request, res: Response) => {
  const { name, price, category } = req.body;
  const new_product: Product = await createProduct({ name, price, category });
  if (new_product) return res.status(200).json(new_product);
  else return res.status(404).json({});
});

export default products;
