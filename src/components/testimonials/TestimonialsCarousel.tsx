import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
  {
    content: "IdeaVault helped me organize and develop my startup concepts effectively.",
    author: "Sarah Chen",
    role: "Entrepreneur",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    content: "The community feedback has been invaluable for refining my ideas.",
    author: "Michael Rodriguez",
    role: "Product Designer",
    avatar: "https://i.pravatar.cc/150?u=michael",
  },
  {
    content: "I've found amazing collaborators here who helped bring my vision to life.",
    author: "Emma Thompson",
    role: "Creative Director",
    avatar: "https://i.pravatar.cc/150?u=emma",
  },
  {
    content: "This platform transformed how I approach innovation and ideation.",
    author: "David Kim",
    role: "Tech Innovator",
    avatar: "https://i.pravatar.cc/150?u=david",
  },
  {
    content: "The supportive community here has been crucial to my success.",
    author: "Lisa Wang",
    role: "Startup Founder",
    avatar: "https://i.pravatar.cc/150?u=lisa",
  },
];

export const TestimonialsCarousel = () => {
  const [api] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      skipSnaps: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  return (
    <section className="py-16 bg-gradient-to-br from-accent/30 to-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What People Say</h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
          ref={api}
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="h-full p-6">
                  <div className="bg-background rounded-xl shadow-md p-6 h-full flex flex-col">
                    <p className="text-gray-600 mb-4 flex-grow">"{testimonial.content}"</p>
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
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};