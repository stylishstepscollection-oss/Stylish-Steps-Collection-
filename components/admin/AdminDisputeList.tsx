// components/admin/AdminDisputeList.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
import { AlertCircle, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AdminDisputeListProps {
  disputes: any[];
  initialStatus: string;
}

export default function AdminDisputeList({ disputes, initialStatus }: AdminDisputeListProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialStatus);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; icon: any }> = {
      open: { variant: 'destructive', icon: AlertCircle },
      investigating: { variant: 'secondary', icon: Clock },
      resolved: { variant: 'default', icon: CheckCircle },
      closed: { variant: 'outline', icon: XCircle },
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/admin/disputes?status=${value}`);
  };

  const filterDisputes = (status: string) => {
    if (status === 'all') return disputes;
    return disputes.filter((d) => d.status === status);
  };

  const statusCounts = {
    all: disputes.length,
    open: disputes.filter((d) => d.status === 'open').length,
    investigating: disputes.filter((d) => d.status === 'investigating').length,
    resolved: disputes.filter((d) => d.status === 'resolved').length,
    closed: disputes.filter((d) => d.status === 'closed').length,
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dispute Management</h1>
        <p className="text-muted-foreground">
          Manage and resolve customer disputes
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="open">
            Open ({statusCounts.open})
          </TabsTrigger>
          <TabsTrigger value="investigating">
            Investigating ({statusCounts.investigating})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({statusCounts.resolved})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({statusCounts.closed})
          </TabsTrigger>
        </TabsList>

        {['all', 'open', 'investigating', 'resolved', 'closed'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4 mt-4">
            {filterDisputes(status).length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Disputes</h3>
                  <p className="text-muted-foreground">
                    No disputes found with this status
                  </p>
                </CardContent>
              </Card>
            ) : (
              filterDisputes(status).map((dispute) => {
                const statusConfig = getStatusBadge(dispute.status);
                const StatusIcon = statusConfig.icon;

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
                              {dispute.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                              Dispute #{dispute._id.slice(-8)} • Order #
                              {dispute.order._id.slice(-8)}
                            </p>
                            <p>
                              Customer: {dispute.user.name} ({dispute.user.email})
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
                            {dispute.messages.length} messages
                          </div>
                          {dispute.images && dispute.images.length > 0 && (
                            <span>{dispute.images.length} photos</span>
                          )}
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/admin-disputes/${dispute._id}`}>
                            View & Respond
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}