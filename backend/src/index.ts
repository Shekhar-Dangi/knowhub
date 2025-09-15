import express from "express";
import dotenv from "dotenv";

import filesRouter from "./routes/files.js";
import fileRouter from "./routes/resource.js";

dotenv.config({
  path: process.cwd() + "/.env",
});

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/files", filesRouter);
app.use("/resource", fileRouter);

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
