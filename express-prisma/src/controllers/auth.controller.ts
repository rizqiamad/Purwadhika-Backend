import { Request, Response } from "express";
import prisma from "../prisma";
import { genSalt, hash, compare } from "bcrypt";
import { findUser } from "../services/user.service";
import { sign, verify } from "jsonwebtoken";
import { transporter } from "../services/mailer";
import path from "path";
import fs, { link } from "fs";
import handlebars from "handlebars";

export class AuthController {
  async registerUser(req: Request, res: Response) {
    try {
      const { password, confirmPassword } = req.body;
      if (password != confirmPassword) throw { message: "Password not match!" };

      const user = await findUser(req.body.username, req.body.email);
      if (user) throw { message: "username or email has been used" };

      delete req.body.confirmPassword;

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      req.body.password = hashPassword;
      const newUser = await prisma.user.create({ data: req.body });

      const payload = { id: newUser.id, role: newUser.role };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "10m" });
      const link = `http://localhost:3000/verify/${token}`;

      const templatePath = path.join(__dirname, "../templates", "verify.html");
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compailedTemplate = handlebars.compile(templateSource);
      const html = compailedTemplate({ username: req.body.username, link });

      await transporter.sendMail({
        from: "Blogger Admin",
        to: req.body.email,
        subject: "Welcome to Blogger 🙌",
        html,
      });

      res.status(200).send({ message: "Register Success✅, Check your email to verify" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const user = await findUser(data, data);

      if (!user) throw { message: "Account not found" };
      if (user.isSuspend) throw { message: "Account is suspended" };
      if (!user.isVerify) throw { message: "Account is not verified" };

      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) throw { message: "Incorrect Password" };

      const payload = { id: user.id, role: user.role };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "10m" });

      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 10,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        })
        .send({
          message: "Login Successfully ✅",
          user,
        });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const verifiedUser: any = verify(token, process.env.JWT_KEY!);
      await prisma.user.update({
        data: { isVerify: true },
        where: { id: verifiedUser.id },
      });
      res.status(200).send({ message: "Account has been verified" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
