import express from "express";

import {
  createResource,
  listResources,
} from "../controllers/resourceController.js";

const router = express.Router();

router.post("/create", createResource);
router.get("/:fileId", listResources);

export default router;
