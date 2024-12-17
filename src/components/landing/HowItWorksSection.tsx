import { Brain, Share2, Users } from "lucide-react";

export const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "Save Your Ideas",
              description: "Store your ideas privately and access them anytime, anywhere.",
            },
            {
              icon: Share2,
              title: "Share with the Community",
              description: "Share your ideas with like-minded creators and get valuable feedback.",
            },
            {
              icon: Users,
              title: "Collaborate & Grow",
              description: "Team up with others to develop and bring your best ideas to life.",
            },
          ].map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <step.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              {index < 2 && (
                <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rotate-45 border-t-2 border-r-2 border-gray-200" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};