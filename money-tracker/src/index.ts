import express, { Request, Response, Application } from "express";
import { TrackerRouter } from "./routers/tracker.router";
import cors from "cors";
import "dotenv/config";
import pool from "./config/db";
import { TrackerV2Router } from "./routers/trackerv2.router";

const PORT = 8000;
const app: Application = express();
app.use(express.json());
app.use(cors());

const trackerRouter = new TrackerRouter();
const trackerV2Router = new TrackerV2Router();

app.use("/api/trackers", trackerRouter.getRouter());
app.use("/api/v2/trackers", trackerV2Router.getRouter());
app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Success to request api");
});

pool.connect((err, client, release) => {
  if (err) {
    return console.log("Error acquiring client", err.stack);
  }
  if (client) {
    client.query("set search_path to test", (queryErr) => {
      if (queryErr) {
        console.log("Error setting search path", queryErr.stack);
      } else {
        console.log('Success connecting to "test"✅');
      }
      release();
    });
  }
});
app.listen(PORT, () => console.log(`Server is running --> http://localhost:${PORT}`));
