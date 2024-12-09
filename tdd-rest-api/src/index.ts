import express, { Application, Request, Response } from "express";
import { UserRouter } from "./routers/user.router";

const PORT: number = 8000;
const app: Application = express();
app.use(express.json());

const userRouter: UserRouter = new UserRouter();

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send(`Your server is running`);
});

app.use("/api/users", userRouter.getRouter());

app.listen(PORT, () =>
  console.log(`Server running on -> http://localhost:${PORT}`)
);

export default app;
