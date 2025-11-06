import { Card, CardContent } from '@/components/ui/card';
import ContactOptions from '@/components/contact/ContactOptions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function HelpPage() {
  const faqs = [
    {
      question: 'How do I track my order?',
      answer:
        'You can track your order by going to the "My Orders" page in your profile. All order updates will be visible there.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept various payment methods. Please contact us directly through WhatsApp, Snapchat, or Instagram to discuss payment options.',
    },
    {
      question: 'How accurate is the AI measurement feature?',
      answer:
        'Our AI measurement feature provides estimates based on your photos. For the most accurate results, we recommend verifying and entering manual measurements after capturing your photos.',
    },
    {
      question: 'Can I return or exchange items?',
      answer:
        'Yes, we have a return and exchange policy. Please contact our support team through any of our social media channels to initiate a return or exchange.',
    },
    {
      question: 'How long does shipping take?',
      answer:
        'Shipping times vary depending on your location. Contact us directly to get an estimated delivery time for your area.',
    },
    {
      question: 'Do you offer custom tailoring?',
      answer:
        'Yes! We offer customization services including name tags and custom designs. Check out our Customization category or contact us for more details.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to common questions or get in touch with us
        </p>
      </div>

      {/* Contact Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <ContactOptions />
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Card>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">📦</div>
            <h3 className="font-semibold mb-1">Order Status</h3>
            <p className="text-sm text-muted-foreground">
              Check your order history
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">📏</div>
            <h3 className="font-semibold mb-1">Measurement Guide</h3>
            <p className="text-sm text-muted-foreground">
              Learn how to measure correctly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">💬</div>
            <h3 className="font-semibold mb-1">Live Support</h3>
            <p className="text-sm text-muted-foreground">
              Chat with us directly
            </p>
          </CardContent>
                  </Card>
      </div>
    </div>
  );
}