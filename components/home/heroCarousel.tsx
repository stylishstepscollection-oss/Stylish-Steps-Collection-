'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Autoplay from "embla-carousel-autoplay";

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
      plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
    >
      <CarouselContent>
        {heroImages.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-full">
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/30 sm:from-black/70 sm:via-black/50 sm:to-transparent" />
              
              {/* Text content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-xl lg:max-w-2xl text-white space-y-3 sm:space-y-4 md:space-y-6">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                      {image.title}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 max-w-md">
                      {image.subtitle}
                    </p>
                    <Button
                      size="lg"
                      className="bg-white hover:bg-white/90 text-black font-semibold mt-4 sm:mt-6 md:mt-8 text-sm sm:text-base h-10 sm:h-11 md:h-12"
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
      
      {/* Navigation buttons - hidden on mobile, visible on tablet+ */}
      <CarouselPrevious className="hidden sm:flex left-2 sm:left-4" />
      <CarouselNext className="hidden sm:flex right-2 sm:right-4" />
      
      {/* Mobile indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:hidden">
        {heroImages.map((_, index) => (
          <div key={index} className="w-2 h-2 rounded-full bg-white/50" />
        ))}
      </div>
    </Carousel>
  );
}