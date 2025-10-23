import request from "supertest";
import client from "../../data/db";

const BASE = "localhost:3000";

describe("Products API Endpoints", () => {
  let token: String = "";
  let id: Number | null = null;
  let pid: Number | null = null;
  let category: String = "";

  beforeAll(async () => {
    let res = await request(BASE)
      .post("/users")
      .send({
        firstname: "Basel",
        lastname: "Taher",
        password: "ismail",
      })
      .expect(201)
      .expect("content-type", /json/i);

    expect(res.body).toBeDefined();
    expect(res.body).toEqual(
      jasmine.objectContaining({
        User: jasmine.objectContaining({
          id: jasmine.any(Number),
          firstname: jasmine.any(String),
          lastname: jasmine.any(String),
        }),
        token: jasmine.any(String),
        message: "User created successfully!",
      })
    );
    id = res.body.User.id;
    token = res.body.token;

    res = await request(BASE)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Big Thing",
        price: 499.99,
        category: "gadgets",
      })
      .expect(200)
      .expect("content-type", /json/i);

    expect(res.body).toBeDefined();
    expect(res.body).toEqual(
      jasmine.objectContaining({
        id: jasmine.any(Number),
        name: jasmine.any(String),
        price: jasmine.any(String),
        category: jasmine.any(String),
      })
    );

    category = res.body.category;
    pid = res.body.id;
  });
  it("Create a new product", async () => {
    expect(pid).toBeDefined();
    expect(pid).not.toBeNull();
  });
  it("Return Products Index", async () => {
    const res = await request(BASE)
      .get("/products")
      .expect(200)
      .expect("content-type", /json/i);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBeTrue();
  });

  it("Show product by ID", async () => {
    const res = await request(BASE)
      .get(`/products/${pid}`)
      .expect(200)
      .expect("content-type", /json/i);

    expect(res.body).toBeDefined();
    expect(res.body).toEqual(
      jasmine.objectContaining({
        id: jasmine.any(Number),
        name: jasmine.any(String),
        price: jasmine.any(String),
        category: jasmine.any(String),
      })
    );
  });

  it("List products by Category", async () => {
    const res = await request(BASE)
      .get(`/products/category/${category}`)
      .expect(200)
      .expect("content-type", /json/i);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBeTrue();
  });

  it("return Top 5 Most Popular Products", async () => {
    const res = await request(BASE)
      .get(`/products/top_five`)
      .expect(200)
      .expect("content-type", /json/i);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBeTrue();
    expect(res.body.length).toBeLessThanOrEqual(5);
  });

  afterAll(async () => {
    const conn = await client.connect();
    let query = `DELETE FROM users WHERE id=($1)`;
    await conn.query(query, [id]);
    query = `DELETE FROM products WHERE id=($1)`;
    await conn.query(query, [pid]);
    conn.release();
  });
});
