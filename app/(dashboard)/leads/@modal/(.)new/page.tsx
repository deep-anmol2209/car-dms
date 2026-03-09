'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { VehicleForm } from '@/components/inventory/vehicle-form';
import { LeadForm } from '@/components/leads/Lead-form';
import { useCreateLead } from '@/hooks/use-leads';
import { LeadFormData } from '@/types/leads';


export default function NewLeadsModal() {
  const createLead = useCreateLead();
  const router = useRouter();
  const handleCreate = async (data: LeadFormData) => {
    await createLead.mutateAsync(data);
    router.back(); // close modal after success
  };

  return (
<Dialog open onOpenChange={() => router.back()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <LeadForm
           onSubmit={handleCreate}
           onCancel={() => router.back()}
           
          />
        </DialogContent>
      </Dialog>

  );
}
