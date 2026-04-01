/**
 * Customer & Vehicle Selection Component
 * Uses shadcn Select instead of native HTML select
 */

'use client';

import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvoiceCustomer, InvoiceVehicle, InvoiceFormValues } from '@/types/invoice';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

interface CustomerVehicleSelectProps {
  control: Control<InvoiceFormValues>;
  customers: InvoiceCustomer[] | undefined;
  vehicles: InvoiceVehicle[] | undefined;
  isLoadingCustomers: boolean;
  isLoadingVehicles: boolean;
  onVehicleChange?: (vehicle: InvoiceVehicle | undefined) => void;
  onSearch?: (value: string) => void; // 👈 ADD THIS
}

export function CustomerVehicleSelect({
  control,
  customers,
  vehicles,
  isLoadingCustomers,
  isLoadingVehicles,
  onVehicleChange,
  onSearch
}: CustomerVehicleSelectProps) {
  const activeVehicles = vehicles?.filter((v) => v.status === 'Active') || [];
  const [localSearch, setLocalSearch] = useState("");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer & Vehicle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Select */}
        <FormField
          control={control}
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              {isLoadingCustomers ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers?.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vehicle Select */}
        <FormField
  control={control}
  name="vehicle_id"
  render={({ field }) => {
    const selected = activeVehicles.find(v => v.id === field.value);

    return (
      <FormItem>
        <FormLabel>Vehicle (Optional)</FormLabel>

        {isLoadingVehicles ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" className="w-full justify-between">
                  {selected
                    ? `${selected.year} ${selected.make} ${selected.model}`
                    : "Select a vehicle"}
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent
  side="bottom"
  align="start"
  sideOffset={4}
  className="w-[--radix-popover-trigger-width] p-0"
>
            <Command shouldFilter={false}>
  <CommandInput
    placeholder="Search vehicle..."
    value={localSearch}
    onValueChange={(val) => {
      setLocalSearch(val);
      onSearch?.(val);
    }}
  />

  <CommandList className="max-h-60 overflow-y-auto">
    <CommandEmpty>No vehicle found</CommandEmpty>

    {activeVehicles.map((vehicle) => (
      <CommandItem
        key={vehicle.id}
        onSelect={() => {
          field.onChange(vehicle.id);
          onVehicleChange?.(vehicle);
        }}
      >
        {vehicle.year} {vehicle.make} {vehicle.model}
      </CommandItem>
    ))}
  </CommandList>
</Command>
            </PopoverContent>
          </Popover>
        )}

        <FormMessage />
      </FormItem>
    );
  }}
/>
      </CardContent>
    </Card>
  );
}