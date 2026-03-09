"use client";

import { useRouter, useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TestDriveForm } from "@/components/testDrive/testDrive-form";
import { useTestDrive, usePatchTestDrive } from "@/hooks/useTestDrive";
import { TestDriveFormValues } from "@/types/testDrive";

/* ============================================================================
   Edit Test Drive Modal
   ============================================================================ */

export default function EditTestDriveModal() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, isError } = useTestDrive(id);
  const updateTestDrive = usePatchTestDrive();

  /* ------------------------ Submit Handler ------------------------ */
  const handleUpdate = async (values: TestDriveFormValues) => {
    await updateTestDrive.mutateAsync({
      id,
      data: values,
    });
    router.back();
  };

  /* ------------------------ Loading State ------------------------ */
  if (isLoading) {
    return (
      <Dialog open onOpenChange={() => router.back()}>
        <DialogContent className="max-w-4xl">
          <p className="text-sm text-muted-foreground">
            Loading test drive…
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  /* ------------------------ Error State ------------------------ */
  if (isError || !data) {
    return (
      <Dialog open onOpenChange={() => router.back()}>
        <DialogContent className="max-w-4xl">
          <p className="text-sm text-destructive">
            Failed to load test drive
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  /* ------------------------ Map Initial Data ------------------------ */
  const initialData: Partial<TestDriveFormValues> = {
    customer_id: data.customer_id,
    vehicle_id: data.vehicle_id,
    salesperson_id: data.salesperson_id ?? undefined,

    driver_license_number: data.driver_license_number,
    driver_license_expiry: new Date(data.driver_license_expiry),

    driver_license_image_url: data.driver_license_image_url ?? undefined,
    signature_image_url: data.signature_image_url ?? undefined,

    start_time: data.start_time,
    notes: data.notes ?? "",
  };

  /* ------------------------ Render ------------------------ */
  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Test Drive</DialogTitle>
        </DialogHeader>

        <TestDriveForm
          initialData={initialData}
          onSubmit={handleUpdate}
          onCancel={() => router.back()}
        />
      </DialogContent>
    </Dialog>
  );
}
