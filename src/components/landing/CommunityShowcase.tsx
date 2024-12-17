import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CommunityShowcase = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Thriving Community</h2>
          <div className="flex justify-center gap-12 mb-12">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">10,000+</p>
              <p className="text-gray-600">Ideas Shared</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">5,000+</p>
              <p className="text-gray-600">Active Creators</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">15,000+</p>
              <p className="text-gray-600">Collaborations</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "Idea Vault helped me connect with amazing creators to refine my startup concept.",
              author: "John Anderson",
              role: "Entrepreneur",
              avatar: "https://i.pravatar.cc/150?u=john",
            },
            {
              quote: "I've found incredible collaborators here who helped bring my ideas to life.",
              author: "Michael Rodriguez",
              role: "Creative Director",
              avatar: "https://i.pravatar.cc/150?u=michael",
            },
            {
              quote: "The platform's collaborative features transformed how I develop projects.",
              author: "Emma Thompson",
              role: "Product Designer",
              avatar: "https://i.pravatar.cc/150?u=emma",
            },
          ].map((testimonial) => (
            <div
              key={testimonial.author}
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                  <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};