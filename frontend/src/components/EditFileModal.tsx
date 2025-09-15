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

interface EditFileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateFile: (title: string) => Promise<boolean>;
  currentTitle: string;
}

export const EditFileModal: React.FC<EditFileModalProps> = ({
  open,
  onOpenChange,
  onUpdateFile,
  currentTitle,
}) => {
  const [title, setTitle] = useState(currentTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  React.useEffect(() => {
    setTitle(currentTitle);
    setValidationError(null);
  }, [currentTitle, open]);

  const handleClose = () => {
    setTitle(currentTitle);
    setValidationError(null);
    setIsSubmitting(false);
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
    if (trimmed === currentTitle) {
      return "Please enter a different title";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationError(null);

    // Validate title
    const validationErr = validateTitle(title);
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onUpdateFile(title.trim());

      if (success) {
        handleClose();
      }
    } catch (error) {
      console.error("Failed to update file:", error);
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit File Name</DialogTitle>
          <DialogDescription>
            Change the title of your file. This will help you better organize
            your resources.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              File Title
            </label>
            <Input
              id="title"
              placeholder="Enter new file title..."
              value={title}
              onChange={handleTitleChange}
              disabled={isSubmitting}
              className={validationError ? "border-destructive" : ""}
              autoFocus
            />
            {validationError && (
              <p className="text-sm text-destructive font-medium">
                {validationError}
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
            <Button
              type="submit"
              disabled={
                isSubmitting || !title.trim() || title.trim() === currentTitle
              }
            >
              {isSubmitting ? "Updating..." : "Update File"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
