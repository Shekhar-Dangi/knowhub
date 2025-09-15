import React, { useState } from "react";
import { useFiles, type File } from "@/context";
import { Button } from "@/components/ui/button";
import { NewFileModal } from "@/components/NewFileModal";
import { Plus, FileText, Loader2, AlertCircle } from "lucide-react";

export const FileManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { files, loading, error, deleteFile, selectFile, clearError } =
    useFiles();

  const handleFileClick = (file: File) => {
    selectFile(file);
  };

  const handleDeleteFile = async (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this file?")) {
      await deleteFile(fileId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">File Manager</h1>
          <p className="text-muted-foreground">
            Organize your resources by creating and managing files
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New File
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 border border-destructive/20 bg-destructive/10 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-destructive">Error</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            className="text-destructive hover:text-destructive"
          >
            Dismiss
          </Button>
        </div>
      )}

      {loading && files.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading files...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && files.length === 0 && !error && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No files yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first file to get started organizing your resources
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First File
          </Button>
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => handleFileClick(file)}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate group-hover:text-primary">
                      {file.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ID: {file.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDeleteFile(file.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && files.length > 0 && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex items-center gap-3 bg-background p-4 rounded-lg border shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </div>
        </div>
      )}

      <NewFileModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
