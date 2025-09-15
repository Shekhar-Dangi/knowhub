import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";

export const createFile = async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const existingFile = await prisma.file.findUnique({
    where: { title: title },
  });

  if (existingFile) {
    return res
      .status(409)
      .json({ error: "File with this title already exists" });
  }

  const file = await prisma.file.create({
    data: {
      title,
    },
  });

  if (file) {
    return res.status(201).json({
      message: "File created successfully",
      file,
    });
  } else {
    return res.status(500).json({ error: "File couldn't be created" });
  }
};

export const getFiles = async (req: Request, res: Response) => {
  const files = await prisma.file.findMany();
  return res.json({ files });
};

export const updateFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  if (!id) {
    return res.status(400).json({ error: "File ID is required" });
  }

  const existingFile = await prisma.file.findUnique({
    where: { title: title },
  });

  if (existingFile) {
    return res
      .status(409)
      .json({ error: "File with this title already exists" });
  }

  try {
    const file = await prisma.file.update({
      where: {
        id: id,
      },
      data: {
        title,
      },
    });

    return res.status(200).json({
      message: "File title updated successfully",
      file,
    });
  } catch (error) {
    return res.status(404).json({ error: "File not found" });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "File ID is required" });
  }

  const existingFile = await prisma.file.findUnique({
    where: { id },
  });

  if (!existingFile) {
    return res.status(404).json({ error: "File not found" });
  }

  try {
    await prisma.resource.deleteMany({ where: { fileId: id } });
    const file = await prisma.file.delete({ where: { id } });

    return res
      .status(200)
      .json({ message: "File deleted successfully!", file });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
