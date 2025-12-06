import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Camera, Sparkles, ArrowRight } from 'lucide-react';

export default function MeasurementAIPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center space-y-6">
        {/* Animated Icon */}
        <div className="relative inline-flex">
          <div className="absolute inset-0 bg-accent-gold/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative bg-gradient-to-br from-accent-gold to-accent-gold/70 p-8 rounded-3xl">
            <Camera className="h-16 w-16 text-white" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-accent-gold animate-bounce" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI Measurement
            <span className="block text-accent-gold mt-2">Coming Soon</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our advanced AI-powered measurement system is under development
          </p>
        </div>

        {/* Features Preview */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">What to Expect</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-accent-gold">✨</div>
                  <div>
                    <h3 className="font-semibold">AI-Powered Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced computer vision to analyze your body measurements
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-accent-gold">📸</div>
                  <div>
                    <h3 className="font-semibold">Photo & Video</h3>
                    <p className="text-sm text-muted-foreground">
                      Capture your measurements using photos or video
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-accent-gold">🎯</div>
                  <div>
                    <h3 className="font-semibold">High Accuracy</h3>
                    <p className="text-sm text-muted-foreground">
                      Professional-grade accuracy within seconds
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-accent-gold">💾</div>
                  <div>
                    <h3 className="font-semibold">Save & Track</h3>
                    <p className="text-sm text-muted-foreground">
                      Store and track measurement changes over time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        {/* <div className="space-y-4">
          <p className="text-muted-foreground">
            In the meantime, you can use our manual measurement entry
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-accent-gold hover:bg-accent-gold/90">
              <Link href="/measurement">
                Manual Measurements <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div> */}

        {/* Progress Indicator */}
        {/* <Card className="max-w-md mx-auto bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Development Progress</span>
              <span className="text-sm text-accent-gold">75%</span>
            </div>
            <div className="w-full h-2 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-accent-gold rounded-full w-3/4 transition-all" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Expected launch: Q2 2024
            </p>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}