'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import { createPayment } from '@/lib/actions/financialTransaction';
import { CreateFinancialTransactionPayload } from '@/types/invoice';

/* ===============================
   Validation Schema
================================ */

const paymentSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  category: z.enum(['Sold', 'Warranty', 'Insurance']),
  paymentMethod: z.enum(['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque']),
  transactionDate: z.date(),
  referenceId: z.string().optional(),
  description: z.string().optional(),
});

type AddPaymentFormValues = z.infer<typeof paymentSchema>;

/* ===============================
   Props
================================ */

interface AddPaymentModalProps {
  onSubmit: (data: CreateFinancialTransactionPayload) => void;
  open: boolean;
  onClose: () => void;

  invoiceId: string;
  invoiceNumber: string;
  outstandingAmount: number;
}

/* ===============================
   Component
================================ */

export function AddPaymentModal({
  onSubmit,
  open,
  onClose,
  invoiceId,
  invoiceNumber,
  outstandingAmount,
}: AddPaymentModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<AddPaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: outstandingAmount,
      category: 'Sold',
      paymentMethod: 'Cash',
      transactionDate: new Date(),
      referenceId: '',
      description: '',
    },
  });

  /* ===============================
     Mutation
  ================================ */

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: AddPaymentFormValues) => {
      return createPayment({
        invoice_id: invoiceId,
        amount: values.amount,
        category: values.category,
        payment_method: values.paymentMethod,
        transaction_date: values.transactionDate.toISOString(),
        reference_id: values.referenceId || null,
        description: values.description || null,
      });
    },
    onSuccess: () => {
      toast.success('Payment recorded successfully');

      // Refresh invoices + transactions
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({
        queryKey: ['financial-transactions', invoiceId],
      });

      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to record payment');
    },
  });

  const paymentMethod = form.watch('paymentMethod');

  /* ===============================
     UI
  ================================ */
console.log('PAYMENT MODAL', { open, onClose, invoiceId, invoiceNumber, outstandingAmount });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
          <DialogDescription>
            Invoice{' '}
            <span className="font-mono font-semibold">
              {invoiceNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Outstanding Summary */}
        <div className="rounded-lg border bg-slate-50 px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Outstanding</span>
            <span className="font-semibold">
              ₹{outstandingAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit((values) => mutate(values))}
          className="space-y-4"
        >
          {/* Amount */}
          <div>
            <label className="text-sm font-medium">
              Payment Amount
            </label>
            <Input
              type="number"
              step="0.01"
              {...form.register('amount', { valueAsNumber: true })}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium">
              Payment Category
            </label>
            <Select
              value={form.watch('category')}
              onValueChange={(value) =>
                form.setValue('category', value as AddPaymentFormValues['category'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sold">Vehicle Sale</SelectItem>
                <SelectItem value="Warranty">Warranty</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm font-medium">
              Payment Method
            </label>
            <Select
              value={paymentMethod}
              onValueChange={(value) =>
                form.setValue('paymentMethod', value as any)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Bank Transfer">
                  Bank Transfer
                </SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Date */}
          <div>
            <label className="text-sm font-medium">
              Payment Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !form.watch('transactionDate') &&
                      'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(
                    form.watch('transactionDate'),
                    'PPP'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.watch('transactionDate')}
                  onSelect={(date) =>
                    date &&
                    form.setValue('transactionDate', date)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Reference ID */}
          {paymentMethod !== 'Cash' && (
            <div>
              <label className="text-sm font-medium">
                Reference ID
              </label>
              <Input
                placeholder="UTR / Transaction ID"
                {...form.register('referenceId')}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              rows={3}
              {...form.register('description')}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
