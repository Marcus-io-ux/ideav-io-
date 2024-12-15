import { useQuery } from "@tanstack/react-query";
import { fetchFeatures } from "@/lib/api";
import { Feature } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2 } from "lucide-react";

const Features = () => {
  const { data: features, isLoading } = useQuery<Feature[]>({
    queryKey: ['features'],
    queryFn: fetchFeatures,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Our Features</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features?.map((feature) => (
          <Card key={feature.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <Brain className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Features;