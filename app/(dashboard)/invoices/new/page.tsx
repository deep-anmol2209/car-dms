// 'use client';

// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { InvoiceFormData, invoiceSchema } from '@/lib/validations/invoice';
// import { useInvoiceCalculator } from '@/hooks/use-invoice-calculator';
// import { InvoicePreview } from '@/components/invoices/invoice-preview';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Calendar } from '@/components/ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { CalendarIcon, PlusIcon, TrashIcon } from 'lucide-react';
// import { format } from 'date-fns';
// import { useLeads } from '@/hooks/use-leads';
// import { useVehicles } from '@/hooks/use-vehicles';
// import { useCreateInvoice } from '@/hooks/use-invoices';
// import { toast } from 'react-hot-toast';

// export default function NewInvoicePage() {
//   const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
//   const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  
//   const { data: leads } = useLeads();
//   const { data: vehicles } = useVehicles();
//   const createInvoice = useCreateInvoice();
  
//   const calculator = useInvoiceCalculator();
  
//   const form = useForm<InvoiceFormData>({
//     resolver: zodResolver(invoiceSchema),
//     defaultValues: {
//       invoice_date: new Date(),
//       due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
//       status: 'Pending',
//       tax_rate: 13,
//     }
//   });

//   const invoiceDate = form.watch('invoice_date');
//   const dueDate = form.watch('due_date');
//   const packageName = form.watch('package_name');

//   // Update base price when vehicle changes
//   useEffect(() => {
//     if (selectedVehicle) {
//       const retailPrice = parseFloat(selectedVehicle.retail_price?.toString() || '0') || 0;
//       calculator.setBasePrice(retailPrice);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedVehicle]);

//   const handleSubmit = async (data: InvoiceFormData) => {
//     if (!selectedCustomer) {
//       toast.error('Please select a customer');
//       return;
//     }

//     const invoiceData = {
//       ...data,
//       customer_id: selectedCustomer.id,
//       vehicle_id: selectedVehicle?.id,
//       payment_amount: calculator.calculation.subtotal,
//       tax_amount: calculator.calculation.taxAmount,
//       total: calculator.calculation.grandTotal,
//       line_items: calculator.lineItems.map(item => ({
//         description: item.description,
//         quantity: item.quantity,
//         unit_price: item.unit_price,
//         amount: item.quantity * item.unit_price,
//       })),
//     };

//     createInvoice.mutate(invoiceData, {
//       onSuccess: () => {
//         toast.success('Invoice created successfully');
//         // Navigate back or reset form
//       },
//       onError: () => {
//         toast.error('Failed to create invoice');
//       }
//     });
//   };

