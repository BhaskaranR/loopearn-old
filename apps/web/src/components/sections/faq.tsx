import { Section } from "@/components/section";
import { siteConfig } from "@/lib/config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@loopearn/ui/accordion";

export function FAQ() {
  return (
    <Section
      id="faq"
      title="FAQ"
      subtitle="Frequently Asked Questions"
      className="container px-10"
    >
      <Accordion
        type="single"
        collapsible
        className="w-full max-w-2xl mx-auto py-10"
      >
        {siteConfig.faqs.map((faq, index) => (
          <AccordionItem
            key={`item-${index.toString()}`}
            value={`item-${index.toString()}`}
          >
            <AccordionTrigger className="text-left hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
