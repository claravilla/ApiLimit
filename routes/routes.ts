import { Request, Response, Router } from "express";

export const homeRoute = Router();
export const articlesRoute = Router();
export const contactsRoute = Router();

homeRoute.get("/", (req: Request, res: Response) => {
  res.send(
    "Mr and Mrs Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much."
  );
});

articlesRoute.get("/", (req: Request, res: Response) => {
  res.send(
    "Japanese has no grammatical gender, number, or articles; though the demonstrative sono (その, 'that, those'), is often translatable as 'the'"
  );
});

contactsRoute.get("/", (req: Request, res: Response) => {
  res.send("Help me, Obi-Wan Kenobi. You're My Only Hope");
});
