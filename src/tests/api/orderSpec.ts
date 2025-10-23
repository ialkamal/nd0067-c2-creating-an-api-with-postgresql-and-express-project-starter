import request from "supertest";
import client from "../../data/db";

const BASE = "localhost:3000";

describe("Orders API Endpoints", () => {
  let token: String = "";
  let id: Number | null = null;

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
  });

  it("Get Current Order For User", async () => {
    const res = await request(BASE)
      .get("/orders/current/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("content-type", /json/i);

    expect(res.body).toBeDefined();
    expect(res.body).toEqual(
      jasmine.objectContaining({
        id: jasmine.any(Number),
        products: jasmine.arrayContaining([
          jasmine.objectContaining({
            product_id: jasmine.any(Number),
            quantity: jasmine.any(Number),
          }),
        ]),
        user_id: 1,
        active_status: true,
      })
    );
  });

  it("Get Completed Orders For User", async () => {
    const res = await request(BASE)
      .get("/orders/completed/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("content-type", /json/i);

    expect(res.body).toBeDefined();
    expect(res.body).toEqual(
      jasmine.arrayContaining([
        jasmine.objectContaining({
          id: jasmine.any(Number),
          products: jasmine.arrayContaining([
            jasmine.objectContaining({
              product_id: jasmine.any(Number),
              quantity: jasmine.any(Number),
            }),
          ]),
          user_id: 1,
          active_status: false,
        }),
      ])
    );
  });

  afterAll(async () => {
    const conn = await client.connect();
    const query = `DELETE FROM users WHERE id=($1)`;
    await conn.query(query, [id]);
    conn.release();
  });
});
