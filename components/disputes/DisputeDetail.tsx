'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import DisputeMessages from './DisputeMessages';
import Image from 'next/image';
import { CheckCircle, Clock, AlertCircle, Info, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface DisputeDetailProps {
  dispute: any;
}

export default function DisputeDetail({ dispute }: DisputeDetailProps) {
  const router = useRouter();
  const { data:session } = useSession()


  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      open: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      investigating: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    };
    return variants[status] || variants.open;
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
      investigating:
        'Our team is currently investigating your issue. We will get back to you soon.',
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
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">{getTypeLabel(dispute.type)}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
            <span>Dispute #{dispute._id.slice(-8)}</span>
            <span>•</span>
            <Link
              href={`/orders/${dispute.order._id}`}
              className="text-accent-gold hover:underline"
            >
              Order #{dispute.order._id.slice(-8)}
            </Link>
            <span>•</span>
            <span>Opened {formatDate(dispute.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      <Alert>
          {getStatusIcon(dispute.status)}
              <Badge className={`${getStatusBadge(dispute.status)} border-0`}>
                {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
              </Badge>
            <AlertDescription>{getStatusMessage(dispute.status)}</AlertDescription>
      </Alert>

      {/* Main Dispute Info */}
      <Card>
        <CardHeader>
          <CardTitle>Dispute Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Issue Description</h3>
            <p className="leading-relaxed">{dispute.description}</p>
          </div>

          {dispute.images && dispute.images.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
                Evidence Photos ({dispute.images.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dispute.images.map((img: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 hover:ring-accent-gold transition-all group"
                    onClick={() => window.open(img, '_blank')}
                  >
                    <Image src={img} alt={`Evidence ${index + 1}`} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                        View Full Size
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dispute.resolution && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-green-900 dark:text-green-100">
                    Resolution
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                    {dispute.resolution}
                  </p>
                </div>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Help Info */}
      {dispute.status !== 'resolved' && dispute.status !== 'closed' && (
        <Alert>
            <Info className="h-4 w-4 mt-0.5" />
            <AlertDescription>
              <strong>Need help?</strong> Our support team typically responds within 24 hours. Click
              the chat button in the bottom right corner to send messages and get updates.
            </AlertDescription>
        </Alert>
      )}

      {/* Floating Chat Component */}
      <DisputeMessages
        disputeId={dispute._id}
        currentUserId={session?.user?.id}
        initialMessages={dispute.messages}
        disputeStatus={dispute.status}
      />
    </div>
  );
}