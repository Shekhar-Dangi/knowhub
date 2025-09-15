import express from "express";
import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import {
  createFile,
  deleteFile,
  getFiles,
  updateFile,
} from "../controllers/filesController.js";

const router = express.Router();

router.get("/", getFiles);
router.post("/", createFile);
router.put("/:id", updateFile);
router.delete("/:id", deleteFile);

export default router;
