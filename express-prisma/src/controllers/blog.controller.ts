import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "../../prisma/generated/client";

export class BlogController {
  async getBlogs(req: Request, res: Response) {
    try {
      const { limit = 100, neslug = '' } = req.query;
      const filter: Prisma.BlogWhereInput = {}
      if (neslug) {
        filter.NOT = {
          slug: {
            contains: `${neslug}`
          }
        }
      }
      const blogs = await prisma.blog.findMany({
        take: +limit,
        where: filter,
        select: {
          id: true,
          title: true,
          thubmnail: true,
          category: true,
          slug: true,
          createdAt: true,
          user: {
            select: {
              username: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
      res.status(200).send({ blogs });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getBlogSlug(req: Request, res: Response) {
    try {
      const blog = await prisma.blog.findUnique({
        where: { slug: req.params.slug },
        select: {
          id: true,
          title: true,
          category: true,
          thubmnail: true,
          slug: true,
          createdAt: true,
          content: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      });
      res.status(200).send({ blog });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
