import { Router, Request, Response } from "express";
import { User } from "../helpers/types";
import { auth } from "../middleware";
import { createUser, getAllUsers, getUserByID } from "../data/data";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const users = Router();

users.post("/", async (req: Request, res: Response) => {
  const { firstname, lastname, password } = req.body;

  const hash = bcrypt.hashSync(
    password + process.env.PEPPER,
    Number(process.env.SALT)
  );

  const newUser: User = await createUser({
    firstname,
    lastname,
    hash,
  });
  if (newUser) {
    const token: string = jwt.sign(
      {
        id: newUser.id,
        firstName: newUser.firstname,
        lastName: newUser.lastname,
      },
      process.env.JWT_SECRET ?? "hello"
    );
    return res.status(201).json({
      User: {
        id: newUser.id,
        firstName: newUser.firstname,
        lastName: newUser.lastname,
      },
      token,
      message: "User created successfully!",
    });
  } else return res.status(500).json({ message: "Error in creating the user" });
});

users.get("/", auth, async (req: Request, res: Response) => {
  const usersList = await getAllUsers();
  if (usersList && usersList.length > 0) return res.status(200).json(usersList);
  else return res.status(200).json([]);
});

users.get("/:id", auth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUserByID(Number(id));
  if (user) return res.status(200).json(user);
  else return res.status(200).json([]);
});

export default users;
