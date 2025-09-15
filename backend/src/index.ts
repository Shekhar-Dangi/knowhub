import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import filesRouter from "./routes/files.js";
import resourceRouter from "./routes/resource.js";

dotenv.config({
  path: process.cwd() + "/.env",
});

const app = express();

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      console.log("Allowed origins:", allowedOrigins);
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.use("/files", filesRouter);
app.use("/resource", resourceRouter);

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
  console.log("FRONTEND_URL env var:", process.env.FRONTEND_URL);
  console.log("Environment:", process.env.NODE_ENV || "development");
});
