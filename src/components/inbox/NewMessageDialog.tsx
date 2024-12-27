import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PaperclipIcon, SmileIcon, AtSign, X } from "lucide-react";

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (recipient: string, content: string) => void;
}

export const NewMessageDialog = ({ open, onOpenChange, onSend }: NewMessageDialogProps) => {
  const [recipient, setRecipient] = useState("");
  const [content, setContent] = useState("");

  const handleSend = () => {
    onSend(recipient, content);
    setRecipient("");
    setContent("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Start a New Conversation</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Search for a user by name or username"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Write your message here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Button variant="ghost" size="sm">
                <PaperclipIcon className="h-4 w-4 mr-2" />
                Attach
              </Button>
              <Button variant="ghost" size="sm">
                <SmileIcon className="h-4 w-4 mr-2" />
                Emoji
              </Button>
              <Button variant="ghost" size="sm">
                <AtSign className="h-4 w-4 mr-2" />
                Mention
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!recipient.trim() || !content.trim()}>
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};