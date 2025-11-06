import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        {action && (
          <Button onClick={action.onClick} className="bg-accent-gold hover:bg-accent-gold/90">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}