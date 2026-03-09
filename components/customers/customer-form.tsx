"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, type CustomerFormData } from "@/types/customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void | Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<CustomerFormData>;
}

export function CustomerForm({
  onSubmit,
  onCancel,
  initialData,
}: CustomerFormProps) {
  // 1. Define your form.
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || {
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      province: "",
      postal_code: "",
      notes: "",
    },
  });
console.log(initialData);

  // 2. Define a submit handler.
  const onFormSubmit = async (data: CustomerFormData) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        
        {/* Section: Personal Info */}
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                    <Input type="tel" placeholder="(555) 000-0000" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem className="md:col-span-2">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                    <Input type="email" placeholder="jane@example.com" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
        </div>

        <Separator />

        {/* Section: Address */}
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Location Details</h3>
            
            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                    <Input placeholder="123 Main St" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                        <Input placeholder="Toronto" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                        <Input placeholder="ON" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                        <Input placeholder="M5V 2N2" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
        </div>

        <Separator />

        {/* Section: Notes */}
        <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Internal Notes</FormLabel>
                <FormControl>
                <Textarea 
                    placeholder="Add any important details here..." 
                    className="min-h-[100px] resize-none" 
                    {...field} 
                    value={field.value || ""} 
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}