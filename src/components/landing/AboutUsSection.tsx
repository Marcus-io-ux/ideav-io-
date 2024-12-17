import { Lightbulb, Users, Heart, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const AboutUsSection = () => {
  const coreValues = [
    {
      icon: Lightbulb,
      title: "Creativity",
      description: "Inspire and empower every idea, big or small.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Connect with thinkers, innovators, and dreamers.",
    },
    {
      icon: Heart,
      title: "Simplicity",
      description: "Store, organize, and share ideas effortlessly.",
    },
    {
      icon: Rocket,
      title: "Growth",
      description: "Transform your thoughts into actionable results.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-background to-accent/30">
      <div className="container mx-auto px-4">
        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Where Ideas Begin and Grow
        </h2>

        {/* Mission Statement */}
        <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
          Idea Vault was created to help individuals organize their thoughts, store their ideas securely, 
          and collaborate with a like-minded community to bring those ideas to life.
        </p>

        {/* Core Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {coreValues.map((value) => (
            <div
              key={value.title}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <value.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Origin Story */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-center">Our Story</h3>
          <p className="text-gray-600 text-center">
            Idea Vault was born from the frustration of losing great ideas. We wanted to create 
            a space where thoughts are stored, shared, and refined with the support of a thriving 
            community. Today, we're proud to provide a platform that helps thousands of creators 
            turn their ideas into reality.
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-xl font-medium mb-6">
            Join the Idea Vault community today and start turning your ideas into reality.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary-hover text-white px-8 py-6 text-lg rounded-full 
                     shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Link to="/signup">Get Started for Free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};