//   const activeVehicles = vehicles?.filter(v => v.status === 'Active') || [];

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold">Create New Invoice</h1>
//         <p className="text-slate-500 mt-1">Generate a professional invoice for your customer</p>
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(handleSubmit)}>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Left Column - Inputs */}
//             <div className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Invoice Details</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <FormField
//                     control={form.control}
//                     name="invoice_number"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Invoice Number</FormLabel>
//                         <FormControl>
//                           <Input {...field} placeholder="INV-0001" />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <div className="grid grid-cols-2 gap-4">
//                     <FormField
//                       control={form.control}
//                       name="invoice_date"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Invoice Date</FormLabel>
//                           <Popover>
//                             <PopoverTrigger asChild>
//                               <FormControl>
//                                 <Button variant="outline" className="w-full justify-start">
//                                   <CalendarIcon className="mr-2 h-4 w-4" />
//                                   {field.value ? format(field.value, "PPP") : "Pick a date"}
//                                 </Button>
//                               </FormControl>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-auto p-0">
//                               <Calendar
//                                 mode="single"
//                                 selected={field.value}
//                                 onSelect={field.onChange}
//                               />
//                             </PopoverContent>
//                           </Popover>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="due_date"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Due Date</FormLabel>
//                           <Popover>
//                             <PopoverTrigger asChild>
//                               <FormControl>
//                                 <Button variant="outline" className="w-full justify-start">
//                                   <CalendarIcon className="mr-2 h-4 w-4" />
//                                   {field.value ? format(field.value, "PPP") : "Pick a date"}
//                                 </Button>
//                               </FormControl>
//                             </PopoverTrigger>
//                             <PopoverContent className="w-auto p-0">
//                               <Calendar
//                                 mode="single"
//                                 selected={field.value}
//                                 onSelect={field.onChange}
//                               />
//                             </PopoverContent>
//                           </Popover>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Customer & Vehicle</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">Customer</label>
//                     <select
//                       className="w-full p-2 border rounded-md"
//                       value={selectedCustomer?.id || ''}
//                       onChange={(e) => {
//                         const customer = leads?.find(l => l.id === e.target.value);
//                         setSelectedCustomer(customer);
//                       }}
//                     >
//                       <option value="">Select a customer</option>
//                       {leads?.map(lead => (
//                         <option key={lead.id} value={lead.id}>
//                           {lead.full_name} - {lead.phone}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium mb-2 block">Vehicle</label>
//                     <select
//                       className="w-full p-2 border rounded-md"
//                       value={selectedVehicle?.id || ''}
//                       onChange={(e) => {
//                         const vehicle = activeVehicles.find(v => v.id === e.target.value);
//                         setSelectedVehicle(vehicle);
//                         if (vehicle) {
//                           const retailPrice = parseFloat(vehicle.retail_price?.toString() || '0') || 0;
//                           calculator.setBasePrice(retailPrice);
//                         }
//                       }}
//                     >
//                       <option value="">Select a vehicle</option>
//                       {activeVehicles.map(vehicle => (
//                         <option key={vehicle.id} value={vehicle.id}>
//                           {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.vin?.slice(-6)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Pricing & Fees</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">Base Price (Vehicle Retail)</label>
//                     <Input
//                       type="number"
//                       value={calculator.basePrice}
//                       onChange={(e) => calculator.setBasePrice(parseFloat(e.target.value) || 0)}
//                       step="0.01"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium mb-2 block">Package Name</label>
//                     <Input
//                       value={packageName || ''}
//                       onChange={(e) => form.setValue('package_name', e.target.value)}
//                       placeholder="e.g., Libra Package"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium mb-2 block">Package Fee</label>
//                     <Input
//                       type="number"
//                       value={calculator.packageFee}
//                       onChange={(e) => calculator.setPackageFee(parseFloat(e.target.value) || 0)}
//                       step="0.01"
//                       placeholder="599.00"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium mb-2 block">Discount</label>
//                     <Input
//                       type="number"
//                       value={calculator.discount}
//                       onChange={(e) => calculator.setDiscount(parseFloat(e.target.value) || 0)}
//                       step="0.01"
//                       placeholder="0.00"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium mb-2 block">Tax Mode</label>
//                     <select
//                       className="w-full p-2 border rounded-md"
//                       value={calculator.taxMode}
//                       onChange={(e) => calculator.setTaxMode(e.target.value as 'gst+pst' | 'hst')}
//                     >
//                       <option value="gst+pst">GST + PST (5% + 7%)</option>
//                       <option value="hst">HST (13%)</option>
//                     </select>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Line Items</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {calculator.lineItems.map((item, index) => (
//                     <div key={index} className="grid grid-cols-12 gap-2 items-end">
//                       <div className="col-span-5">
//                         <Input
//                           placeholder="Description"
//                           value={item.description}
//                           onChange={(e) => calculator.updateLineItem(index, 'description', e.target.value)}
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <Input
//                           type="number"
//                           placeholder="Qty"
//                           value={item.quantity}
//                           onChange={(e) => calculator.updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
//                         />
//                       </div>
//                       <div className="col-span-3">
//                         <Input
//                           type="number"
//                           placeholder="Price"
//                           value={item.unit_price}
//                           onChange={(e) => calculator.updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
//                           step="0.01"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           size="icon"
//                           onClick={() => calculator.removeLineItem(index)}
//                         >
//                           <TrashIcon className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={calculator.addLineItem}
//                     className="w-full"
//                   >
//                     <PlusIcon className="w-4 h-4 mr-2" />
//                     Add Line Item
//                   </Button>
//                 </CardContent>
//               </Card>

//               <Button type="submit" className="w-full" disabled={createInvoice.isPending}>
//                 {createInvoice.isPending ? 'Creating...' : 'Create Invoice'}
//               </Button>
//             </div>

//             {/* Right Column - Preview */}
//             <div>
//               <InvoicePreview
//                 customerName={selectedCustomer?.full_name}
//                 customerAddress={selectedCustomer?.address}
//                 vehicleInfo={selectedVehicle ? {
//                   year: selectedVehicle.year,
//                   make: selectedVehicle.make,
//                   model: selectedVehicle.model,
//                   vin: selectedVehicle.vin,
//                   odometer: selectedVehicle.odometer,
//                 } : undefined}
//                 calculation={calculator.calculation}
//                 packageName={packageName}
//                 lineItems={calculator.lineItems.map(item => ({
//                   description: item.description,
//                   quantity: item.quantity,
//                   unit_price: item.unit_price,
//                   amount: item.quantity * item.unit_price,
//                 }))}
//                 invoiceDate={invoiceDate}
//                 dueDate={dueDate}
//                 invoiceNumber={form.watch('invoice_number')}
//               />
//             </div>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }

/**
 * New Invoice Page - Production Ready
 * 
 * Key improvements:
 * 1. All state is in react-hook-form (no separate useState for customer/vehicle)
 * 2. Proper TypeScript - NO `any` types
 * 3. Component composition - single responsibility principle
 * 4. Proper Next.js navigation with useRouter
 * 5. Loading states and error handling
 * 6. Proper form validation with zod
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';

import { invoiceFormSchema, InvoiceFormValues, CreateInvoicePayload } from '@/types/invoice';
import { useInvoiceCalculator } from '@/hooks/use-invoice-calculator';
import { useLeads } from '@/hooks/use-leads';
import { useVehicles } from '@/hooks/use-vehicles';
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

export default function NewInvoicePage() {
  const router = useRouter();

  // Data fetching
  const { data: customers=[], isLoading: isLoadingCustomers } = useCustomers();
  const { data: vehicles, isLoading: isLoadingVehicles } = useVehicles();
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
  const selectedCustomer = customers?.find((c) => c.id === watchedValues.customer_id);
  const selectedVehicle = vehicles?.find((v) => v.id === watchedValues.vehicle_id);

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