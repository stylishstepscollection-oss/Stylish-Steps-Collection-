import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Award, Users, Heart, Sparkles, Target, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Stylish Steps Collection',
  description: 'Learn about Stylish Steps Collection, our story, mission, and commitment to bringing you premium fashion.',
};

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: 'Quality First',
      description: 'We source only the finest materials and partner with skilled artisans to ensure every piece meets our high standards.',
    },
    {
      icon: Users,
      title: 'Customer Focused',
      description: 'Your satisfaction is our priority. We listen, adapt, and continuously improve based on your feedback.',
    },
    {
      icon: Heart,
      title: 'Sustainable Fashion',
      description: 'We believe in fashion that respects both people and the planet, promoting ethical practices throughout our supply chain.',
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'From AI-powered measurements to custom designs, we leverage technology to enhance your shopping experience.',
    },
  ];

  const milestones = [
    { year: '2020', title: 'Founded', description: 'Started with a vision to make premium fashion accessible' },
    { year: '2021', title: 'First Store', description: 'Opened our flagship location in Kumasi' },
    { year: '2022', title: 'AI Integration', description: 'Launched AI-powered measurement technology' },
    { year: '2023', title: 'Custom Line', description: 'Introduced personalized customization services' },
    { year: '2024', title: 'Going Digital', description: 'Expanded to full e-commerce platform' },
  ];

  const team = [
    {
      name: 'Emmanuel Asante',
      role: 'Founder & CEO',
      description: 'Fashion entrepreneur with a passion for making style accessible to everyone.',
    },
    {
      name: 'Akosua Mensah',
      role: 'Head of Design',
      description: 'Creative director with 10+ years experience in fashion design and trend forecasting.',
    },
    {
      name: 'Kwame Boateng',
      role: 'Operations Manager',
      description: 'Ensures smooth operations and exceptional customer service delivery.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About Stylish Steps Collection
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              We're on a mission to revolutionize fashion shopping in Ghana by combining premium quality, 
              innovative technology, and personalized service.
            </p>
            <Button size="lg" asChild>
              <Link href="/products">Shop Our Collection</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
              <Separator className="w-20 mx-auto" />
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed mb-6">
                Stylish Steps Collection was born from a simple observation: finding quality, stylish clothing 
                shouldn't be complicated or expensive. In 2020, we started with a vision to bridge the gap 
                between premium fashion and everyday accessibility.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                What began as a small boutique in Kumasi has grown into a comprehensive fashion destination. 
                We've embraced technology, introducing AI-powered measurement tools and custom design services, 
                while never losing sight of what matters most – helping you look and feel your best.
              </p>
              <p className="text-lg leading-relaxed">
                Today, we serve thousands of customers across Ghana, offering carefully curated collections 
                for men, women, and custom pieces that tell your unique story. Every item in our store is 
                selected with care, ensuring it meets our standards for quality, style, and value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from product selection to customer service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-gray-900 dark:text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Key milestones that shaped Stylish Steps Collection
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 flex items-center justify-center text-white dark:text-gray-900 font-bold text-sm">
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-800 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="font-semibold text-xl mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Stylish Steps Collection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-sm text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-linear-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 border-0 text-white dark:text-gray-900">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Experience Premium Fashion?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of satisfied customers who trust Stylish Steps Collection
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/products">Browse Collections</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-transparent text-white dark:text-gray-900 border-white dark:border-gray-900 hover:bg-white/10">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}