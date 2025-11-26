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
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Dispute Management</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage and resolve customer disputes
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className=" -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="grid w-full min-w-max h-full md:min-w-0 grid-cols-3 sm:grid-cols-5">
            <TabsTrigger value="all" className="text-xs md:text-sm">
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="open" className="text-xs md:text-sm">
              Open ({statusCounts.open})
            </TabsTrigger>
            <TabsTrigger value="investigating" className="text-xs md:text-sm whitespace-nowrap">
              Investigating ({statusCounts.investigating})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="text-xs md:text-sm">
              Resolved ({statusCounts.resolved})
            </TabsTrigger>
            <TabsTrigger value="closed" className="text-xs md:text-sm">
              Closed ({statusCounts.closed})
            </TabsTrigger>
          </TabsList>
        </div>

        {['all', 'open', 'investigating', 'resolved', 'closed'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-3 md:space-y-4 mt-4">
            {filterDisputes(status).length === 0 ? (
              <Card>
                <CardContent className="p-8 md:p-12 text-center">
                  <AlertCircle className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-muted-foreground" />
                  <h3 className="text-base md:text-lg font-semibold mb-2">No Disputes</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
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
                    <CardHeader className="pb-3">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base md:text-lg line-clamp-2 flex-1">
                            {getTypeLabel(dispute.type)}
                          </CardTitle>
                          <Badge variant={statusConfig.variant} className="capitalize shrink-0">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">{dispute.status}</span>
                            <span className="sm:hidden">{dispute.status.slice(0, 4)}</span>
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs md:text-sm text-muted-foreground">
                          <p className="break-words">
                            Dispute #{dispute._id.slice(-8)} • Order #{dispute.order._id.slice(-8)}
                          </p>
                          <p className="break-words">
                            Customer: {dispute.user.name} ({dispute.user.email})
                          </p>
                          <p>Opened {formatDate(dispute.createdAt)}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-2 break-words">
                        {dispute.description}
                      </p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
                            {dispute.messages.length} messages
                          </div>
                          {dispute.images && dispute.images.length > 0 && (
                            <span>{dispute.images.length} photos</span>
                          )}
                        </div>
                        <Button size="sm" asChild className="w-full sm:w-auto">
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