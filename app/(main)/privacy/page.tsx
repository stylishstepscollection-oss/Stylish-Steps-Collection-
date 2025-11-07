import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Eye, Users, Mail, FileText } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Stylish Style Collection',
  description: 'Learn how Stylish Style Collection collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  const lastUpdated = 'November 7, 2024';

  const sections = [
    {
      icon: FileText,
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect information you provide directly to us, including your name, email address, phone number, shipping address, and payment information when you create an account or make a purchase.',
        },
        {
          subtitle: 'Measurement Data',
          text: 'When you use our AI measurement service, we collect body measurement data. This data is used solely to provide accurate sizing recommendations and is stored securely.',
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect information about how you interact with our platform, including pages viewed, products browsed, and features used.',
        },
      ],
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Service Delivery',
          text: 'We use your information to process orders, provide customer support, and deliver the products and services you request.',
        },
        {
          subtitle: 'Personalization',
          text: 'Your data helps us personalize your shopping experience, recommend products, and show you relevant content.',
        },
        {
          subtitle: 'Communication',
          text: 'We may send you order updates, promotional offers, and important service announcements. You can opt out of marketing communications at any time.',
        },
        {
          subtitle: 'Improvement',
          text: 'We analyze usage patterns to improve our platform, develop new features, and enhance user experience.',
        },
      ],
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        {
          subtitle: 'Protection Measures',
          text: 'We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.',
        },
        {
          subtitle: 'Secure Transactions',
          text: 'All payment information is encrypted and processed through secure channels. We do not store complete payment card details on our servers.',
        },
        {
          subtitle: 'Access Controls',
          text: 'Access to personal data is restricted to authorized personnel who need it to perform their job functions.',
        },
      ],
    },
    {
      icon: Users,
      title: 'Sharing Your Information',
      content: [
        {
          subtitle: 'Service Providers',
          text: 'We may share your information with trusted third-party service providers who help us operate our business, such as payment processors and shipping companies.',
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required by law or in response to valid legal requests from authorities.',
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.',
        },
        {
          subtitle: 'No Selling',
          text: 'We do not sell, rent, or trade your personal information to third parties for their marketing purposes.',
        },
      ],
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: [
        {
          subtitle: 'Access and Correction',
          text: 'You have the right to access, update, or correct your personal information at any time through your account settings.',
        },
        {
          subtitle: 'Data Deletion',
          text: 'You can request deletion of your account and associated data. Some information may be retained for legal or legitimate business purposes.',
        },
        {
          subtitle: 'Opt-Out',
          text: 'You can opt out of marketing communications by clicking the unsubscribe link in our emails or adjusting your account preferences.',
        },
        {
          subtitle: 'Data Portability',
          text: 'You can request a copy of your personal data in a structured, commonly used format.',
        },
      ],
    },
    {
      icon: Mail,
      title: 'Cookies and Tracking',
      content: [
        {
          subtitle: 'What We Use',
          text: 'We use cookies and similar tracking technologies to remember your preferences, analyze site traffic, and improve functionality.',
        },
        {
          subtitle: 'Your Control',
          text: 'You can control cookie preferences through your browser settings. Note that disabling cookies may limit some features of our platform.',
        },
        {
          subtitle: 'Third-Party Cookies',
          text: 'We may use third-party analytics services that place cookies on your device to help us understand user behavior.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 text-gray-900 dark:text-white" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground mb-2">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
                At Stylish Style Collection, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy describes how we collect, use, share, and protect information when you use our website, mobile application, 
                and services.
              </p>
              <p>
                By using our platform, you agree to the collection and use of information in accordance with this policy. 
                If you do not agree with our policies and practices, please do not use our services.
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

                  <div className="space-y-6 pl-0 md:pl-15">
                    {section.content.map((item, idx) => (
                      <div key={idx}>
                        <h3 className="font-semibold text-lg mb-2">{item.subtitle}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>

                  {index < sections.length - 1 && <Separator className="mt-12" />}
                </div>
              );
            })}

            {/* Children's Privacy */}
            <div>
              <Separator className="mb-12" />
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Children's Privacy</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our services are not intended for children under 18 years of age. We do not knowingly collect 
                  personal information from children. If you are a parent or guardian and believe your child has 
                  provided us with personal information, please contact us immediately.
                </p>
              </div>
            </div>

            {/* International Users */}
            <div>
              <Separator className="mb-12" />
              <h2 className="text-2xl md:text-3xl font-bold mb-6">International Users</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our services are operated from Ghana. If you are accessing our platform from outside Ghana, 
                  please be aware that your information may be transferred to, stored, and processed in Ghana 
                  where our servers are located and our central database is operated.
                </p>
              </div>
            </div>

            {/* Changes to Privacy Policy */}
            <div>
              <Separator className="mb-12" />
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Changes to This Policy</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for 
                  other operational, legal, or regulatory reasons. We will notify you of any material changes by 
                  posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                <p>
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect 
                  your information.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <Card className="bg-linear-to-br from-primary/5 to-accent-gold/5 border-accent-gold/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-muted-foreground mb-6">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-accent-gold" />
                    <span>stylishstepscollection@gmail.com</span>
                  </div>
               
                </div>
                <div className="mt-6">
                  <Link href="/contact">
                    <span className="text-accent-gold hover:underline">
                      Or visit our Contact Page →
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}