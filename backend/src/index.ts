import express from "express";
import dotenv from "dotenv";

import filesRouter from "./controllers/files.js";
import fileRouter from "./controllers/file.js";

dotenv.config({
  path: process.cwd() + "/.env",
});

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/files", filesRouter);
app.use("/file", fileRouter);

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
