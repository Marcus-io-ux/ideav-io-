import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface IdeaCardProps {
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
}

export const IdeaCard = ({ title, content, tags, createdAt }: IdeaCardProps) => {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{content}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-primary-light text-primary hover:bg-primary hover:text-white">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};