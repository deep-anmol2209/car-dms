"use client";

import { useRouter, useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VehicleForm } from "@/components/inventory/vehicle-form";
import { VehicleFormData, vehicleSchema } from "@/types/inventory";
import { useUpdateInventory } from "@/hooks/use-inventory";
import { useInventoryItem } from "@/hooks/use-inventory";



export default function EditInvectoryModal() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, isError } = useInventoryItem(id);
const updateVehicle = useUpdateInventory();
  /* ------------------------ Submit Handler ------------------------ */
  const handleUpdate = async (values: VehicleFormData) => {
    await updateVehicle.mutateAsync({
      id,
      vehicle: values,
    });
    router.back();
  };

  /* ------------------------ Loading State ------------------------ */
  if (isLoading) {
    return (
      <Dialog open onOpenChange={() => router.back()}>
        <DialogContent className="max-w-4xl">
          <p className="text-sm text-muted-foreground">
            Loading Inventory...
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
            Failed to load inventory
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  /* ------------------------ Map Initial Data ------------------------ */
  const initialData: Partial<VehicleFormData> = {
    vin: data.vin,
    year: data.year,
    make: data.make,
    model: data.model,
    trim: data.trim,
    odometer: data.odometer,
    stock_number: data.stock_number,
    condition: data.condition,
    status: data.status,
    purchase_price: data.purchase_price,
    retail_price: data.retail_price,
    extra_costs: data.extra_costs,
    taxes: data.taxes,
    image_gallery: data.image_gallery,
  };
const parsedVehicle = {
  ...initialData,
  image_gallery: initialData.image_gallery?.map((img) =>
    typeof img === "string" ? JSON.parse(img) : img
  ) || [],
};

  /* ------------------------ Render ------------------------ */
  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Inventory</DialogTitle>
        </DialogHeader>
<VehicleForm
initialData={parsedVehicle}
onSubmit={handleUpdate}
onCancel={()=>router.back()}
/>
      </DialogContent>
    </Dialog>
  );
}
