'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';

import { invoiceFormSchema, InvoiceFormValues, CreateInvoicePayload } from '@/types/invoice';
import { useInvoiceCalculator } from '@/hooks/use-invoice-calculator';
import { useLeads } from '@/hooks/use-leads';

import { useCreateInvoice } from '@/hooks/use-invoices';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { InvoiceDetailsCard } from '@/components/invoices/invoice-detals-card';
import { CustomerVehicleSelect } from '@/components/invoices/selector';
import { PricingFeesCard } from '@/components/invoices/pricing-fee-card';
import { LineItemsCard } from '@/components/invoices/line-items-card';
import { InvoicePreview } from '@/components/invoices/invoice-preview';
import { useCustomers } from '@/hooks/use-customers';
import { InvoiceNotesCard } from '@/components/invoices/invoice-notes-card';
import { Customer } from '@/types/customers';
import { Vehicle } from '@/types/inventory';
import { useDebounce } from "@/hooks/use-debounce";
import { useInventory } from '@/hooks/use-inventory';
import { VehicleSelector } from '@/components/invoices/vehicle-selector';

export default function NewInvoicePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 400); // 300–500ms best
  // Data fetching
  const { data: customerResponse, isLoading: isLoadingCustomers } = useCustomers();
  const { data: vehiclesResponse, isLoading: isLoadingVehicles } = useInventory({ status: "Active", search: debouncedSearch });

  const vehicles = vehiclesResponse?.data ?? [];
  const customers = customerResponse?.data ?? [];
  const createInvoice = useCreateInvoice();

  // Form initialization
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoice_number: '',
      invoice_date: new Date(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      customer_id: null,
      vehicle_id: null,
      package_name: '',
      base_price: 0,
      package_fee: 0,
      discount: 0,
      tax_mode: 'gst+pst',
      line_items: [],
      status: 'Pending',
      notes: '',
    },
  });

  // Watch form values for calculations
  const watchedValues = form.watch();
  const calculation = useInvoiceCalculator({
    basePrice: watchedValues.base_price,
    packageFee: watchedValues.package_fee,
    discount: watchedValues.discount,
    taxMode: watchedValues.tax_mode,
    lineItems: watchedValues.line_items,
  });

  // Handle vehicle selection - auto-populate base price
const handleVehicleChange = (vehicle?: { retail_price: number }) => {
  if (vehicle) {
    form.setValue('base_price', vehicle.retail_price);
  }
};


  // Form submission
  const onSubmit = async (data: InvoiceFormValues) => {
    if (!data.customer_id) {
      toast.error('Please select a customer');
      return;
    }

    const payload: CreateInvoicePayload = {
      invoice_number: data.invoice_number,
      invoice_date: data.invoice_date,
      due_date: data.due_date,
      customer_id: data.customer_id,
      vehicle_id: data.vehicle_id || null,
      package_name: data.package_name || null,
     base_price: data.base_price,
     package_fee: data.package_fee,
     tax_mode: data.tax_mode,
     discount: data.discount,
      line_items: data.line_items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.quantity * item.unit_price,
      })),
      status: data.status,
      notes: data.notes || null,
    };

    createInvoice.mutate(payload, {
      onSuccess: () => {
        toast.success('Invoice created successfully');
        router.push('/invoices');
      },
      onError: (error) => {
        console.error('Failed to create invoice:', error);
        toast.error('Failed to create invoice. Please try again.');
      },
    });
  };

  // Get selected entities for preview
  const selectedCustomer = customers?.find((c: Customer) => c.id === watchedValues.customer_id);
  const selectedVehicle = vehicles?.find((v: Vehicle) => v.id === watchedValues.vehicle_id);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Invoice</h1>
        <p className="text-slate-500 mt-1">
          Generate a professional invoice for your customer
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form Inputs */}
            <div className="space-y-6">
              <InvoiceDetailsCard control={form.control} />

              <CustomerVehicleSelect
                control={form.control}
                customers={customers}
                vehicles={vehicles}
                isLoadingCustomers={isLoadingCustomers}
                isLoadingVehicles={isLoadingVehicles}
                onVehicleChange={handleVehicleChange}
                onSearch={(val) => setSearch(val)}
              />
      <PricingFeesCard control={form.control} />

              <LineItemsCard control={form.control} watch={form.watch} />
<InvoiceNotesCard control={form.control} />
              {/* Submit Button */}
             <Button
  type="submit"
  className="w-full"
  disabled={
    createInvoice.isPending ||
    !watchedValues.customer_id ||
    calculation.grandTotal <= 0
  }
>

                {createInvoice.isPending ? 'Creating Invoice...' : 'Create Invoice'}
              </Button>
            </div>

            {/* Right Column - Live Preview */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <InvoicePreview
                invoiceNumber={watchedValues.invoice_number}
                invoiceDate={watchedValues.invoice_date}
                dueDate={watchedValues.due_date}
                customerName={selectedCustomer?.name}
                customerAddress={selectedCustomer?.address!}
                basePrice= {watchedValues.base_price}
                vehicleInfo={
                  selectedVehicle
                    ? {
                        year: selectedVehicle.year,
                        make: selectedVehicle.make,
                        model: selectedVehicle.model,
                        vin: selectedVehicle.vin,
                        odometer: selectedVehicle.odometer,
                      }
                    : undefined
                }
                packageName={watchedValues.package_name}
                packageFee={watchedValues.package_fee}
                lineItems={watchedValues.line_items.map((item) => ({
                  description: item.description,
                  quantity: item.quantity,
                  unit_price: item.unit_price,
                  amount: item.quantity * item.unit_price,
                }))}
                calculation={calculation}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}