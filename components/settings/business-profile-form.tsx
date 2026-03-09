'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BusinessProfileFormData,  } from '@/lib/validations/settings';
import { useEffect, useState } from 'react';
import { BusinessProfile, BusinessProfileInput, businessProfileSchema } from '@/types/businessProfile';

export function BusinessProfileForm({ initialData, onSubmit }: {

  
  initialData?: Partial<BusinessProfileInput>;
  onSubmit: (data: BusinessProfileInput) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<BusinessProfileInput>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: initialData || {
      business_name: '',
      street_address: '',
      city: '',
      state: '',
      zip: '',
      dealer_license:'',
      phone: '',
      email: '',
    }

  });
  const handleSubmit = (data: BusinessProfileInput) => {
    console.log("Submitting:", data);
    onSubmit(data);
  };
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);
  return (
    <Form {...form}>
      <form  onSubmit={form.handleSubmit(
    handleSubmit,
    (errors) => {
      console.log("Validation errors:", errors);
    }
  )} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="street_address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP/Postal Code</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={!isEditing}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tax_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID / EIN</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="12-3456789" disabled={!isEditing}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* <FormField
            control={form.control}
            name="business_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Registration Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          
          <FormField
            control={form.control}
            name="dealer_license"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dealer License Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-3">

{!isEditing && (
  <Button type="button" onClick={() => setIsEditing(true)}>
    Edit Business Profile
  </Button>
)}

{isEditing && (
  <>
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        form.reset(initialData);
        setIsEditing(false);
      }}
    >
      Cancel
    </Button>

    <Button type="submit">
      Save Changes
    </Button>
  </>
)}

</div>
      </form>
    </Form>
  );
}
