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
          toast.success('Opening Snapchat... Send them the product details!');
          break;
        case 'instagram':
          url = `https://www.instagram.com/${instagramUsername}`;
          toast.success('Opening Instagram... Send them a DM with the product details!');
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
      color: 'bg-green-500',
      handle: whatsappNumber,
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      icon: '👻',
      description: 'Send snaps and messages',
      color: 'bg-yellow-400',
      handle: `@${snapchatUsername}`,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      description: 'DM us on Instagram',
      color: 'bg-pink-500',
      handle: `@${instagramUsername}`,
    },
  ];

  return (
    <div className="space-y-4">
      {contactMethods.map((method) => (
        <Card
          key={method.id}
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
          onClick={() => !isLoading && handleContact(method.id as any)}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center text-3xl`}
              >
                {method.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{method.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                <p className="text-xs font-mono text-muted-foreground">{method.handle}</p>
              </div>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Button variant="ghost" size="sm">
                  Open →
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}