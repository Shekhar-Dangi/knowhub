import express from "express";
import dotenv from "dotenv";

import filesRouter from "./routes/files.js";
import resourceRouter from "./routes/resource.js";

dotenv.config({
  path: process.cwd() + "/.env",
});

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/files", filesRouter);
app.use("/resource", resourceRouter);

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
