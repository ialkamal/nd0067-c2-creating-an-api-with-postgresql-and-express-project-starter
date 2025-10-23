import { Router, Request, Response } from "express";
import { User } from "../helpers/types";
import { auth } from "../middleware";
import { createUser, getAllUsers, getUserByID } from "../data/models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const users = Router();

users.post("/", async (req: Request, res: Response) => {
  const { firstname, lastname, password } = req.body;

  const hash = bcrypt.hashSync(
    password + process.env.PEPPER,
    Number(process.env.SALT)
  );

  try {
    const newUser: User = await createUser({
      firstname,
      lastname,
      hash,
    });
    if (newUser) {
      const token: string = jwt.sign(
        {
          id: newUser.id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
        },
        process.env.JWT_SECRET ?? "hello"
      );
      return res.status(201).json({
        User: {
          id: newUser.id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
        },
        token,
        message: "User created successfully!",
      });
    } else
      return res.status(500).json({ message: "Error in creating the user" });
  } catch (e) {
    return res.status(500).json(e);
  }
});

users.get("/", auth, async (req: Request, res: Response) => {
  try {
    const usersList = await getAllUsers();
    if (usersList && usersList.length > 0)
      return res.status(200).json(usersList);
    else return res.status(200).json([]);
  } catch (e) {
    return res.status(500).json(e);
  }
});

users.get("/:id", auth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await getUserByID(Number(id));
    if (user) return res.status(200).json(user);
    else return res.status(200).json([]);
  } catch (e) {
    return res.status(500).json(e);
  }
});

export default users;
