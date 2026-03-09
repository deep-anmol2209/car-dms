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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvoiceCustomer, InvoiceVehicle, InvoiceFormValues } from '@/types/invoice';
import { Skeleton } from '@/components/ui/skeleton';

interface CustomerVehicleSelectProps {
  control: Control<InvoiceFormValues>;
  customers: InvoiceCustomer[] | undefined;
  vehicles: InvoiceVehicle[] | undefined;
  isLoadingCustomers: boolean;
  isLoadingVehicles: boolean;
  onVehicleChange?: (vehicle: InvoiceVehicle | undefined) => void;
}

export function CustomerVehicleSelect({
  control,
  customers,
  vehicles,
  isLoadingCustomers,
  isLoadingVehicles,
  onVehicleChange,
}: CustomerVehicleSelectProps) {
  const activeVehicles = vehicles?.filter((v) => v.status === 'Active') || [];

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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle (Optional)</FormLabel>
              {isLoadingVehicles ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={field.value || undefined}
                  onValueChange={(value) => {
                    field.onChange(value);
                    const vehicle = activeVehicles.find((v) => v.id === value);
                    onVehicleChange?.(vehicle);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {activeVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model} - VIN:{' '}
                        {vehicle.vin?.slice(-6)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}