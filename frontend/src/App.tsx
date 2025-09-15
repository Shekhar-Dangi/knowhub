import { useState } from "react";
import { Button } from "./components/ui/button";
import { FileText, AlertCircle, Edit2, Trash2 } from "lucide-react";
import { useFiles, type File } from "./context";
import { NewFileModal } from "./components/NewFileModal";
import { EditFileModal } from "./components/EditFileModal";
import { FileDetail } from "./components/FileDetail";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { files, loading, error, clearError, updateFile, deleteFile } =
    useFiles();

  const handleFileClick = (file: File) => {
    setSelectedFile(file);
  };

  const handleBackToFiles = () => {
    setSelectedFile(null);
  };

  const handleEditFile = (file: File, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFile(file);
  };

  const handleDeleteFile = async (file: File, e: React.MouseEvent) => {
    e.stopPropagation();

    if (
      confirm(
        `Are you sure you want to delete "${file.title}"? This action cannot be undone.`
      )
    ) {
      await deleteFile(file.id);
    }
  };

  const handleUpdateFile = async (newTitle: string): Promise<boolean> => {
    if (!editingFile) return false;

    const updatedFile = await updateFile(editingFile.id, newTitle);
    return updatedFile !== null;
  };

  if (selectedFile) {
    return <FileDetail file={selectedFile} onBack={handleBackToFiles} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="app-header">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center hover:bg-primary/90 transition-colors">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">KnowHub</h1>
            </div>

            <Button
              className="bg-primary text-primary-foreground duration-200 shadow-md"
              onClick={() => setIsModalOpen(true)}
            >
              New File
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 border border-destructive/20 bg-destructive/10 rounded-lg flex items-start gap-3 max-w-2xl">
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
              ×
            </Button>
          </div>
        )}

        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-2">Files</h2>
          <p className="text-muted-foreground mb-8">
            Organize your knowledge into files and add resources to each one.
          </p>

          {loading && files.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <span>Loading files...</span>
              </div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No files yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first file to get started organizing your resources
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                Create First File
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 hover:shadow-sm group"
                >
                  <div
                    className="flex items-center gap-3 flex-1 min-w-0"
                    onClick={() => handleFileClick(file)}
                  >
                    <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    <span className="text-foreground font-medium group-hover:text-primary transition-colors truncate">
                      {file.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleEditFile(file, e)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                      title="Edit file name"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteFile(file, e)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      title="Delete file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <NewFileModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      {editingFile && (
        <EditFileModal
          open={!!editingFile}
          onOpenChange={(open) => !open && setEditingFile(null)}
          onUpdateFile={handleUpdateFile}
          currentTitle={editingFile.title}
        />
      )}
    </div>
  );
}

export default App;
