import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, MessageCircle, Handshake, Lightbulb } from "lucide-react";

export const JoinCommunitySection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
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
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <benefit.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full 
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