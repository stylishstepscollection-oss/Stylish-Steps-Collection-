'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface ManualMeasurementFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function ManualMeasurementForm({
  onSubmit,
  isLoading = false,
}: ManualMeasurementFormProps) {
  const [formData, setFormData] = useState({
    gender: 'male' as 'male' | 'female',
    unit: 'cm' as 'cm' | 'inches',
    chest: '',
    waist: '',
    hips: '',
    shoulders: '',
    inseam: '',
    height: '',
    neck: '',
    sleeve: '',
    thigh: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const measurements: any = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value && !['gender', 'unit', 'notes'].includes(key)) {
        measurements[key] = parseFloat(value);
      }
    });

    onSubmit({
      measurements,
      gender: formData.gender,
      unit: formData.unit,
      notes: formData.notes,
    });
  };

  const measurementFields = [
    { name: 'height', label: 'Height', placeholder: 'e.g., 175' },
    { name: 'chest', label: 'Chest', placeholder: 'e.g., 95' },
    { name: 'waist', label: 'Waist', placeholder: 'e.g., 80' },
    { name: 'hips', label: 'Hips', placeholder: 'e.g., 90' },
    { name: 'shoulders', label: 'Shoulders', placeholder: 'e.g., 45' },
    { name: 'inseam', label: 'Inseam', placeholder: 'e.g., 75' },
    { name: 'neck', label: 'Neck', placeholder: 'e.g., 38' },
    { name: 'sleeve', label: 'Sleeve Length', placeholder: 'e.g., 60' },
    { name: 'thigh', label: 'Thigh', placeholder: 'e.g., 55' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Measurements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: 'male' | 'female') =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value: 'cm' | 'inches') =>
                  setFormData({ ...formData, unit: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">Centimeters (cm)</SelectItem>
                  <SelectItem value="inches">Inches (in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {measurementFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label} ({formData.unit})
                </Label>
                <Input
                  id={field.name}
                  type="number"
                  step="0.1"
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about your measurements..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-zinc-500 hover:bg-zinc-500/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Measurements'
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}