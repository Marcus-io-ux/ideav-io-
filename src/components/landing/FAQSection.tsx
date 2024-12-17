import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "How secure are my ideas?",
      answer: "Your ideas are encrypted and stored securely. Only you can access your private ideas, and we use industry-standard security measures to protect your data."
    },
    {
      question: "Can I collaborate with others?",
      answer: "Yes! You can choose to share specific ideas with collaborators while keeping others private. Our platform makes it easy to work together on shared projects."
    },
    {
      question: "Is there a free plan available?",
      answer: "Yes, we offer a free plan that includes all essential features. Premium plans are available for users who need advanced collaboration tools and increased storage."
    },
    {
      question: "How can I organize my ideas?",
      answer: "You can use tags, folders, and our powerful search feature to organize and find your ideas quickly. We also provide customizable categories and filters."
    },
    {
      question: "What makes IdeaVault different?",
      answer: "IdeaVault combines secure idea storage with powerful collaboration tools and a supportive community. Our platform is designed specifically for creators and innovators."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#D3E4FD] to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Find answers to common questions about IdeaVault
        </p>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-[#9b87f5]/20">
                <AccordionTrigger className="text-left hover:text-[#7E69AB]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};