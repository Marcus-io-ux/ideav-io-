interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
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