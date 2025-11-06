'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Video, X, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  mode: 'photo' | 'video';
}

export default function CameraCapture({ onCapture, mode }: CameraCaptureProps) {
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: mode === 'video',
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
    setIsRecording(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      onCapture(imageData);
      stopCamera();
      toast.success('Photo captured successfully!');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        onCapture(base64data);
        toast.success('Video recorded successfully!');
      };
      reader.readAsDataURL(blob);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopCamera();
    }
  };

  const switchCamera = async () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    setTimeout(() => startCamera(), 100);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {!isActive ? (
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-muted-foreground mb-4">
              {mode === 'photo' ? 'Take a photo' : 'Record a video'}
            </p>
            <Button onClick={startCamera} className="bg-zinc-500 hover:bg-zinc-500/90">
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
          </div>
        ) : (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={mode === 'photo'}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Button size="icon" variant="secondary" onClick={switchCamera}>
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
            {isRecording && (
              <div className="absolute top-2 left-2 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-medium">Recording</span>
              </div>
            )}
          </div>
        )}

        {isActive && (
          <div className="flex gap-2 justify-center">
            {mode === 'photo' ? (
              <>
                <Button onClick={capturePhoto} className="bg-zinc-500 hover:bg-zinc-500/90">
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Photo
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {!isRecording ? (
                  <>
                    <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
                      <Video className="mr-2 h-4 w-4" />
                      Start Recording
                    </Button>
                    <Button onClick={stopCamera} variant="outline">
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={stopRecording} className="bg-red-600 hover:bg-red-700">
                    Stop Recording
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}