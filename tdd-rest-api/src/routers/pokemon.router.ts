import { Request, Response, Router } from "express";
import axios from "axios";

export class PokemonRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.iniliatizeRoutes();
  }

  private iniliatizeRoutes() {
    this.router.get("/", async (req: Request, res: Response) => {
      try {
        const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon");
        res.status(200).send(data.results);
      } catch (err) {
        console.log(err);
        res.status(400).send(err);
      }
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
