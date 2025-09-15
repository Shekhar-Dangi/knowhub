import { useContext } from "react";
import { FilesContext } from "./FilesContext";
import type { FilesContextType } from "./types";

export const useFiles = (): FilesContextType => {
  const context = useContext(FilesContext);

  if (!context) {
    throw new Error("useFiles must be used within a FilesProvider");
  }

  return context;
};
