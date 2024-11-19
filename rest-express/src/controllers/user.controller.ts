import { Request, Response } from "express";
import fs from "fs";
import { IUser } from "../types/user";

export class UserController {
  getUsers(req: Request, res: Response) {
    try {
      const users: IUser = JSON.parse(
        fs.readFileSync("./db/users.json", "utf-8")
      );
      res.status(200).send({ users });
    } catch (err) {
      res.status(400).send({ message: err });
    }
  }

  getUser(req: Request, res: Response) {
    const { id } = req.params;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );
    const userId = users.find((item) => item.id === +id);
    res.status(200).send({ user: userId });
  }

  addUser(req: Request, res: Response) {
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );
    const id = Math.max(...users.map((item) => +item.id)) + 1 || 1;
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).send({ message: "All fields are required" });
      return;
    }
    const newData: IUser = { id, name, email, password };
    users.push(newData);
    fs.writeFileSync("./db/users.json", JSON.stringify(users), "utf-8");
    res.status(200).send({ user: newData });
  }

  editUser(req: Request, res: Response) {
    const { id } = req.params;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );
    const userIndex = users.findIndex((el) => el.id == +id);
    if (userIndex < 0) {
      res.status(400).send({ message: "User not found" });
      return;
    }
    for (const key in req.body) {
      users[userIndex][key as keyof IUser] = req.body[key];
    }
    fs.writeFileSync("./db/users.json", JSON.stringify(users), "utf-8");
    res.status(200).send({ user: users[userIndex] });
  }

  editElementUser(req: Request, res: Response) {
    const { id } = req.params;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );
    const userIndex = users.findIndex((el) => el.id == +id);
    users[userIndex] = req.body;
    fs.writeFileSync("./db/users.json", JSON.stringify(users), "utf-8");
    res.status(200).send({ user: users[userIndex] });
  }

  deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );
    const userIndex = users.findIndex((el) => el.id == +id);
    if (userIndex < 0) {
      res.status(400).send({ message: "User not found" });
      return;
    }
    const delUser = users.splice(userIndex, 1);
    fs.writeFileSync("./db/users.json", JSON.stringify(users), "utf-8");
    res.status(200).send({ user: delUser[0] });
  }
}
