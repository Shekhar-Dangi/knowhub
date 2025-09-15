import type { Resource } from "./types";
import { env } from "@/config/env";

const API_BASE = env.API_BASE_URL;

export interface ResourcesResponse {
  message: string;
  fileId: string;
  resources: Resource[];
}

export const fetchResources = async (fileId: string): Promise<Resource[]> => {
  try {
    const response = await fetch(`${API_BASE}/resource/${fileId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch resources: ${response.statusText}`);
    }

    const data: ResourcesResponse = await response.json();
    return data.resources || [];
  } catch (error) {
    console.error("Error fetching resources:", error);
    throw error;
  }
};

export const createResource = async (
  content: string,
  fileId: string
): Promise<Resource | null> => {
  try {
    const response = await fetch(`${API_BASE}/resource/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, fileId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create resource");
    }

    const data = await response.json();
    return data.resource;
  } catch (error) {
    console.error("Error creating resource:", error);
    throw error;
  }
};
