import { Router } from "express";
import { TrackerV2Controller } from "../controllers/trackerv2.controller";

export class TrackerV2Router {
  private router: Router;
  private trackerV2Controller: TrackerV2Controller;

  constructor() {
    this.router = Router()
    this.trackerV2Controller = new TrackerV2Controller()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get('/', this.trackerV2Controller.getData)
    this.router.get('/:id', this.trackerV2Controller.getDataById)
  }

  getRouter(): Router {
    return this.router
  }
}
