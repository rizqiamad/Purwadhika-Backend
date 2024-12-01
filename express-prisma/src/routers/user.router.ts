import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { checkAdmin, verifyToken } from "../middlewares/verify";

export class UserRouter {
  private userController: UserController;
  private router: Router;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", verifyToken, checkAdmin, this.userController.getUsers);
    this.router.post("/", this.userController.createUser);

    this.router.get("/profile", verifyToken, this.userController.getUserId);
    this.router.patch("/:id", this.userController.editUser);
    this.router.delete("/:id", this.userController.deleteUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
