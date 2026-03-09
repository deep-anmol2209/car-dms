

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPayment, getFinancialTransactions } from '@/lib/actions/financialTransaction';
import { CreatePaymentPayload } from '@/lib/actions/financialTransaction';
import { toast } from 'react-hot-toast';
import { FinancialTransaction } from '@/types/invoice';

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) =>
      createPayment(payload),

    onSuccess: () => {
      toast.success('Payment recorded successfully');

      // Refresh everything affected
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['sales-deals'] });
    },

    onError: (err: any) => {
      toast.error(err?.message ?? 'Failed to record payment');
    },
  });
}

export function useFinancialTransactions(invoiceId?: string) {
  return useQuery<FinancialTransaction[]>({
    queryKey: ['financial-transactions', invoiceId],
    queryFn: () => getFinancialTransactions(invoiceId),
    enabled: invoiceId !== undefined, // allow optional usage
  });
}