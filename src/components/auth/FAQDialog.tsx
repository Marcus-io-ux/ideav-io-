import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          FAQ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">Frequently Asked Questions</DialogTitle>
        </DialogHeader>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How secure are my ideas?</AccordionTrigger>
            <AccordionContent>
              Your ideas are encrypted and stored securely. Only you can access your private ideas, and we use industry-standard security measures to protect your data.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I collaborate with others?</AccordionTrigger>
            <AccordionContent>
              Yes! You can choose to share specific ideas with collaborators while keeping others private. Our platform makes it easy to work together on shared projects.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is there a free plan available?</AccordionTrigger>
            <AccordionContent>
              Yes, we offer a free plan that includes all essential features. Premium plans are available for users who need advanced collaboration tools and increased storage.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>How can I organize my ideas?</AccordionTrigger>
            <AccordionContent>
              You can use tags, folders, and our powerful search feature to organize and find your ideas quickly. We also provide customizable categories and filters.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
};