import {
  createProduct,
  getProductByID,
  getAllProducts,
  getProductsByCategory,
  getTopFivePopularProducts,
} from "../../data/models/products";
import client from "../../data/db";

describe("Product Models", () => {
  let id: Number | undefined;
  let category: string = "Electronics";

  beforeAll(async () => {
    const new_product = await createProduct({
      name: "Test Laptop",
      price: "999.99",
      category: category,
    });
    id = new_product.id;
    expect(new_product).toEqual(
      jasmine.objectContaining({
        id: jasmine.any(Number),
        name: jasmine.any(String),
        price: jasmine.any(String),
        category: jasmine.any(String),
      })
    );
  });

  it("DB createProduct method", async () => {
    expect(createProduct).toBeDefined();
    expect(id).toEqual(jasmine.any(Number));
  });

  it("DB getProductByID method", async () => {
    expect(getProductByID).toBeDefined();
    const product = await getProductByID(Number(id));
    expect(product).toEqual(
      jasmine.objectContaining({
        id: jasmine.any(Number),
        name: jasmine.any(String),
        price: jasmine.any(String),
        category: jasmine.any(String),
      })
    );
  });

  it("DB getAllProducts method", async () => {
    expect(getAllProducts).toBeDefined();
    const allProducts = await getAllProducts();
    expect(Array.isArray(allProducts)).toBeTrue();
    expect(allProducts.length).toBeGreaterThan(0);
  });

  it("DB getProductsByCategory method", async () => {
    expect(getProductsByCategory).toBeDefined();
    const products = await getProductsByCategory(category);
    expect(Array.isArray(products)).toBeTrue();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].category).toEqual(category);
  });

  it("DB getTopFivePopularProducts method", async () => {
    expect(getTopFivePopularProducts).toBeDefined();
    const topProducts = await getTopFivePopularProducts();
    expect(Array.isArray(topProducts)).toBeTrue();
    expect(topProducts.length).toBeLessThanOrEqual(5);
  });

  afterAll(async () => {
    const conn = await client.connect();
    const query = `DELETE FROM products WHERE id=($1)`;
    await conn.query(query, [id]);
    conn.release();
  });
});
