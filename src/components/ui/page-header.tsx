import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("text-center space-y-4", className)}>
      <h1 className="text-4xl font-bold text-primary">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground text-lg">
          {description}
        </p>
      )}
    </div>
  );
}