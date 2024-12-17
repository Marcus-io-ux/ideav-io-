import { Lock, MessageSquare, Users, Share } from "lucide-react";

export const KeyFeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Lock,
              title: "Private Vault",
              description: "Save your ideas securely and organize them effortlessly.",
            },
            {
              icon: MessageSquare,
              title: "Community Feedback",
              description: "Get insights, likes, and comments from real people.",
            },
            {
              icon: Users,
              title: "Collaboration Tools",
              description: "Request to collaborate and turn ideas into projects.",
            },
            {
              icon: Share,
              title: "Easy Sharing",
              description: "Share ideas publicly or invite specific people to view them.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};