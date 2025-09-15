import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Plus, Loader2, AlertCircle } from "lucide-react";
import {
  fetchResources,
  createResource,
  type Resource,
  type File,
} from "@/context";
import { NewResourceModal } from "./NewResourceModal";

interface FileDetailProps {
  file: File;
  onBack: () => void;
}

export const FileDetail: React.FC<FileDetailProps> = ({ file, onBack }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingResource, setIsAddingResource] = useState(false);

  const loadResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedResources = await fetchResources(file.id);
      setResources(fetchedResources);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resources");
    } finally {
      setLoading(false);
    }
  }, [file.id]);

  const handleAddResource = async (content: string): Promise<boolean> => {
    try {
      setError(null);
      const newResource = await createResource(content, file.id);
      if (newResource) {
        setResources((prev) => [...prev, newResource]);
        return true;
      }
      return false;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create resource"
      );
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Files
              </Button>
            </div>

            <Button
              onClick={() => setIsAddingResource(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Resource
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 border border-destructive/20 bg-destructive/10 rounded-lg flex items-start gap-3">
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading resources...</span>
            </div>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No resources yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first resource to this file to get started
            </p>
            <Button onClick={() => setIsAddingResource(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Resource
            </Button>
          </div>
        ) : (
          <div className="max-w-4xl">
            <div className="grid gap-4">
              {resources.map((resource) => (
                <div key={resource.id}>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {resource.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <NewResourceModal
        open={isAddingResource}
        onOpenChange={setIsAddingResource}
        onAddResource={handleAddResource}
        fileName={file.title}
        currentResourceCount={resources.length}
      />
    </div>
  );
};
