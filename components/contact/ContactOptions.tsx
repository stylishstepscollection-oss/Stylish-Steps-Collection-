'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ContactOptionsProps {
  productInfo?: {
    productId: string;
    productName: string;
    price: number;
    size?: string;
    color?: string;
  };
}

export default function ContactOptions({ productInfo }: ContactOptionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+233XXXXXXXXX';
  const snapchatUsername = process.env.NEXT_PUBLIC_SNAPCHAT_USERNAME || 'stylishstyle';
  const instagramUsername = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'stylishstyle';

  const handleContact = async (method: 'whatsapp' | 'snapchat' | 'instagram') => {
    setIsLoading(true);

    try {
      // Save contact attempt
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, productInfo }),
      });

      let url = '';
      let message = '';

      if (productInfo) {
        message = `Hi! I'm interested in:\n\nProduct: ${productInfo.productName}\nPrice: $${productInfo.price}`;
        if (productInfo.size) message += `\nSize: ${productInfo.size}`;
        if (productInfo.color) message += `\nColor: ${productInfo.color}`;
      } else {
        message = 'Hi! I have a question about your products.';
      }

      switch (method) {
        case 'whatsapp':
          url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
            message
          )}`;
          break;
        case 'snapchat':
          url = `https://www.snapchat.com/add/${snapchatUsername}`;
          toast.success('Opening Snapchat...');
          break;
        case 'instagram':
          url = `https://www.instagram.com/${instagramUsername}`;
          toast.success('Opening Instagram...');
          break;
      }

      window.open(url, '_blank');
    } catch (error) {
      toast.error('Failed to initiate contact');
    } finally {
      setIsLoading(false);
    }
  };

  const contactMethods = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      description: 'Chat directly for quick responses',
      color: 'bg-green-500 hover:bg-green-600',
      handle: whatsappNumber,
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      icon: '👻',
      description: 'Send snaps and messages',
      color: 'bg-yellow-400 hover:bg-yellow-500',
      handle: `@${snapchatUsername}`,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      description: 'DM us on Instagram',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      handle: `@${instagramUsername}`,
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {contactMethods.map((method) => (
        <Card
          key={method.id}
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 active:scale-98"
          onClick={() => !isLoading && handleContact(method.id as any)}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${method.color} rounded-full sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-transform shrink-0 shadow-md`}
              >
                {method.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1">
                  {method.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1 hidden sm:block">
                  {method.description}
                </p>
                <p className="text-[10px] sm:text-xs font-mono text-muted-foreground truncate">
                  {method.handle}
                </p>
              </div>
              <div className="shrink-0">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">Open</span> →
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}