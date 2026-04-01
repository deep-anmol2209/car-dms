"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { LeadFormData } from "@/types/leads";
import { useInventory } from "@/hooks/use-inventory";
import { useCustomers } from "@/hooks/use-customers";
import { useAssignableUsers } from "@/hooks/use-users";
import { Button } from "@/components/ui/button";
import { useCreateLead } from "@/hooks/use-leads";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Make sure you have this component
import { ScrollArea } from "@/components/ui/scroll-area"; // Make sure you have this component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Customer } from "@/types/customers";
import { User } from "@/types/user";
import { Vehicle } from "@/types/inventory";
/**
 * Zod Schema for validation
 * Defines the shape and rules of the form
 */
const leadFormSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  source: z.string().min(1, "Source is required"),
  status: z.string().min(1, "Status is required"),
  interest_vehicle_id: z.string().optional().nullable(),
  assigned_to: z.string().optional().nullable(),
  notes: z.string().optional(),
});

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => Promise<void> | void;
  initialData?: Partial<LeadFormData>;
  onCancel?: () => void;
}


export function LeadForm({ initialData, onSubmit, onCancel }: LeadFormProps) {
  console.log(initialData);
  
  // 1. Setup Form with React Hook Form
  const form = useForm<z.infer<typeof leadFormSchema>>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      customer_id: initialData?.customer_id || "",
      source: initialData?.source || "",
      status: initialData?.status || "Not Started",
      interest_vehicle_id: initialData?.interest_vehicle_id || "",
      assigned_to: initialData?.assigned_to || "",
      notes: initialData?.notes || "",
    },
  });
  const createLeadMutation = useCreateLead();
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
  const users = userResponse?.data ?? [];
  const staffUsers = users.filter((user: User) => user.role === 'Staff');

  const { isSubmitting } = form.formState;
const { data: vehicleResponse, isLoading } = useInventory();

const vehicles = vehicleResponse?.data ?? [];

  // 2. Handle Submission
  const onFormSubmit = async (data: z.infer<typeof leadFormSchema>) => {
    await onSubmit(data as LeadFormData);
  };
  

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lead Information</CardTitle>
        <CardDescription>
          Create or edit lead details and assignment.
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <CardContent className="p-0">
            {/* SCROLLER IMPLEMENTATION:
               We wrap the fields in a ScrollArea with a specific height (e.g., h-[500px] or max-h-[60vh]).
               This keeps the header and footer fixed while the content scrolls.
            */}
            <ScrollArea className="h-[500px] w-full px-6 py-2">
              <div className="space-y-4 pr-4">
                
                {/* Customer Select */}
                <FormField
  control={form.control}
  name="customer_id"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Customer *</FormLabel>

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


                {/* Source Select */}
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Craigslist">Craigslist</SelectItem>
                          <SelectItem value="Kijiji">Kijiji</SelectItem>
                          <SelectItem value="Website">Website</SelectItem>
                          <SelectItem value="Text Us">Text Us</SelectItem>
                          <SelectItem value="Referral">Referral</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status Select */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Qualified">Qualified</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                          <SelectItem value="Lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Interested Vehicle Input */}
                <FormField
  control={form.control}
  name="interest_vehicle_id"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Interested Vehicle</FormLabel>

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

          {vehicles.map((v:any) => (
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
{/* klkk */}


                {/* Assigned To Select */}
                <FormField
  control={form.control}
  name="assigned_to"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Assigned To</FormLabel>

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
         
          <SelectItem value="unassigned">
            Auto-assign later
          </SelectItem>

          
          {!isUsersLoading && users.length === 0 && (
            <SelectItem value="no-users" disabled>
              No users found
            </SelectItem>
          )}

         
          {staffUsers.map((user: User ) => (
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


                {/* Notes Textarea */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional details..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2 pt-6">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
 <Button
  type="submit"
  disabled={isSubmitting}
>
  {isSubmitting ? "Saving..." : "Save Lead"}
</Button>

          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}