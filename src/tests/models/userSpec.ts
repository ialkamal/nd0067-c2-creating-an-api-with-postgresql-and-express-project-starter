import { createUser, getUserByID, getAllUsers } from "../../data/models/users";
import client from "../../data/db";

describe("User Models", () => {
  let id: Number | undefined;
  beforeAll(async () => {
    const new_user = await createUser({
      firstname: "Basel",
      lastname: "Taher",
      hash: "ismail",
    });
    id = new_user.id;
    expect(new_user).toEqual(
      jasmine.objectContaining({
        id: jasmine.any(Number),
        firstname: jasmine.any(String),
        lastname: jasmine.any(String),
      })
    );
  });

  it("DB createUser method", async () => {
    expect(createUser).toBeDefined();
    expect(id).toEqual(jasmine.any(Number));
  });

  it("DB getUserByID method", async () => {
    expect(getUserByID).toBeDefined();
    const user = await getUserByID(Number(id));
    expect(user).toEqual(
      jasmine.objectContaining({
        id: jasmine.any(Number),
        firstname: jasmine.any(String),
        lastname: jasmine.any(String),
      })
    );
  });

  it("DB getAllUsers method", async () => {
    expect(getAllUsers).toBeDefined();
    const allUsers = await getAllUsers();
    expect(Array.isArray(allUsers)).toBeTrue();
  });
  afterAll(async () => {
    const conn = await client.connect();
    const query = `DELETE FROM users WHERE id=($1)`;
    await conn.query(query, [id]);
    conn.release();
  });
});
