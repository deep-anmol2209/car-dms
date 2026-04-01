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
import { useCreateInventory } from '@/hooks/use-inventory';
import toast from 'react-hot-toast';


export default function NewInventoryModal() {
  const router = useRouter();
  const createVehivle = useCreateInventory()
  return (
<Dialog open onOpenChange={() => router.back()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <VehicleForm
           onSubmit={(data) => {
            createVehivle.mutate(data, {
              onSuccess: () => {
                toast.success('Vehicle created');
                
              },
              onError: () => {
                toast.error('Failed to create vehicle');
              },
            });
          }}
           isLoading={createVehivle.isPending}
          />
        </DialogContent>
      </Dialog>

  );
}
