import express from "express";
import type { Request, Response } from "express";

const router = express.Router();

router.get("/:id", (req: Request, res: Response) => {
  res.send(req.params.id);
});

export default router;
