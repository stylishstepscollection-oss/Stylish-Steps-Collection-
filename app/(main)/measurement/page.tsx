'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import CameraCapture from '@/components/measurement/CameraCapture';
import ManualMeasurementForm from '@/components/measurement/ManualMeasurementForm';
import MeasurementHistory from '@/components/measurement/MeasurementHistory';
import { Camera, Edit, History, Info } from 'lucide-react';
import { toast } from 'sonner';
import { IMeasurement } from '@/models/Measurement';
import { Card, CardContent } from '@/components/ui/card';

export default function MeasurementPage() {
  const [measurements, setMeasurements] = useState<IMeasurement[]>([]);
  const [loading, setLoading] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('instructions');

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const response = await fetch('/api/measurements');
      const data = await response.json();
      setMeasurements(data.measurements);
    } catch (error) {
      console.error('Error fetching measurements:', error);
    }
  };

  const handleCapture = (imageData: string) => {
    setCapturedImages((prev) => [...prev, imageData]);
    toast.success('Capture successful! You can now enter your measurements.');
    setActiveTab('manual');
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          images: capturedImages,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save measurements');
      }

      toast.success('Measurements saved successfully!');
      setCapturedImages([]);
      setActiveTab('history');
      fetchMeasurements();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save measurements');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Body Measurements</h1>
        <p className="text-muted-foreground">
          Get accurate measurements for the perfect fit
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="instructions">
            <Info className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Instructions</span>
          </TabsTrigger>
          <TabsTrigger value="camera">
            <Camera className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Camera</span>
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Edit className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Manual</span>
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">📷 Camera Method (AI-Assisted)</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Stand against a plain, light-colored wall</li>
                  <li>Wear fitted clothing or minimal clothing</li>
                  <li>Take front view and side view photos</li>
                  <li>Ensure good lighting in the room</li>
                  <li>Stand straight with arms slightly away from body</li>
                  <li>Our AI will analyze and provide measurements</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">📏 Manual Method</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Use a flexible measuring tape</li>
                  <li>Wear minimal clothing for accuracy</li>
                  <li>Stand straight and relaxed</li>
                  <li>Measure around the fullest part of each area</li>
                  <li>Don't pull the tape too tight</li>
                  <li>Record measurements in centimeters or inches</li>
                </ol>
              </div>

              <div className="p-4 bg-zinc-500/10 border border-accent-gold/20 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
<Info className="h-5 w-5 text-accent-gold" />
Measurement Guide
</h3>
<ul className="space-y-1 text-sm">
<li><strong>Height:</strong> Stand barefoot, measure from floor to top of head</li>
<li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
<li><strong>Waist:</strong> Measure around your natural waistline</li>
<li><strong>Hips:</strong> Measure around the fullest part of your hips</li>
<li><strong>Shoulders:</strong> Measure across from shoulder point to shoulder point</li>
<li><strong>Inseam:</strong> Measure from crotch to ankle</li>
</ul>
</div>
          <div className="flex gap-4">
            <Button
              onClick={() => setActiveTab('camera')}
              className="flex-1 bg-zinc-500 hover:bg-zinc-500/90"
            >
              <Camera className="mr-2 h-4 w-4" />
              Use Camera
            </Button>
            <Button
              onClick={() => setActiveTab('manual')}
              variant="outline"
              className="flex-1"
            >
              <Edit className="mr-2 h-4 w-4" />
              Manual Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="camera" className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">
            Step 1: Take Photos for AI Analysis
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Take front and side view photos. Our AI will analyze your body proportions.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="photo" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photo">Photo Mode</TabsTrigger>
          <TabsTrigger value="video">Video Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="photo">
          <CameraCapture onCapture={handleCapture} mode="photo" />
        </TabsContent>

        <TabsContent value="video">
          <CameraCapture onCapture={handleCapture} mode="video" />
        </TabsContent>
      </Tabs>

      {capturedImages.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">
              Captured Images ({capturedImages.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {capturedImages.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Capture ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      setCapturedImages((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button
              onClick={() => setActiveTab('manual')}
              className="w-full mt-4 bg-zinc-500 hover:bg-zinc-500/90"
            >
              Continue to Manual Entry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">AI Analysis Note</p>
              <p className="text-muted-foreground">
                For the most accurate results, after capturing photos, please verify and
                enter your actual measurements manually in the next step.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="manual">
      <ManualMeasurementForm onSubmit={handleSubmit} isLoading={loading} />
      
      {capturedImages.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              ✓ {capturedImages.length} reference image(s) will be saved with your measurements
            </p>
          </CardContent>
        </Card>
      )}
    </TabsContent>

    <TabsContent value="history">
      <MeasurementHistory measurements={measurements} onUpdate={fetchMeasurements} />
    </TabsContent>
  </Tabs>
</div>
);
}