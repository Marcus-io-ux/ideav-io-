import { Brain, Users, Tag, Layout } from "lucide-react";

export const KeyFeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Key Features
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Everything you need to manage and grow your ideas
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              className="group bg-white p-8 rounded-xl shadow-lg 
                       hover:shadow-xl transition-all transform hover:-translate-y-1 
                       duration-300"
            >
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};