import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";

const testimonials = [
  {
    content: "The platform transformed how I organize and develop my startup concepts. The collaborative features are game-changing!",
    author: "James Foster",
    role: "Tech Entrepreneur",
    avatar: "https://i.pravatar.cc/150?u=james",
  },
  {
    content: "The community feedback has been invaluable. I've refined my ideas through insightful discussions and collaborations.",
    author: "Michael Rodriguez",
    role: "Product Designer",
    avatar: "https://i.pravatar.cc/150?u=michael",
  },
  {
    content: "Found amazing collaborators here who helped bring my vision to life. The platform's intuitive design makes sharing ideas effortless.",
    author: "Emma Thompson",
    role: "Creative Director",
    avatar: "https://i.pravatar.cc/150?u=emma",
  },
  {
    content: "This platform revolutionized my approach to innovation. The structured idea management tools are exactly what I needed.",
    author: "David Kim",
    role: "Innovation Lead",
    avatar: "https://i.pravatar.cc/150?u=david",
  },
  {
    content: "The supportive community here has been crucial to my success. I've received valuable insights that shaped my project.",
    author: "Lisa Wang",
    role: "Startup Founder",
    avatar: "https://i.pravatar.cc/150?u=lisa",
  },
  {
    content: "IdeaVault helped me turn my rough concepts into well-structured projects. The feedback system is phenomenal!",
    author: "Alex Rivera",
    role: "Product Manager",
    avatar: "https://i.pravatar.cc/150?u=alex",
  },
  {
    content: "As a creative professional, having a dedicated space for idea development has been transformative.",
    author: "Nina Patel",
    role: "UX Designer",
    avatar: "https://i.pravatar.cc/150?u=nina",
  },
  {
    content: "The collaboration features have connected me with brilliant minds across the globe. Truly revolutionary!",
    author: "Thomas Chen",
    role: "Tech Innovator",
    avatar: "https://i.pravatar.cc/150?u=thomas",
  }
];

export const TestimonialsCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      skipSnaps: false,
      duration: 50,
    },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
      })
    ]
  );

  useEffect(() => {
    if (emblaApi) {
      // Initialize the carousel
      emblaApi.reInit();
    }
  }, [emblaApi]);

  return (
    <section className="py-20 bg-gradient-to-br from-accent/30 to-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          What Our Community Says
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Join thousands of creators who are already transforming their ideas into reality
        </p>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
          ref={emblaRef}
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <div className="h-full p-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 h-full flex flex-col border border-accent hover:border-primary/20 transition-colors">
                    <p className="text-gray-600 mb-6 flex-grow italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                        <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-semibold text-primary">{testimonial.author}</p>
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
