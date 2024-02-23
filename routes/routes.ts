import { Request, Response, Router } from "express";

export const homeRoute = Router();
export const articlesRoute = Router();
export const contactsRoute = Router();

homeRoute.get("/", (req: Request, res: Response) => {
  res.send(
    "Knave clipper tackle gally furl galleon avast squiffy yardarm careen"
  );
});

articlesRoute.get("/", (req: Request, res: Response) => {
  res.send(
    "Bowsprit snow port bilge rat mizzenmast gangplank belay lass rutters tackle. Landlubber or just lubber cog lad interloper boatswain holystone sheet barque aft Sail ho"
  );
});

contactsRoute.get("/", (req: Request, res: Response) => {
  res.send(
    "Measured fer yer chains man-of-war sloop mutiny Cat o'nine tails square-rigged strike colors nipperkin Blimey log"
  );
});
