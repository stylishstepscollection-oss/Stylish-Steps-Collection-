// components/disputes/DisputeDetail.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDate } from '@/lib/utils';
import DisputeMessages from './DisputeMessages';
import Image from 'next/image';
import { CheckCircle, Clock, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';

interface DisputeDetailProps {
  dispute: any;
}

export default function DisputeDetail({ dispute }: DisputeDetailProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      open: 'destructive',
      investigating: 'secondary',
      resolved: 'default',
      closed: 'outline',
    };
    return variants[status] || 'outline';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      open: AlertCircle,
      investigating: Clock,
      resolved: CheckCircle,
      closed: CheckCircle,
    };
    const Icon = icons[status] || AlertCircle;
    return <Icon className="h-5 w-5" />;
  };

  const getStatusMessage = (status: string) => {
    const messages: Record<string, string> = {
      open: 'Your dispute has been submitted and is awaiting review from our support team.',
      investigating: 'Our team is currently investigating your issue. We will get back to you soon.',
      resolved: 'This dispute has been resolved. Please review the resolution details below.',
      closed: 'This dispute has been closed.',
    };
    return messages[status] || '';
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Status Alert */}
      <Alert className="mb-6">
          {getStatusIcon(dispute.status)}
          <AlertDescription>{getStatusMessage(dispute.status)}</AlertDescription>
      </Alert>

      {/* Main Dispute Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {getTypeLabel(dispute.type)}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <span>Dispute #{dispute._id.slice(-8)}</span>
                <span>•</span>
                <Link
                  href={`/orders/${dispute.order._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Order #{dispute.order._id.slice(-8)}
                </Link>
                <span>•</span>
                <span>Opened {formatDate(dispute.createdAt)}</span>
              </div>
            </div>
            <Badge variant={getStatusBadge(dispute.status)} className="capitalize">
              {dispute.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Issue Description</h3>
            <p className="text-muted-foreground">{dispute.description}</p>
          </div>

          {dispute.images && dispute.images.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Evidence Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {dispute.images.map((img: string, index: number) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={img}
                      alt={`Evidence ${index + 1}`}
                      fill
                      className="object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(img, '_blank')}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Click on images to view full size
              </p>
            </div>
          )}

          {dispute.resolution && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <h3 className="font-semibold mb-1 text-green-900 dark:text-green-100">
                  Resolution
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  {dispute.resolution}
                </p>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Messages Card */}
      <Card>
        <CardHeader>
          <CardTitle>Communication with Support</CardTitle>
          <p className="text-sm text-muted-foreground">
            Send messages to discuss your dispute with our support team
          </p>
        </CardHeader>
        <CardContent>
          <DisputeMessages
            disputeId={dispute._id}
            initialMessages={dispute.messages}
          />
        </CardContent>
      </Card>

      {/* Help Info */}
      {dispute.status !== 'resolved' && dispute.status !== 'closed' && (
        <Alert className="mt-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Need help?</strong> Our support team typically responds within 24 hours. 
            You can send messages above to provide additional information or ask questions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}