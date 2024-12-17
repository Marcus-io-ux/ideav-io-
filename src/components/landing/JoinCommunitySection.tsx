import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, MessageCircle, Handshake, Lightbulb } from "lucide-react";

export const JoinCommunitySection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#E5DEFF] to-[#D3E4FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
            Be Part of Something Bigger
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Share your ideas, get feedback, and collaborate with a network of creators ready to inspire and grow with you.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: MessageCircle,
              title: "Share Your Ideas",
              description: "Post your ideas and get constructive feedback from the community.",
            },
            {
              icon: Users,
              title: "Connect with Creators",
              description: "Meet like-minded people and build meaningful connections.",
            },
            {
              icon: Handshake,
              title: "Collaborate on Projects",
              description: "Team up with others to bring your best ideas to life.",
            },
            {
              icon: Lightbulb,
              title: "Grow and Inspire",
              description: "Learn, innovate, and grow with a supportive community.",
            },
          ].map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-[#9b87f5]/20"
            >
              <div className="w-12 h-12 bg-[#E5DEFF] rounded-full flex items-center justify-center mb-4 mx-auto">
                <benefit.icon className="w-6 h-6 text-[#7E69AB]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="text-center mb-12">
          <div className="flex justify-center gap-12 mb-8">
            <div>
              <p className="text-3xl font-bold text-[#9b87f5]">5,000+</p>
              <p className="text-gray-600">Active Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#9b87f5]">10,000+</p>
              <p className="text-gray-600">Ideas Shared</p>
            </div>
          </div>
          <blockquote className="max-w-2xl mx-auto text-gray-600 italic">
            "This community has helped me refine and launch my startup idea!"
            <footer className="text-gray-500 not-italic mt-2">– Sarah, Founder</footer>
          </blockquote>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-8 py-6 text-lg rounded-full 
                       shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Join the Community
            </Button>
          </Link>
          <p className="mt-4 text-gray-600">It's free to join. Start sharing your ideas today!</p>
        </div>
      </div>
    </section>
  );
};