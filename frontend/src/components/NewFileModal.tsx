import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFiles } from "@/context";

interface NewFileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewFileModal: React.FC<NewFileModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { createFile, error: contextError, clearError } = useFiles();

  const handleClose = () => {
    setTitle("");
    setValidationError(null);
    setIsSubmitting(false);
    clearError();
    onOpenChange(false);
  };

  const validateTitle = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "File title is required";
    }
    if (trimmed.length < 1) {
      return "File title must be at least 1 character";
    }
    if (trimmed.length > 100) {
      return "File title must be less than 100 characters";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationError(null);
    clearError();

    const validationErr = validateTitle(title);
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    setIsSubmitting(true);

    try {
      const newFile = await createFile(title.trim());

      if (newFile) {
        handleClose();
      }
    } catch (error) {
      console.error("Failed to create file:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);

    if (validationError) {
      setValidationError(null);
    }

    if (contextError) {
      clearError();
    }
  };

  const displayError = validationError || contextError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
          <DialogDescription>
            Enter a title for your new file. This will help you organize your
            resources.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              File Title
            </label>
            <Input
              id="title"
              placeholder="Enter file title..."
              value={title}
              onChange={handleTitleChange}
              disabled={isSubmitting}
              className={displayError ? "border-destructive" : ""}
              autoFocus
            />
            {displayError && (
              <p className="text-sm text-destructive font-medium">
                {displayError}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim()}>
              {isSubmitting ? "Creating..." : "Create File"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
