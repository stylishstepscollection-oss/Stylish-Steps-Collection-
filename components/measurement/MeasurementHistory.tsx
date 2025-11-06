'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatDate } from '@/lib/utils';
import { IMeasurement } from '@/models/Measurement';
import { Trash2, Ruler } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface MeasurementHistoryProps {
  measurements: IMeasurement[];
  onUpdate: () => void;
}

export default function MeasurementHistory({
  measurements,
  onUpdate,
}: MeasurementHistoryProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/measurements/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete measurement');
      }

      toast.success('Measurement deleted successfully');
      setDeleteId(null);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete measurement');
    } finally {
      setIsDeleting(false);
    }
  };

  if (measurements.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Ruler className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No measurements saved yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {measurements.map((measurement) => (
          <Card key={measurement._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Measurements - {formatDate(measurement.createdAt)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {measurement.gender}
                  </Badge>
                  <Badge variant="secondary">{measurement.unit}</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteId(measurement._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(measurement.measurements).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <div key={key} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground capitalize mb-1">
                        {key}
                      </p>
                      <p className="text-lg font-semibold">
                        {value} {measurement.unit}
                      </p>
                    </div>
                  );
                })}
              </div>
              {measurement.notes && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{measurement.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Measurement?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this measurement
              record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}