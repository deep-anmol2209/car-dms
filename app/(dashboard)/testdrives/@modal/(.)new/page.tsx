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
import { TestDriveForm } from '@/components/testDrive/testDrive-form';
import { useCreateTestDrive } from '@/hooks/useTestDrive';
import { LeadFormData } from '@/types/leads';
import { TestDriveFormValues } from '@/types/testDrive';


export default function NewTestDriveModal() {
  const creatTestDrive = useCreateTestDrive();
  const router = useRouter();
  const handleCreate = async (data: TestDriveFormValues) => {
    await creatTestDrive.mutateAsync(data);
    router.back(); // close modal after success
  };

  return (
<Dialog open onOpenChange={() => router.back()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule new test drive</DialogTitle>
          </DialogHeader>
          <TestDriveForm
           onSubmit={handleCreate}
           onCancel={() => router.back()}
           
          />
        </DialogContent>
      </Dialog>

  );
}
