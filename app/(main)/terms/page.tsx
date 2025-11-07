import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, ShoppingBag, CreditCard, Ban, AlertCircle, Scale } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Stylish Style Collection',
  description: 'Read our terms and conditions for using Stylish Style Collection services.',
};

export default function TermsPage() {
  const lastUpdated = 'November 7, 2024';

  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using Stylish Style Collection ("Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
        'We reserve the right to update these terms at any time. Continued use of the Service after changes constitutes acceptance of the modified terms.',
      ],
    },
    {
      icon: ShoppingBag,
      title: 'Use of Service',
      items: [
        {
          subtitle: 'Account Registration',
          text: 'You must create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.',
        },
        {
          subtitle: 'Eligibility',
          text: 'You must be at least 18 years old to use our services. By using our Service, you represent that you meet this age requirement.',
        },
        {
          subtitle: 'Prohibited Activities',
          text: 'You agree not to misuse our Service, including but not limited to: uploading malicious content, attempting unauthorized access, infringing intellectual property rights, or engaging in fraudulent activities.',
        },
      ],
    },
    {
      icon: CreditCard,
      title: 'Orders and Payments',
      items: [
        {
          subtitle: 'Order Process',
          text: 'When you place an order, you are making an offer to purchase products. We reserve the right to accept or decline any order for any reason.',
        },
        {
          subtitle: 'Pricing',
          text: 'All prices are in USD and subject to change without notice. We strive to display accurate pricing but errors may occur. We reserve the right to cancel orders placed at incorrect prices.',
        },
        {
          subtitle: 'Payment',
          text: 'Payment is required at the time of order. We accept various payment methods as displayed during checkout. You agree to provide current, complete, and accurate payment information.',
        },
      ],
    },
    {
      icon: Ban,
      title: 'Cancellations and Returns',
      items: [
        {
          subtitle: 'Order Cancellation',
          text: 'You may cancel your order within 24 hours of placement by contacting our support team. Orders that have been shipped cannot be cancelled.',
        },
        {
          subtitle: 'Returns Policy',
          text: 'We accept returns within 14 days of delivery for unused items in original condition. Custom and personalized items are non-returnable.',
        },
        {
          subtitle: 'Refunds',
          text: 'Approved returns will be refunded to the original payment method within 7-10 business days after we receive the returned item.',
        },
      ],
    },
    {
      icon: AlertCircle,
      title: 'Intellectual Property',
      content: [
        'All content on our Service, including text, images, logos, designs, and software, is owned by or licensed to Stylish Style Collection and protected by copyright and trademark laws.',
        'You may not reproduce, distribute, modify, or create derivative works from our content without explicit written permission.',
        'Product images and descriptions are provided for informational purposes. Actual products may vary slightly from images.',
      ],
    },
    {
      icon: Scale,
      title: 'Limitation of Liability',
      content: [
        'To the maximum extent permitted by law, Stylish Style Collection shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our Service.',
        'We do not guarantee that our Service will be uninterrupted, secure, or error-free. We are not responsible for any damage to your device or loss of data.',
        'Our total liability for any claims arising from your use of the Service shall not exceed the amount you paid for products or services in the six months preceding the claim.',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Scale className="h-16 w-16 mx-auto mb-6 text-gray-900 dark:text-white" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground mb-2">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Introduction */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg">
                Welcome to Stylish Style Collection. These Terms of Service govern your use of our website, 
                mobile application, and related services. By using our Service, you agree to comply with and 
                be bound by these terms.
              </p>
            </div>

            <Separator />

            {/* Sections */}
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center">
                      <Icon className="h-6 w-6 text-gray-900 dark:text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">{section.title}</h2>
                  </div>

                  {section.content && (
                    <div className="space-y-4 pl-0 md:pl-15">
                      {section.content.map((paragraph, idx) => (
                        <p key={idx} className="text-muted-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                  {section.items && (
                    <div className="space-y-6 pl-0 md:pl-15">
                      {section.items.map((item, idx) => (
                        <div key={idx}>
                          <h3 className="font-semibold text-lg mb-2">{item.subtitle}</h3>
                          <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {index < sections.length - 1 && <Separator className="mt-12" />}
                </div>
              );
            })}

            {/* Additional Sections */}
            <div>
              <Separator className="mb-12" />
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Governing Law</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of Ghana, 
                  without regard to its conflict of law provisions.
                </p>
                <p>
                  Any disputes arising from these terms or your use of our Service shall be resolved in 
                  the courts of Ghana.
                </p>
              </div>
            </div>

            <div>
              <Separator className="mb-12" />
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Contact Information</h2>
              <Card className="bg-linear-to-br from-primary/5 to-accent-gold/5 border-accent-gold/20">
                <CardContent className="p-8">
                  <p className="text-muted-foreground mb-6">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="space-y-3">
                    <span>stylishstepscollection@gmail.com</span>
                  </div>
                  <div className="mt-6">
                    <Link href="/contact">
                      <span className="text-accent-gold hover:underline">
                        Visit our Contact Page →
                      </span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}