import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaperclipIcon } from "lucide-react";
import { QuickReplies } from "../QuickReplies";
import { useToast } from "@/hooks/use-toast";

interface ThreadReplyFormProps {
  onSendReply: (reply: string, file: File | null) => Promise<void>;
  isLoading: boolean;
}

export const ThreadReplyForm = ({ onSendReply, isLoading }: ThreadReplyFormProps) => {
  const [reply, setReply] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setAttachedFile(file);
      toast({
        title: "File attached",
        description: file.name,
      });
    }
  };

  const handleSubmit = async () => {
    if (!reply.trim() && !attachedFile) return;
    await onSendReply(reply, attachedFile);
    setReply("");
    setAttachedFile(null);
  };

  return (
    <div className="mt-4 space-y-4">
      <QuickReplies onSelect={setReply} />

      <div className="space-y-2">
        <div className="space-y-2">
          <label htmlFor="reply" className="text-sm font-medium text-foreground">
            Message
          </label>
          <Textarea
            id="reply"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write your reply here..."
            className="min-h-[100px]"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileAttachment}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <PaperclipIcon className="h-4 w-4 mr-2" />
              {attachedFile ? attachedFile.name : 'Attach files'}
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={(!reply.trim() && !attachedFile) || isLoading}
          >
            Send Reply
          </Button>
        </div>
      </div>
    </div>
  );
};