'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Autoplay from "embla-carousel-autoplay";

// Hero carousel images from Unsplash
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1920&q=80',
      title: 'Premium Suits',
      subtitle: 'Tailored to perfection'
    },
    {
      url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920&q=80',
      title: 'Luxury Sneakers',
      subtitle: 'Step up your game'
    },
    {
      url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1920&q=80',
      title: 'Elegant Dresses',
      subtitle: 'For every occasion'
    },
    {
      url: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=1920&q=80',
      title: 'Stylish Accessories',
      subtitle: 'Complete your look'
    }
  ];

export function HeroCarousel() {
  return (
    <Carousel 
      className="w-full"
      opts={{ align: "start", loop: true }}
      plugins={[Autoplay({ delay: 5000 })]}
    >
               <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[500px] md:h-[600px] w-full">
                  <Image
                    src={image.url}
                    alt={image.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                  
                  {/* Text content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                      <div className="max-w-2xl text-white animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-bold mb-4">
                          {image.title}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90">
                          {image.subtitle}
                        </p>
                        <Button
                          size="lg"
                          className="bg-white hover:bg-white/90 text-black font-semibold"
                          asChild
                        >
                          <Link href="/products">Shop Now</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
  );
}