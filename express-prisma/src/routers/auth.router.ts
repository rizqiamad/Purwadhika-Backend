import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export class AuthRouter {
  private authController: AuthController;
  private router: Router;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/register", this.authController.registerUser);
    this.router.post("/login", this.authController.loginUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
