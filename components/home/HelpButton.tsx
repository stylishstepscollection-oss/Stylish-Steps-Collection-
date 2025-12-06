// components/home/HelpButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle, ShoppingBag, Package, CreditCard, Truck, CheckCircle } from 'lucide-react';

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      icon: ShoppingBag,
      number: 1,
      title: 'Browse & Add to Cart',
      description: 'Explore products, select size/color, and add items to your shopping cart',
    },
    {
      icon: Package,
      number: 2,
      title: 'Review Cart & Checkout',
      description: 'Review your items, enter shipping details and delivery address',
    },
    {
      icon: CreditCard,
      number: 3,
      title: 'Secure Payment',
      description: 'Pay securely with Paystack using your card or mobile money',
    },
    {
      icon: Truck,
      number: 4,
      title: 'Track Your Order',
      description: 'Get order confirmation and track delivery status in My Orders',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-20 md:bottom-6 right-4 z-40 shadow-lg rounded-full h-12 px-4 bg-background hover:bg-muted"
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          How to Shop
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl">How to Shop with Us</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Follow these simple steps to complete your purchase
          </p>
        </DialogHeader>
<div className="relative w-full pt-[56.25%]">
          <iframe
            src="https://drive.google.com/file/d/1821txB8Mnl5I7vkISr5Q0Z0Y1RvWcqKe/preview"
            className="absolute top-0 left-0 w-full h-full"
            allow="autoplay"
            allowFullScreen
          />
            </div>
        <div className="py-6 space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center font-bold text-primary text-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Tips Section */}
        <div className="border-t pt-6 space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Quick Tips
          </h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">📏 Use AI Measurements:</span> Get accurate measurements before ordering
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">💬 Need Help?</span> Contact seller anytime via product page
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">📦 Track Orders:</span> View order status in "My Orders" section
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">🔒 Secure Payment:</span> All payments processed securely via Paystack
              </p>
            </div>
          </div>
        </div>

        {/* Video Tutorial Link */}
        <div className="border-t pt-6">
          <div className="bg-primary/5 p-4 rounded-lg text-center">
            <p className="text-sm mb-3">
              🎥 <span className="font-semibold">Watch our video tutorial</span> for a complete walkthrough
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsOpen(false);
              }}
            >
              View Tutorial on Homepage
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}