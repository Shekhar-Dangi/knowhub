import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";

export const listResources = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  if (!fileId) {
    return res.status(400).json({ error: "File ID is required" });
  }

  try {
    const fileExists = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!fileExists) {
      return res.status(404).json({ error: "File not found" });
    }

    const resources = await prisma.resource.findMany({
      where: {
        fileId: fileId,
      },
      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json({
      message: `Found ${resources.length} resources for file`,
      fileId,
      resources,
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return res.status(500).json({ error: "Failed to fetch resources" });
  }
};

export const createResource = async (req: Request, res: Response) => {
  const { content, fileId } = req.body;

  if (!content || !fileId) {
    return res.status(400).json({ error: "Content and fileId are required" });
  }

  try {
    const fileExists = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!fileExists) {
      return res.status(404).json({ error: "File not found" });
    }

    const resourceCount = await prisma.resource.count({
      where: { fileId: fileId },
    });

    if (resourceCount >= 100) {
      return res.status(400).json({
        error:
          "Resource limit reached. You cannot create more than 100 resources per file.",
      });
    }

    const resource = await prisma.resource.create({
      data: {
        content,
        fileId,
      },
      include: {
        file: true,
      },
    });

    return res.status(201).json({
      message: "Resource created successfully",
      resource,
    });
  } catch (error) {
    console.error("Error creating resource:", error);
    return res.status(500).json({ error: "Resource couldn't be created" });
  }
};
