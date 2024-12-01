import { Request, Response } from "express";
import prisma from "../prisma";
import { genSalt, hash, compare } from "bcrypt";
import { findUser } from "../services/user.service";
import { sign } from "jsonwebtoken";

export class AuthController {
  async registerUser(req: Request, res: Response) {
    try {
      const { password, confirmPassword } = req.body;
      if (password != confirmPassword) throw "Password not match!";

      const user = await findUser(req.body.username, req.body.email);
      if (user) throw "username or email has been used";

      delete req.body.confirmPassword;

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      req.body.password = hashPassword;
      await prisma.user.create({ data: req.body });
      res.status(200).send("Register Success✅");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const user = await findUser(data, data);

      if (!user) throw "Account not found";

      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) throw "Incorrect Password";

      const payload = { id: user.id, role: user.role };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "10m" });

      res.status(200).send({
        message: "Login Successfully ✅",
        token,
        user,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
