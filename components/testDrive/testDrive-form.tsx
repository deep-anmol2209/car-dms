"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Car, 
  User,
  CreditCard, 
  Upload, 
  Clock, 
  FileText 
} from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useInventory } from "@/hooks/use-inventory";
import { useCustomers } from "@/hooks/use-customers";
import { useAssignableUsers, useUsers } from "@/hooks/use-users";
import type { User as UserType } from "@/types/user";
import {
  testDriveFormSchema,
  TestDriveFormValues,
} from "@/types/testDrive";
import { useEffect, useState } from "react";
import { ImageUploader } from "../imagekit/fileUpload";
import { uploadToImageKit } from "@/helper/upload";
import { Customer } from "@/types/customers";
import Image from "next/image";
/* ============================================================================
   Component
   ============================================================================ */
interface TestDriveFormProps {
  onSubmit: (data: TestDriveFormValues) => Promise<void> | void;
  initialData?: Partial<TestDriveFormValues>;
  onCancel?: () => void;
}

export function TestDriveForm({
   initialData,
  onSubmit,
  onCancel,
}: TestDriveFormProps) {
  const form = useForm<TestDriveFormValues>({
    resolver: zodResolver(testDriveFormSchema),
    defaultValues: {
      customer_id: initialData?.customer_id || "",
      vehicle_id: initialData?.vehicle_id || "",
      salesperson_id: initialData?.salesperson_id || "",

      driver_license_number: initialData?.driver_license_number || "",
      driver_license_expiry: initialData?.driver_license_expiry,

      start_time: initialData?.start_time || "",
      notes: initialData?.notes || "", 
    },
  });
const [licensePreview, setLicensePreview] = useState<string | null>(null);
const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
const [licensePreviewUrl, setLicensePreviewUrl] = useState<string | null>(null); // server
const [licenseObjectPreview, setLicenseObjectPreview] = useState<string | null>(null); // local

const [signaturePreviewUrl, setSignaturePreviewUrl] = useState<string | null>(null);
const [signatureObjectPreview, setSignatureObjectPreview] = useState<string | null>(null);
const [licenseFile, setLicenseFile] = useState<File | null>(null);
const [signatureFile, setSignatureFile] = useState<File | null>(null);

useEffect(() => {
  if (initialData?.driver_license?.imageUrl) {
    setLicensePreviewUrl(initialData.driver_license.imageUrl);
    setLicenseObjectPreview(null);
  }

  if (initialData?.signature?.imageUrl) {
    setSignaturePreviewUrl(initialData.signature.imageUrl);
    setSignatureObjectPreview(null);
  }
}, [initialData]);

useEffect(() => {
  return () => {
    if (licensePreview) URL.revokeObjectURL(licensePreview);
    if (signaturePreview) URL.revokeObjectURL(signaturePreview);
  };
}, [licensePreview, signaturePreview]);
  // SAME PATTERN AS LEAD FORM


  const onFormSubmit = async (data: TestDriveFormValues) => {
  let licenseData = null;
  let signatureData = null;

if (licenseFile) {
  const uploaded = await uploadToImageKit(licenseFile);

  if (!uploaded.fileId || !uploaded.url) {
    throw new Error("Upload failed");
  }

  licenseData = {
    fileId: uploaded.fileId,
    imageUrl: uploaded.url,
  };
}
 if (signatureFile) {
  const uploaded = await uploadToImageKit(signatureFile);

  if (!uploaded.fileId || !uploaded.url) {
    throw new Error("Upload failed");
  }

  signatureData = {
    fileId: uploaded.fileId,
    imageUrl: uploaded.url,
  };
}
  await onSubmit({
    ...data,
    driver_license: licenseData ,
    signature: signatureData,
  });
};

    const {
      data: customerResponse,
      isLoading: isCustomersLoading,
      isError: isCustomersError,
    } = useCustomers();
    const customers = customerResponse?.data ?? [];
    const {
      data: userResponse,
      isLoading: isUsersLoading,
      isError: isUsersError,
    } = useAssignableUsers();

    const users= userResponse?.data || []
const { data: vehicleResponse, isLoading } = useInventory();
const vehicles = vehicleResponse?.data || [];
  const staffUsers = users.filter((user:UserType) => user.role === 'Staff');
  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-4xl shadow-lg border-muted/40">
        <CardHeader className="bg-muted/5">
          <CardTitle className="flex items-center gap-2 text-xl text-primary">
            <Car className="h-5 w-5" />
            Schedule Test Drive
          </CardTitle>
          <CardDescription>
            Book a new test drive session. Ensure license details are verified before submission.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
              
              {/* --- SECTION 1: Booking Details --- */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <User className="h-4 w-4" /> Booking Details
                </h3>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Customer Select */}
                  <FormField
                    control={form.control}
                    name="customer_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={isCustomersLoading || isCustomersError}
                              >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                            placeholder={
                                              isCustomersLoading
                                                ? "Loading customers..."
                                                : isCustomersError
                                                ? "Failed to load customers"
                                                : "Select Customer"
                                            }
                                          />
                            </SelectTrigger>
                          </FormControl>
                   <SelectContent>
                            {!isCustomersLoading && customers.length === 0 && (
                              <SelectItem value="no-customers" disabled>
                                No customers found
                              </SelectItem>
                            )}
                  
                            {customers.map((customer: Customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                                {customer.phone ? ` • ${customer.phone}` : ""}
                                {customer.city ? ` • ${customer.city}` : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Salesperson Select */}
                  <FormField
                    control={form.control}
                    name="salesperson_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned Salesperson</FormLabel>
                        <Select
                                value={field.value || "unassigned"}
                                onValueChange={(value) =>
                                  field.onChange(value === "unassigned" ? null : value)
                                }
                                disabled={isUsersLoading || isUsersError}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={
                                        isUsersLoading
                                          ? "Loading users..."
                                          : isUsersError
                                          ? "Failed to load users"
                                          : "Auto-assign later"
                                      }
                                    />
                                  </SelectTrigger>
                                </FormControl>
                        
                                <SelectContent>
                                  {/* Default option */}
                                  <SelectItem value="unassigned">
                                    Auto-assign later
                                  </SelectItem>
                        
                                  {/* Empty state */}
                                  {!isUsersLoading && users.length === 0 && (
                                    <SelectItem value="no-users" disabled>
                                      No users found
                                    </SelectItem>
                                  )}
                        
                                  {/* Users list */}
                                  {staffUsers.map((user: UserType) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.full_name}
                                      {user.role ? ` • ${user.role}` : ""}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Vehicle Select */}
                  <FormField
                    control={form.control}
                    name="vehicle_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Model</FormLabel>
                         <Select
                                onValueChange={(value) =>
                                  field.onChange(value === "none" ? null : value)
                                }
                                value={field.value ?? "none"}
                                disabled={isLoading}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={
                                        isLoading ? "Loading vehicles..." : "Select vehicle (optional)"
                                      }
                                    />
                                  </SelectTrigger>
                                </FormControl>
                        
                                <SelectContent>
                                  <SelectItem value="none">Not selected</SelectItem>
                        
                                  {vehicles.map((v) => (
                                    <SelectItem key={v.id} value={v.id}>
                                      {v.year} {v.make} {v.model}
                                      {v.stock_number ? ` • Stock #${v.stock_number}` : ""}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Start Time */}
                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="datetime-local" 
                              {...field} 
                              className="pl-10" // Add padding for icon if you want to overlay one, or just standard
                            />
                            {/* Optional visual icon overlay */}
                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* --- SECTION 2: Driver & License Info --- */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2 mt-2">
                  <CreditCard className="h-4 w-4" /> License Information
                </h3>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <FormField
                    control={form.control}
                    name="driver_license_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="DL-XXXX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="driver_license_expiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Expiry Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* --- SECTION 3: Documents & Notes --- */}
              <div className="space-y-4">
                 <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2 mt-2">
                  <FileText className="h-4 w-4" /> Documents & Notes
                </h3>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
<FormField
  control={form.control}
  name="driver_license"
  render={() => (
    <FormItem>
      <FormLabel>License Front</FormLabel>

<ImageUploader
  onFilesChange={(files) => {
    const file = files[0];
    if (!file) return;

    setLicenseFile(file);

    // revoke old
    if (licenseObjectPreview) {
      URL.revokeObjectURL(licenseObjectPreview);
    }

    const localUrl = URL.createObjectURL(file);

    setLicenseObjectPreview(localUrl);
    setLicensePreviewUrl(null); // 🔥 IMPORTANT
   
  }}
/>

      {(licenseObjectPreview || licensePreviewUrl) && (
  <Image
    src={licenseObjectPreview ?? licensePreviewUrl ?? ""}
    width={100}
    height={100}
    alt="license"
    className="mt-2 h-24 rounded border object-cover"
    unoptimized
  />
)}

      <FormMessage />
    </FormItem>
  )}
/>



<FormField
  control={form.control}
  name="signature"
  render={() => (
    <FormItem>
      <FormLabel>Customer Signature</FormLabel>

<ImageUploader
  onFilesChange={(files) => {
    const file = files[0];
    if (!file) return;

    setSignatureFile(file);

    if (signatureObjectPreview) {
      URL.revokeObjectURL(signatureObjectPreview);
    }

    const localUrl = URL.createObjectURL(file);

    setSignatureObjectPreview(localUrl);
    setSignaturePreviewUrl(null);
  }}
/>

{(signatureObjectPreview || signaturePreviewUrl) && (
  <Image
    src={signatureObjectPreview ?? signaturePreviewUrl ?? ""}
    width={100}
    height={100}
    alt="signature"
    className="mt-2 h-24 rounded border object-cover"
    unoptimized
  />
)}

      <FormMessage />
    </FormItem>
  )}
/>



                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="pt-2">
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any specific customer requirements or concerns..." 
                          className="min-h-[100px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* --- Submit Action --- */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <Button type="button" variant="outline">Cancel</Button>
                <Button type="submit" size="lg" className="px-8">
                  Confirm Booking
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


