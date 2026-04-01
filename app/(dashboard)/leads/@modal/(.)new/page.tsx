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
import toast from 'react-hot-toast';


export default function NewLeadsModal() {
  const createLead = useCreateLead();
  const router = useRouter();
  const handleCreate = async (data: LeadFormData) => {
    try {
      await createLead.mutateAsync(data);
      toast.success("Lead created Successfuly")
      router.back(); // close modal after success
    } catch (error) {
      toast.error("error ic lead creation")
    }
   
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
