import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      console.log(req.user);
      const filter: Prisma.UserWhereInput = {};
      const { search, page = 1, limit = 3 } = req.query;
      if (search) {
        // filter.username = { contains: `${search}` };
        filter.OR = [
          { username: { contains: `${search}`, mode: "insensitive" } },
          { email: { contains: `${search}`, mode: "insensitive" } },
        ];
      }

      const countUser = await prisma.user.aggregate({ _count: { _all: true } });
      const total_page = Math.ceil(countUser._count._all / +limit);
      const users = await prisma.user.findMany({
        where: filter,
        orderBy: { id: "asc" },
        take: +limit,
        skip: +limit * (+page - 1),
      });
      res.status(200).send({ total_page, page, users });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async createUser(req: Request, res: Response) {
    try {
      await prisma.user.create({ data: req.body });
      res.status(200).send("User has been added ✅");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async getUserId(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
      });
      res.status(200).send({ user });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async editUser(req: Request, res: Response) {
    try {
      await prisma.user.update({
        data: req.body,
        where: { id: +req.params.id },
      });
      res.status(200).send("User has been updated ✅");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async deleteUser(req: Request, res: Response) {
    try {
      await prisma.user.delete({ where: { id: +req.params.id } });
      res.status(200).send("User has been deleted ✅");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}