export interface File {
  id: string;
  title: string;
}

export interface Resource {
  id: string;
  content: string;
  fileId: string;
  file?: File;
}

export interface FilesContextType {
  files: File[];
  selectedFile: File | null;
  loading: boolean;
  error: string | null;

  fetchFiles: () => Promise<void>;
  createFile: (title: string) => Promise<File | null>;
  updateFile: (id: string, title: string) => Promise<File | null>;
  deleteFile: (id: string) => Promise<boolean>;
  selectFile: (file: File | null) => void;

  clearError: () => void;
}
