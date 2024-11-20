import express, { Request, Response, Application } from "express";
import { TrackerRouter } from "./routers/tracker.router";
import cors from "cors";

const PORT = 8000
const app: Application = express()
app.use(express.json())
app.use(cors())

const trackerRouter = new TrackerRouter()

app.use('/api/trackers', trackerRouter.getRouter())
app.get('/api', (req: Request, res: Response) => {
  res.status(200).send('Success to request api')
})

app.listen(PORT, () => console.log(`Listen in localhost:${PORT}`))