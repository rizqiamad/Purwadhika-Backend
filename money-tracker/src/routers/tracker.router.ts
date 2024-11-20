import { Router } from "express";
import { TrackerController } from "../controllers/tracker.controller";
import { TrackerMiddleware } from "../middlewares/tracker.middleware";

export class TrackerRouter {
  private router: Router
  private trackerController: TrackerController
  private trackerMiddleware: TrackerMiddleware

  constructor () {
    this.router = Router()
    this.trackerController = new TrackerController()
    this.trackerMiddleware = new TrackerMiddleware()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get('/', this.trackerController.getlists)
    this.router.post('/', this.trackerController.addList)
    this.router.get('/:id', this.trackerMiddleware.checkId ,this.trackerController.getDetail)
    this.router.patch('/:id', this.trackerMiddleware.checkId ,this.trackerController.editList)
    this.router.delete('/:id', this.trackerMiddleware.checkId ,this.trackerController.deleteList)
  }

  getRouter(): Router {
    return this.router
  }
}