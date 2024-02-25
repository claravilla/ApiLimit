import { Request, Response, Router } from "express";

export const homeRoute = Router();
export const articlesRoute = Router();
export const contactsRoute = Router();
export const eventsRoute = Router();

homeRoute.get("/", (req: Request, res: Response) => {
  res.send(
    "Mr and Mrs Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much."
  );
});

articlesRoute.get("/", (req: Request, res: Response) => {
  res.send(
    "Japanese has no grammatical gender, number, or articles; though the demonstrative sono (その, 'that, those'), is often translatable as 'the'."
  );
});

contactsRoute.get("/", (req: Request, res: Response) => {
  res.send("Help me, Obi-Wan Kenobi. You're My Only Hope");
});

eventsRoute.get("/", (req: Request, res: Response) => {
  res.send(
    "Mar 20: March Equinox. It is the first day of spring in the Northern Hemisphere and the start of fall in the Southern Hemisphere, by astronomical definitions."
  );
});
