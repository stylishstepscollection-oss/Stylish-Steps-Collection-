// components/ads/AdBanner.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IAd } from "@/models/Ads";

interface AdBannerProps {
  placement: "homepage" | "products" | "product-detail" | "cart" | "all";
  adType: "banner" | "sidebar" | "popup" | "inline";
  className?: string;
}

export default function AdBanner({
  placement,
  adType,
  className = "",
}: AdBannerProps) {
  const [ads, setAds] = useState<IAd[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, [placement, adType]);

  useEffect(() => {
    if (ads.length > 0 && adType === "popup") {
      const timer = setTimeout(() => {
        setIsPopupVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [ads, adType]);

  const fetchAds = async () => {
    try {
      const params = new URLSearchParams({
        placement,
        adType,
        activeOnly: "true",
      });

      const response = await fetch(`/api/ads?${params.toString()}`);
      const data = await response.json();

      if (response.ok && data.ads && data.ads.length > 0) {
        setAds(data.ads);
        // Track impressions for all fetched ads
        data.ads.forEach((ad: IAd) => {
          trackImpression(ad._id);
        });
      }
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const trackImpression = async (adId: string) => {
    try {
      await fetch(`/api/ads/${adId}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "impression" }),
      });
    } catch (error) {
      console.error("Failed to track impression:", error);
    }
  };

  const handleAdClick = async (ad: IAd) => {
    try {
      // Track click without awaiting to avoid blocking navigation
      fetch(`/api/ads/${ad._id}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "click" }),
      }).catch((err) => console.error("Failed to track click:", err));

      // Close popup if it's a popup ad
      if (adType === "popup") {
        setIsPopupVisible(false);
      }
    } catch (error) {
      console.error("Error in handleAdClick:", error);
    }
  };

  if (loading || ads.length === 0) return null;

  const currentAd = ads[currentAdIndex];

  // Popup Ad
  // Banner Ad - Improved
  if (adType === "banner") {
    return (
      <div className={`w-full mb-6 ${className}`}>
        <Link
          href={currentAd.linkUrl}
          onClick={() => handleAdClick(currentAd)}
          className="block relative group"
        >
          <div className="relative w-max h-max mx-auto rounded-2xl overflow-hidden bg-muted">
            <Image
              src={currentAd.image}
              alt={currentAd.title}
              // fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              width={200}
              height={200}
              className="object-cover w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] group-hover:scale-105 transition-transform duration-300"
              priority={placement === "homepage"}
            />
          </div>
          {currentAd.isSponsored && (
            <div className="absolute top-2 left-2 md:top-4 md:left-4">
              <Badge variant="secondary" className="text-xs md:text-sm">
                Sponsored
              </Badge>
            </div>
          )}
        </Link>
      </div>
    );
  }

  // Sidebar Ad - Improved
  if (adType === "sidebar") {
    return (
      <div className={`w-full ${className}`}>
        <Link
          href={currentAd.linkUrl}
          onClick={() => handleAdClick(currentAd)}
          className="block relative group"
        >
          <div className="relative w-max h-max mx-auto md:aspect-square rounded-xl overflow-hidden bg-muted">
            <Image
              src={currentAd.image}
              alt={currentAd.title}
              // fill
              width={200}
              height={200}
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          {currentAd.isSponsored && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3">
              <Badge variant="secondary" className="text-xs">
                Sponsored
              </Badge>
            </div>
          )}
        </Link>
      </div>
    );
  }

  // Inline Ad - Improved
  if (adType === "inline") {
    return (
      <div className={`w-full my-6 md:my-8 ${className}`}>
        <Link
          href={currentAd.linkUrl}
          onClick={() => handleAdClick(currentAd)}
          className="block relative group"
        >
          <div className="relative w-max h-max mx-autorounded-xl overflow-hidden bg-muted">
            <Image
              src={currentAd.image}
              alt={currentAd.title}
              // fill
              width={200}
              height={200}
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          {currentAd.isSponsored && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3">
              <Badge variant="secondary" className="text-xs md:text-sm">
                Sponsored
              </Badge>
            </div>
          )}
        </Link>
      </div>
    );
  }

  // Popup Ad - Improved
  if (adType === "popup" && isPopupVisible) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="relative max-w-3xl w-full bg-card rounded-2xl shadow-xl overflow-hidden">
          <button
            onClick={() => setIsPopupVisible(false)}
            className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-1.5 md:p-2 bg-background/90 hover:bg-background rounded-full transition-colors"
            aria-label="Close advertisement"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <Link
            href={currentAd.linkUrl}
            onClick={() => handleAdClick(currentAd)}
            className="block"
          >
            <div className="relative w-max h-max mx-auto bg-muted">
              <Image
                src={currentAd.image}
                alt={currentAd.title}
                // fill
                width={200}
                height={200}
                sizes="(max-width: 768px) 90vw, 800px"
                className="object-cover w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw]"
                priority
              />
            </div>
            {currentAd.isSponsored && (
              <div className="absolute top-2 left-2 md:top-4 md:left-4">
                <Badge variant="secondary" className="text-xs md:text-sm">
                  Sponsored
                </Badge>
              </div>
            )}
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
