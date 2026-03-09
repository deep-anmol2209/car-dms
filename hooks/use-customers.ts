'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Customer, CustomerFormData } from '@/types/customers';

/* -------------------------------------------------------------------------- */
/*                                API FUNCTIONS                                */
/* -------------------------------------------------------------------------- */

async function fetchCustomers({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}={}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  const response = await fetch(`/api/customers?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch customers");
  }

  return response.json();
}


async function fetchCustomerById(id: string): Promise<Customer> {
  const response = await fetch(`/api/customers/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch customer');
  }

  const data = await response.json();
  return data;
}

async function createCustomerAPI(
  customer: CustomerFormData
): Promise<Customer> {
  const response = await fetch('/api/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create customer');
  }

  const { data } = await response.json();
  return data;
}

async function updateCustomerAPI(
  id: string,
  customer: Partial<CustomerFormData>
): Promise<Customer> {
  const response = await fetch(`/api/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update customer');
  }

  const { data } = await response.json();
  return data;
}

async function deleteCustomerAPI(
  id: string
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/customers/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete customer');
  }

  return response.json();
}

/* -------------------------------------------------------------------------- */
/*                                QUERY KEYS                                   */
/* -------------------------------------------------------------------------- */

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) =>
    [...customerKeys.lists(), { filters }] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

/* -------------------------------------------------------------------------- */
/*                                   QUERIES                                   */
/* -------------------------------------------------------------------------- */

// Get all customers
export function useCustomers(filters?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => fetchCustomers(filters),
    placeholderData: (prevData) => prevData,
    staleTime: 1000 * 60 * 5,
  });
}


// Get customer by ID
export function useCustomer(id: string) {
  return useQuery<Customer, Error>({
    queryKey: customerKeys.detail(id),
    queryFn: () => fetchCustomerById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/* -------------------------------------------------------------------------- */
/*                                  MUTATIONS                                  */
/* -------------------------------------------------------------------------- */

// Create customer
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation<Customer, Error, CustomerFormData>({
    mutationFn: createCustomerAPI,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

// Update customer
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation<
    Customer,
    Error,
    { id: string; customer: Partial<CustomerFormData> }
  >({
    mutationFn: ({ id, customer }) => updateCustomerAPI(id, customer),

    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        customerKeys.detail(variables.id),
        data
      );

      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

// Delete customer
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: deleteCustomerAPI,

    onSuccess: (_data, id) => {
      queryClient.removeQueries({
        queryKey: customerKeys.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}
