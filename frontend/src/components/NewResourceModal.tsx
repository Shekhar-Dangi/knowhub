import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NewResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddResource: (content: string) => Promise<boolean>;
  fileName: string;
}

export const NewResourceModal: React.FC<NewResourceModalProps> = ({
  open,
  onOpenChange,
  onAddResource,
  fileName,
}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleClose = () => {
    setContent("");
    setValidationError(null);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const validateContent = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Resource content is required";
    }
    if (trimmed.length < 1) {
      return "Resource content must be at least 1 character";
    }
    if (trimmed.length > 5000) {
      return "Resource content must be less than 5000 characters";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationError(null);

    const validationErr = validateContent(content);
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onAddResource(content.trim());

      if (success) {
        handleClose();
      }
    } catch (error) {
      console.error("Failed to create resource:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    if (validationError) {
      setValidationError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
          <DialogDescription>
            Add a new resource to "{fileName}". This could be notes, links, code
            snippets, or any other content.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Resource Content
            </label>
            <textarea
              id="content"
              placeholder="Enter your resource content here..."
              value={content}
              onChange={handleContentChange}
              disabled={isSubmitting}
              className={`min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y ${
                validationError ? "border-destructive" : ""
              }`}
              autoFocus
            />
            {validationError && (
              <p className="text-sm text-destructive font-medium">
                {validationError}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {content.length}/5000 characters
            </p>
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
            <Button type="submit" disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? "Adding..." : "Add Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
