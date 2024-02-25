import express from "express";
import "dotenv/config";
import { apiRateLimit } from "./src/middlewares/apiRateLimit";
import { articlesRoute, contactsRoute, homeRoute } from "./src/routes/routes";

const app = express();
const port = process.env.PORT || 3000;

app.use("/home", apiRateLimit, homeRoute);
app.use("/articles", apiRateLimit, articlesRoute);
app.use("/contacts", contactsRoute);

app.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});
