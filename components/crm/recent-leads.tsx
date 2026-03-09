'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface RecentLead {
  id: string;
  customer?: {
    name: string;
    phone: string;
  };
  status: string;
  created_at: string;
}

export function RecentLeads({ leads }: { leads: RecentLead[] }) {
  const statusColors: Record<string, string> = {
    not_started: 'bg-slate-100 text-slate-800',
    in_progress: 'bg-blue-100 text-blue-800',
    qualified: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
    won: 'bg-teal-100 text-teal-800',
  };
  
  if (leads.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>No recent leads</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Added</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="font-medium">
              <Link 
                href={`/leads/${lead.id}`} 
                className="hover:underline hover:text-teal-600"
              >
                {lead.customer?.name || 'No customer'}
              </Link>
              <div className="text-xs text-slate-500 mt-1">{lead.customer?.phone || 'N/A'}</div>
            </TableCell>
            <TableCell>
              <Badge className={`${statusColors[lead.status] || 'bg-slate-100 text-slate-800'} capitalize`}>
                {lead.status.replace('_', ' ')}
              </Badge>
            </TableCell>
            <TableCell className="text-right text-slate-500 text-sm">
              {new Date(lead.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
