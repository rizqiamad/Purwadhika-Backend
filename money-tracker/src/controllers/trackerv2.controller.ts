import { Request, Response } from "express";
import pool from "../config/db";
import { ITracker } from "../types/tracker";

export class TrackerV2Controller {
  async getData(req: Request, res: Response) {
    const { category } = req.query
    let query = "select * from tracker"
    if (category) query += ` where category = '${category}'`
    query += ' order by id asc'
    const result = await pool.query(query);
    const data: ITracker[] = result.rows;

    res.status(200).send({ trackers: data });
  }

  async getDataById(req: Request, res: Response) {
    const result = await pool.query(
      `select * from tracker where id = ${req.params.id}`
    );
    res.status(200).send({ tracker: result.rows[0] });
  }

  async addData(req: Request, res: Response) {
    const { title, nominal, type, category, date } = req.body;
    await pool.query(
      `insert into tracker (title, nominal, "type", category, "date")
      values('${title}', ${nominal}, '${type}', '${category}', '${date}')`
    );
    res.status(201).send("Your data has been added");
  }

  async editData(req: Request, res: Response) {
    const query = [];
    for (const key in req.body) {
      query.push(` ${key} = '${req.body[key]}'`);
    }
    await pool.query(
      `update tracker set${query.join(",")} where id = ${req.params.id}`
    );

    res.status(201).send("Your data has been updated");
  }

  async deleteData(req: Request, res: Response){
    await pool.query(`delete from tracker where id = ${req.params.id}`)
    res.status(200).send('Your data has been deleted')
  }

  async getByCategory(){

  }
}
