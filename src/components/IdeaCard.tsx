import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Star, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
}

interface IdeaCardProps {
  title: string;
  content: string;
  createdAt: Date;
  isFavorite?: boolean;
}

export const IdeaCard = ({ title, content, createdAt, isFavorite: initialFavorite = false }: IdeaCardProps) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [showMessages, setShowMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Idea removed from your favorites" : "Idea added to your favorites",
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      author: "You", // In a real app, this would come from auth
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    
    toast({
      title: "Message sent",
      description: "Your message has been added to the conversation",
    });
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <button
            onClick={toggleFavorite}
            className={cn(
              "p-1 rounded-full transition-colors",
              isFavorite ? "text-primary hover:bg-primary-light" : "text-gray-400 hover:bg-gray-100"
            )}
          >
            <Star
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite && "fill-primary"
              )}
            />
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{content}</p>
        
        <div className="mt-4">
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <MessageCircle className="h-4 w-4" />
            {messages.length} messages
          </button>

          {showMessages && (
            <div className="mt-4 space-y-4">
              <div className="max-h-48 overflow-y-auto space-y-2">
                {messages.map((message) => (
                  <div key={message.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm">{message.author}</span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{message.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};