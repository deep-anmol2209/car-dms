'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceKeys } from '@/lib/query-keys/invoice';
import {
  InvoiceWithRelations,
  CreateInvoicePayload,
  UpdateInvoicePayload,
  InvoiceListResponse,
  PrintInvoice,
} from '@/types/invoice';

/* ============================================================================
   API helpers
   ============================================================================ */

async function fetchInvoices(filters?: {
  search?: string;
  status?: string;
}): Promise<InvoiceListResponse> {

  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.status && filters.status !== "all")
    params.append("status", filters.status);

  const res = await fetch(`/api/invoice?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch invoices");
  }

  return res.json();
}


async function fetchInvoiceById(id: string): Promise<PrintInvoice> {
  const res = await fetch(`/api/invoice/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch invoice');
  }

  return res.json();
}

async function createInvoiceApi(payload: CreateInvoicePayload) {
  const res = await fetch('/api/invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to create invoice');
  }

  return res.json();
}

async function updateInvoiceApi(id: string, payload: UpdateInvoicePayload) {
  const res = await fetch(`/api/invoices/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to update invoice');
  }

  return res.json();
}

async function deleteInvoiceApi(id: string) {
  const res = await fetch(`/api/invoices/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete invoice');
  }

  return true;
}

async function markInvoicePaidApi(id: string) {
  const res = await fetch(`/api/invoices/${id}/pay`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Failed to mark invoice as paid');
  }

  return true;
}

/* ============================================================================
   QUERIES
   ============================================================================ */

export function useInvoices(filters?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<InvoiceListResponse, Error>({
    queryKey: invoiceKeys.list(filters), // 🔥 important
    queryFn: () => fetchInvoices(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev, // prevents flicker
  });
}


export function useInvoice(id: string) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => fetchInvoiceById(id),
    enabled: !!id,
  });
}

/* ============================================================================
   MUTATIONS
   ============================================================================ */

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
}

export function useUpdateInvoice(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateInvoicePayload) =>
      updateInvoiceApi(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvoiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
}

export function useMarkInvoicePaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markInvoicePaidApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
}
