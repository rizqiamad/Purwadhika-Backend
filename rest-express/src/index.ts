import express, { Request, Response, Application } from "express";
import { UserRouter } from "./routers/user.router";
import cors from "cors";

const PORT: number = 8000

const app: Application = express()
app.use(express.json())
app.use(cors())

const userRouter = new UserRouter()

app.use('/api/users', userRouter.getRouter())
app.get('/api', (req: Request, res: Response) => {
  res.status(200).send({
    hello: 'world'  
  })
})

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`))