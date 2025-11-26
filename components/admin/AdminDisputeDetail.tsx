'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/lib/utils';
import DisputeMessages from '@/components/disputes/DisputeMessages';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface AdminDisputeDetailProps {
  dispute: any;
}

export default function AdminDisputeDetail({ dispute: initialDispute }: AdminDisputeDetailProps) {
  const router = useRouter();
  const [dispute, setDispute] = useState(initialDispute);
  const [status, setStatus] = useState(dispute.status);
  const [resolution, setResolution] = useState(dispute.resolution || '');
  const [updating, setUpdating] = useState(false);
  const { data: session } = useSession();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      open: 'destructive',
      investigating: 'secondary',
      resolved: 'default',
      closed: 'outline',
    };
    return variants[status] || 'outline';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      not_received: 'Order Not Received',
      damaged: 'Item Damaged/Defective',
      wrong_item: 'Wrong Item Received',
      quality_issue: 'Quality Issue',
      other: 'Other Issue',
    };
    return labels[type] || type;
  };

  const handleUpdateStatus = useCallback(async () => {
    if (status === 'resolved' && !resolution.trim()) {
      toast.error('Please provide a resolution note');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/api/disputes/${dispute._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          resolution: resolution.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update dispute');
      }

      setDispute(data.dispute);
      toast.success('Dispute updated successfully');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  }, [dispute._id, status, resolution, router]);

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0 pb-20">
      <div className="mb-4 md:mb-6">
        <Button variant="ghost" onClick={() => router.push('/admin-disputes')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Back to Disputes</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Left Column - Dispute Details */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg md:text-2xl line-clamp-2 flex-1">
                    {getTypeLabel(dispute.type)}
                  </CardTitle>
                  <Badge variant={getStatusBadge(dispute.status)} className="capitalize shrink-0">
                    {dispute.status}
                  </Badge>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Dispute #{dispute._id.slice(-8)} • Opened {formatDate(dispute.createdAt)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm md:text-base">Issue Description</h3>
                <p className="text-xs md:text-sm text-muted-foreground break-words">{dispute.description}</p>
              </div>

              {dispute.images && dispute.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Evidence Photos</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {dispute.images.map((img: string, index: number) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={img}
                          alt={`Evidence ${index + 1}`}
                          fill
                          className="object-cover rounded-lg cursor-pointer hover:opacity-80"
                          onClick={() => window.open(img, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {dispute.resolution && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Resolution</h3>
                  <p className="text-xs md:text-sm text-muted-foreground break-words">{dispute.resolution}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <DisputeMessages
                disputeId={dispute._id}
                initialMessages={dispute.messages}
                currentUserId={session?.user?.id}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions & Info */}
        <div className="space-y-4 md:space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs md:text-sm font-semibold">Name</p>
                <p className="text-xs md:text-sm text-muted-foreground break-words">{dispute.user.name}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-semibold">Email</p>
                <p className="text-xs md:text-sm text-muted-foreground break-all">{dispute.user.email}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-semibold">Order</p>
                <Link
                  href={`/admin-orders/${dispute.order._id}`}
                  className="text-xs md:text-sm text-blue-600 hover:underline"
                >
                  #{dispute.order._id.slice(-8)}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(status === 'resolved' || status === 'closed') && (
                <div className="space-y-2">
                  <Label htmlFor="resolution" className="text-sm">
                    Resolution Note {status === 'resolved' && '*'}
                  </Label>
                  <Textarea
                    id="resolution"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Describe how this dispute was resolved..."
                    rows={4}
                    required={status === 'resolved'}
                    className="text-sm"
                  />
                </div>
              )}

              <Button
                onClick={handleUpdateStatus}
                className="w-full"
                disabled={updating || (status === 'resolved' && !resolution.trim())}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full text-sm"
                onClick={() => router.push(`/admin-orders/${dispute.order._id}`)}
              >
                View Order Details
              </Button>
              <Button
                variant="outline"
                className="w-full text-sm"
                onClick={() => {
                  const subject = `Dispute #${dispute._id.slice(-8)} - ${getTypeLabel(dispute.type)}`;
                  window.location.href = `mailto:${dispute.user.email}?subject=${encodeURIComponent(subject)}`;
                }}
              >
                Email Customer
              </Button>
            </CardContent>
          </Card>

          {/* Warning for Open Disputes */}
          {dispute.status === 'open' && (
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
              <CardContent className="p-3 md:p-4">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-orange-900 dark:text-orange-100">
                      Action Required
                    </p>
                    <p className="text-xs md:text-sm text-orange-700 dark:text-orange-200">
                      This dispute needs attention. Please respond to the customer or update the status.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}