import { Brain, Users, Tag, Layout } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: Brain,
              title: "Idea Vault",
              description: "Securely store and organize all your creative ideas in one place.",
            },
            {
              icon: Users,
              title: "Community Collaboration",
              description: "Connect with like-minded creators and get valuable feedback.",
            },
            {
              icon: Tag,
              title: "Smart Organization",
              description: "Tag and categorize your ideas for easy access and management.",
            },
            {
              icon: Layout,
              title: "Personal Dashboard",
              description: "Track your progress and manage your ideas efficiently.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};