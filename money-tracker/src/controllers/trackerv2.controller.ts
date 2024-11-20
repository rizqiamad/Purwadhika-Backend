import { Request, Response } from "express";
import pool from "../config/db";
import { ITracker } from "../types/tracker";

export class TrackerV2Controller {
  async getData(req: Request, res: Response) {
    const result = await pool.query("select * from tracker");
    const data: ITracker[] = result.rows

    res.status(200).send({ trackers: data })
  }

  async getDataById(req: Request, res: Response) {
    const result = await pool.query(`select * from tracker where id = ${req.params.id}`)
    res.status(200).send({ tracker: result.rows })
  }
}
