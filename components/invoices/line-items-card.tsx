/**
 * Line Items Card Component
 * Handles dynamic line item array with proper react-hook-form field array
 */

'use client';

import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { InvoiceFormValues } from '@/types/invoice';

interface LineItemsCardProps {
  control: Control<InvoiceFormValues>;
  watch: UseFormWatch<InvoiceFormValues>;
}

export function LineItemsCard({ control, watch }: LineItemsCardProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'line_items',
  });

  const handleAddLineItem = () => {
    append({
      description: '',
      quantity: 1,
      unit_price: 0,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Line Items</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No additional items. Click below to add.
          </p>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => {
              const quantity = watch(`line_items.${index}.quantity`) || 1;
              const unitPrice = watch(`line_items.${index}.unit_price`) || 0;
              const total = quantity * unitPrice;

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 items-start border-b pb-3 last:border-b-0"
                >
                  {/* Description */}
                  <div className="col-span-5">
                    <FormField
                      control={control}
                      name={`line_items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2">
                    <FormField
                      control={control}
                      name={`line_items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Qty"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 1)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-3">
                    <FormField
                      control={control}
                      name={`line_items.${index}.unit_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Price"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Total (calculated) + Delete */}
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      ${total.toFixed(2)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-8"
                    >
                      <TrashIcon className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={handleAddLineItem}
          className="w-full"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Line Item
        </Button>
      </CardContent>
    </Card>
  );
}