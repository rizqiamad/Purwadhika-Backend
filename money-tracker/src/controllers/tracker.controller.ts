import { Request, Response } from "express";
import fs from "fs";
import { ITracker, Trackers } from "../types/tracker";
import { categoryFilter, dateRangeFilter, totalMoney } from "../libs/trackers";

export class TrackerController {
  getlists(req: Request, res: Response) {
    const { category, type, dateMin, dateMax } = req.query;
    const trackers: Trackers = JSON.parse(
      fs.readFileSync("./db/trackers.json", "utf-8")
    );
    if (category && type) {
      const trackersFiltered = categoryFilter(
        trackers,
        category as string,
        type as string
      );
      const totalAmountOfMoney = totalMoney(trackersFiltered);
      res.status(200).send({ totalAmountOfMoney });
      return;
    } else if (dateMin && dateMax && type) {
      const trackersFiltered = dateRangeFilter(
        trackers,
        new Date(dateMin as string),
        new Date(dateMax as string),
        type as string
      );
      const totalAmountOfMoney = totalMoney(trackersFiltered);
      res.status(200).send({ totalAmountOfMoney });
      return;
    } else {
      res.status(200).send(trackers);
    }
  }
  getDetail(req: Request, res: Response) {
    const { id } = req.params;
    const trackers: Trackers = JSON.parse(
      fs.readFileSync("./db/trackers.json", "utf-8")
    );
    const trackerIndex = trackers.trackers.findIndex((el) => el.id === +id);
    res.status(200).send({ tracker: trackers.trackers[trackerIndex] });
  }
  addList(req: Request, res: Response) {
    const trackers: Trackers = JSON.parse(
      fs.readFileSync("./db/trackers.json", "utf-8")
    );
    const newId =
      Math.max(...trackers.trackers.map((item) => item.id)) + 1 || 1;
    const newTrackers = {
      trackers: [...trackers.trackers, { id: newId, ...req.body }],
    };
    fs.writeFileSync(
      "./db/trackers.json",
      JSON.stringify(newTrackers),
      "utf-8"
    );
    res.status(200).json(`Lists have been updated`);
  }
  editList(req: Request, res: Response) {
    const { id } = req.params;
    const trackers: Trackers = JSON.parse(
      fs.readFileSync("./db/trackers.json", "utf-8")
    );
    const trackerIndex = trackers.trackers.findIndex((el) => el.id === +id);
    for (const key in req.body) {
      trackers.trackers[trackerIndex][key as keyof ITracker] = req.body[key];
    }
    fs.writeFileSync("./db/trackers.json", JSON.stringify(trackers), "utf-8");
    res.status(200).send({ tracker: trackers.trackers[trackerIndex] });
  }
  deleteList(req: Request, res: Response) {
    const { id } = req.params;
    const trackers: Trackers = JSON.parse(
      fs.readFileSync("./db/trackers.json", "utf-8")
    );
    const trackerIndex = trackers.trackers.findIndex((el) => el.id === +id);
    trackers.trackers.splice(trackerIndex, 1);
    fs.writeFileSync("./db/trackers.json", JSON.stringify(trackers), "utf-8");
    res.status(200).send(`Your list has been deleted`);
  }
}
