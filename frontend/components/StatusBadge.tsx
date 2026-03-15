import { BookingStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: BookingStatus;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'secondary' as const,
  },
  confirmed: {
    label: 'Confirmed',
    variant: 'default' as const,
  },
  completed: {
    label: 'Completed',
    variant: 'default' as const,
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'destructive' as const,
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
