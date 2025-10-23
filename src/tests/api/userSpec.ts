import request from "supertest";
import client from "../../data/db";

const BASE = "localhost:3000";

describe("Users API Endpoints", () => {
  let token: String = "";
  let id: Number | null = null;

  beforeAll(async () => {
    const res = await request(BASE)
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
  it("Create a new user", async () => {
    expect(token).toBeDefined();
    expect(token).toEqual(jasmine.any(String));
    expect(id).toBeDefined();
    expect(id).toEqual(jasmine.any(Number));
  });
  it("Gets all users", async () => {
    const res = await request(BASE)
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("content-type", /json/i);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBeTrue();
  });

  it("Gets user by ID", async () => {
    const res = await request(BASE)
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("content-type", /json/i);

    expect(res.body).toBeDefined();
    expect(res.body).toEqual(
      jasmine.objectContaining({
        id: jasmine.any(Number),
        firstname: jasmine.any(String),
        lastname: jasmine.any(String),
      })
    );
  });
  afterAll(async () => {
    const conn = await client.connect();
    const query = `DELETE FROM users WHERE id=($1)`;
    await conn.query(query, [id]);
    conn.release();
  });
});
