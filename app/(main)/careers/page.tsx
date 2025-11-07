import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Heart,
  Sparkles 
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers - Join Our Team | Stylish Steps Collection',
  description: 'Explore career opportunities at Stylish Steps Collection. Join our team and help shape the future of fashion in Ghana.',
};

export default function CareersPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Salary',
      description: 'We offer attractive compensation packages that reflect your skills and experience.',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Clear paths for advancement with training and development opportunities.',
    },
    {
      icon: Users,
      title: 'Great Team',
      description: 'Work with passionate, talented people who love what they do.',
    },
    {
      icon: Heart,
      title: 'Work-Life Balance',
      description: 'Flexible schedules and time off to recharge and spend with loved ones.',
    },
  ];

  const openings = [
    {
      title: 'Sales Associate',
      department: 'Retail',
      location: 'Kumasi, Ghana',
      type: 'Full-time',
      description: 'Help customers find their perfect style while delivering exceptional service.',
      requirements: [
        'Excellent communication skills',
        'Passion for fashion and customer service',
        '1+ years retail experience preferred',
        'Fluency in English and Twi',
      ],
    },
    {
      title: 'Fashion Designer',
      department: 'Design',
      location: 'Kumasi, Ghana',
      type: 'Full-time',
      description: 'Create stunning custom designs and contribute to our seasonal collections.',
      requirements: [
        'Degree or diploma in Fashion Design',
        '2+ years experience in fashion design',
        'Proficiency in design software',
        'Strong portfolio demonstrating creativity',
      ],
    },
    {
      title: 'Social Media Manager',
      department: 'Marketing',
      location: 'Kumasi, Ghana (Hybrid)',
      type: 'Full-time',
      description: 'Build our online presence and engage with our fashion community.',
      requirements: [
        'Experience managing social media accounts',
        'Knowledge of Instagram, Facebook, Snapchat',
        'Creative content creation skills',
        'Understanding of fashion trends',
      ],
    },
    {
      title: 'Customer Service Representative',
      department: 'Support',
      location: 'Kumasi, Ghana',
      type: 'Part-time',
      description: 'Provide outstanding support to our customers via phone, WhatsApp, and social media.',
      requirements: [
        'Excellent communication skills',
        'Problem-solving abilities',
        'Patient and friendly demeanor',
        'Computer literacy',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">We're Hiring!</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Be part of a dynamic team that's transforming fashion retail in Ghana. 
              We're looking for passionate individuals who share our vision.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Work With Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe in creating an environment where talent thrives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-gray-900 dark:text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Open Positions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find your next opportunity with Stylish Steps Collection
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {openings.map((job, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </div>
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/contact?subject=Application: ${job.title}`}>
                        Apply Now
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {job.requirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-gray-900 dark:text-white mt-0.5">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Application Process</h2>
              <p className="text-muted-foreground">
                Here's what to expect when you apply
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Apply', desc: 'Submit your application through our contact form' },
                { step: '2', title: 'Review', desc: 'We review your application and resume' },
                { step: '3', title: 'Interview', desc: 'Selected candidates are invited for an interview' },
                { step: '4', title: 'Welcome', desc: 'Join our team and start your journey!' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-linear-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Card className="bg-linear-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 border-0 text-white dark:text-gray-900 max-w-3xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                Don't See a Perfect Match?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact?subject=General Application">
                  Send Resume
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}