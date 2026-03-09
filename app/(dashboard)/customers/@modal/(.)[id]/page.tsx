"use client";

import { useRouter, useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useUpdateCustomer, useCustomer } from "@/hooks/use-customers";
import { CustomerFormData } from "@/types/customers";
import { CustomerForm } from "@/components/customers/customer-form";
import toast from "react-hot-toast";

export default function EditCustomerModal() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: customer, isLoading, isError } = useCustomer(id);

console.log("customer", customer);


const updateCustomer = useUpdateCustomer();
  /* ------------------------ Submit Handler ------------------------ */
  const handleUpdate = async (values: CustomerFormData) => {
    await updateCustomer.mutateAsync({
      id,
      customer: values,
    }, {
        onSuccess: ()=>{
            toast.success("updated successfuly")
        },
        onError: ()=>{
            toast.error("error in updating")
        }
    });
    router.back();
  };

  /* ------------------------ Loading State ------------------------ */
  if (isLoading) {
    return (
      <Dialog open onOpenChange={() => router.back()}>
        <DialogContent className="max-w-4xl">
          <p className="text-sm text-muted-foreground">
            Loading Customer...
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  /* ------------------------ Error State ------------------------ */
  if (isError || !customer) {
    return (
      <Dialog open onOpenChange={() => router.back()}>
        <DialogContent className="max-w-4xl">
          <p className="text-sm text-destructive">
            Failed to load customer
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  /* ------------------------ Map Initial Data ------------------------ */
  const initialData: Partial<CustomerFormData> = {
    name: customer.name,
    email: customer.email!,
    phone: customer.phone!,
    province: customer.province!,
    postal_code: customer.postal_code!,
    city: customer.city!,
    address: customer.address!,
    notes: customer.notes!,
  };

  /* ------------------------ Render ------------------------ */
  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
<CustomerForm
initialData={initialData}
onSubmit={handleUpdate}
onCancel={()=>router.back()}
/>
      </DialogContent>
    </Dialog>
  );
}
