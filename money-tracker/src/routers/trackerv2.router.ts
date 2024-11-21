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
    this.router.post('/', this.trackerV2Controller.addData)

    this.router.get('/:id', this.trackerV2Controller.getDataById)
    this.router.patch('/:id', this.trackerV2Controller.editData)
    this.router.delete('/:id', this.trackerV2Controller.deleteData)
  }

  getRouter(): Router {
    return this.router
  }
}
