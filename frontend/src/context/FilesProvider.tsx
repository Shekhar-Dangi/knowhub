import React, { useState, useEffect } from "react";
import { FilesContext } from "./FilesContext";
import type { File, FilesContextType } from "./types";
import { env } from "@/config/env";

const API_BASE = env.API_BASE_URL;

interface FilesProviderProps {
  children: React.ReactNode;
}

export const FilesProvider: React.FC<FilesProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/files`);
      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.statusText}`);
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const createFile = async (title: string): Promise<File | null> => {
    try {
      setLoading(true);
      setError(null);

      // Client-side validation: Check if we're at the file limit
      if (files.length >= 100) {
        throw new Error("Maximum file limit reached (100 files). Please delete some files before creating new ones.");
      }

      const response = await fetch(`${API_BASE}/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create file");
      }

      const data = await response.json();
      const newFile = data.file;

      setFiles((prev) => [...prev, newFile]);
      return newFile;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create file");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateFile = async (
    id: string,
    title: string
  ): Promise<File | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/files/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update file");
      }

      const data = await response.json();
      const updatedFile = data.file;

      setFiles((prev) => prev.map((f) => (f.id === id ? updatedFile : f)));
      if (selectedFile?.id === id) {
        setSelectedFile(updatedFile);
      }

      return updatedFile;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update file");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/files/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete file");
      }

      setFiles((prev) => prev.filter((f) => f.id !== id));
      if (selectedFile?.id === id) {
        setSelectedFile(null);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete file");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const selectFile = (file: File | null): void => {
    setSelectedFile(file);
  };

  const clearError = (): void => {
    setError(null);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const contextValue: FilesContextType = {
    files,
    selectedFile,
    loading,
    error,
    fetchFiles,
    createFile,
    updateFile,
    deleteFile,
    selectFile,
    clearError,
  };

  return (
    <FilesContext.Provider value={contextValue}>
      {children}
    </FilesContext.Provider>
  );
};
