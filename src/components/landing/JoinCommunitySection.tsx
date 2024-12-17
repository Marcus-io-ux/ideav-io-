import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, MessageCircle, Handshake, Lightbulb } from "lucide-react";

export const JoinCommunitySection = () => {
  return (
    <section className="py-24 animate-gradient-slow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Be Part of Something Bigger
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Share your ideas, get feedback, and collaborate with a network of creators ready to inspire and grow with you.
          </p>
        </div>

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
              className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-[#1EAEDB] rounded-full flex items-center justify-center mb-4 mx-auto">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1EAEDB]">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <div className="flex justify-center gap-12 mb-8">
            <div>
              <p className="text-3xl font-bold text-white">5,000+</p>
              <p className="text-white/90">Active Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">10,000+</p>
              <p className="text-white/90">Ideas Shared</p>
            </div>
          </div>
          <blockquote className="max-w-2xl mx-auto text-white/90 italic">
            "This community has helped me refine and launch my startup idea!"
            <footer className="text-white/80 not-italic mt-2">– Sarah, Founder</footer>
          </blockquote>
        </div>

        <div className="text-center">
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-white hover:bg-blue-50 text-[#1EAEDB] px-8 py-6 text-lg rounded-full 
                       shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Join the Community
            </Button>
          </Link>
          <p className="mt-4 text-white/90">It's free to join. Start sharing your ideas today!</p>
        </div>
      </div>
    </section>
  );
};
