// components/home/VideoTutorial.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, X, Sparkles, ShoppingBag, CreditCard, Package } from 'lucide-react';

export default function VideoTutorial() {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      icon: ShoppingBag,
      title: 'Browse & Add to Cart',
      description: 'Explore our collection and add items to your cart',
    },
    {
      icon: Package,
      title: 'Checkout',
      description: 'Review your cart and enter shipping details',
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: 'Pay securely with Paystack and track your order',
    },
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="mb-3 bg-gradient-to-r from-purple-500 to-pink-500">
            <Sparkles className="h-3 w-3 mr-1" />
            New User?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            How to Shop with Us
          </h2>
          <p className="text-muted-foreground text-lg">
            Watch this quick guide to learn how to browse, add to cart, and complete your purchase
          </p>
        </div>

        <Card className="border-2 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Video Preview Section */}
              <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 p-8 flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <PlayCircle className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Watch Tutorial
                  </h3>
                  <p className="text-white/70 text-sm">
                    Learn how to shop and checkout in under 2 minutes
                  </p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-white text-zinc-900 hover:bg-white/90 font-semibold"
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Play Video Tutorial
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden">
                    <DialogHeader className="p-4 pb-0">
                      <DialogTitle>How to Shop - Video Tutorial</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full pt-[56.25%]">
                      <iframe
                        src="https://drive.google.com/file/d/1821txB8Mnl5I7vkISr5Q0Z0Y1RvWcqKe/preview"
                        className="absolute top-0 left-0 w-full h-full"
                        allow="autoplay"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-4 bg-muted/50">
                      <p className="text-sm text-muted-foreground text-center">
                        Having trouble viewing? <a href="https://drive.google.com/file/d/1821txB8Mnl5I7vkISr5Q0Z0Y1RvWcqKe/view" target="_blank" rel="noopener noreferrer" className="text-primary underline">Open in new tab</a>
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>

                <p className="text-white/50 text-xs mt-4">
                  ⏱️ 2 min watch
                </p>
              </div>

              {/* Quick Steps Section */}
              <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <h4 className="font-semibold text-lg mb-6">Quick Overview:</h4>
                <div className="space-y-6">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-primary flex items-center justify-center font-bold text-primary">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="h-4 w-4 text-primary" />
                            <h5 className="font-semibold">{step.title}</h5>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-center">
                    <span className="font-semibold">💡 Pro Tip:</span> Have your measurements ready and delivery address for a smooth checkout!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}