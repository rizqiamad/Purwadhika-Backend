import { NextFunction, Request, Response } from "express";
import { Trackers } from "../types/tracker";
import fs from "fs";

export class TrackerMiddleware {
  checkId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const trackers: Trackers = JSON.parse(
      fs.readFileSync("./db/trackers.json", "utf-8")
    );
    const result = trackers.trackers.findIndex((el) => el.id === +id)
    if (result < 0) res.status(400).send({ message: `There is no tracker with id ${id}` });
    else next()
  }
}
