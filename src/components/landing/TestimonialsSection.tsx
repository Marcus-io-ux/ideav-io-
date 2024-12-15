export const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">Trusted by Creators Worldwide</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "This platform has completely transformed how I manage my creative projects.",
              author: "Sarah J.",
              role: "Product Designer",
            },
            {
              quote: "The community feedback has been invaluable for refining my ideas.",
              author: "Michael R.",
              role: "Entrepreneur",
            },
            {
              quote: "Finally, a place where I can organize all my thoughts effectively.",
              author: "Lisa M.",
              role: "Content Creator",
            },
          ].map((testimonial) => (
            <div key={testimonial.author} className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
              <p className="font-semibold">{testimonial.author}</p>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};