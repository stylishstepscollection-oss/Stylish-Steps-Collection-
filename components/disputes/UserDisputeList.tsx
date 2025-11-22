// components/disputes/UserDisputeList.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { AlertCircle, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Dispute {
  _id: string;
  order: { _id: string };
  type: string;
  status: string;
  description: string;
  createdAt: string;
  messages: any[];
}

interface UserDisputeListProps {
  disputes: Dispute[];
}

export default function UserDisputeList({ disputes }: UserDisputeListProps) {
  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; icon: any; label: string }> = {
      open: { variant: 'destructive', icon: AlertCircle, label: 'Open' },
      investigating: { variant: 'secondary', icon: Clock, label: 'Investigating' },
      resolved: { variant: 'default', icon: CheckCircle, label: 'Resolved' },
      closed: { variant: 'outline', icon: XCircle, label: 'Closed' },
    };
    return config[status] || config.open;
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

  // Count disputes by status
  const statusCounts = {
    all: disputes.length,
    open: disputes.filter((d) => d.status === 'open').length,
    investigating: disputes.filter((d) => d.status === 'investigating').length,
    resolved: disputes.filter((d) => d.status === 'resolved').length,
    closed: disputes.filter((d) => d.status === 'closed').length,
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Disputes</h1>
        <p className="text-muted-foreground">Track and manage your order issues</p>
      </div>

      {/* Status Summary */}
      {disputes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{statusCounts.open}</p>
              <p className="text-sm text-muted-foreground">Open</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{statusCounts.investigating}</p>
              <p className="text-sm text-muted-foreground">Investigating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{statusCounts.resolved}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{statusCounts.closed}</p>
              <p className="text-sm text-muted-foreground">Closed</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Disputes List */}
      {disputes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Disputes</h3>
            <p className="text-muted-foreground mb-6">
              You haven't reported any issues with your orders
            </p>
            <Button asChild>
              <Link href="/orders">View My Orders</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => {
            const statusConfig = getStatusBadge(dispute.status);
            const StatusIcon = statusConfig.icon;
            const hasUnreadMessages = dispute.messages.length > 0;

            return (
              <Card key={dispute._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">
                          {getTypeLabel(dispute.type)}
                        </CardTitle>
                        <Badge variant={statusConfig.variant} className="capitalize">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          Dispute #{dispute._id.slice(-8)} • Order #
                          {dispute.order._id.slice(-8)}
                        </p>
                        <p>Opened {formatDate(dispute.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {dispute.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {dispute.messages.length} message{dispute.messages.length !== 1 ? 's' : ''}
                      </div>
                      {dispute.status === 'open' && (
                        <span className="text-orange-600 font-medium">Needs attention</span>
                      )}
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/disputes/${dispute._id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}