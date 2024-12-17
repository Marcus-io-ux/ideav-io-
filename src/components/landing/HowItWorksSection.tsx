import { Brain, Share2, Users } from "lucide-react";

export const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#E5DEFF] to-[#D3E4FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
          How It Works
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Turn your ideas into reality with our simple three-step process
        </p>
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
              className="relative flex flex-col items-center text-center p-8 rounded-xl 
                       bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all 
                       transform hover:-translate-y-1 duration-300 border border-[#9b87f5]/10"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full 
                          bg-gradient-to-br from-[#E5DEFF] to-[#9b87f5]/10 mb-6">
                <step.icon className="w-8 h-8 text-[#7E69AB]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              {index < 2 && (
                <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rotate-45 border-t-2 border-r-2 border-[#9b87f5]/20" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};