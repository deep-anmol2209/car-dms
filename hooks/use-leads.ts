'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Lead, LeadFormData, LeadView } from '@/types/leads';

/* -------------------------------------------------------------------------- */
/*                                   CONTEXTS                                 */
/* -------------------------------------------------------------------------- */

type CreateLeadContext = {
  previousLeads?: Lead[];
};

type UpdateLeadContext = {
  previousLeads?: Lead[];
  previousLead?: Lead;
};

type DeleteLeadContext = {
  previousLeads?: Lead[];
};

/* -------------------------------------------------------------------------- */
/*                                API FUNCTIONS                                */
/* -------------------------------------------------------------------------- */
async function fetchLeads(filters?: Record<string, any>): Promise<Lead[]> {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.status && filters.status !== "all")
    params.append("status", filters.status);
  if (filters?.source && filters.source !== "all")
    params.append("source", filters.source);

  const response = await fetch(`/api/leads?${params.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch leads");
  }

  return response.json();
}


async function fetchLeadById(id: string): Promise<LeadView> {
  const response = await fetch(`/api/leads/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch lead');
  }

  return response.json();
}

async function createLeadAPI(data: LeadFormData): Promise<Lead> {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create lead');
  }

  return response.json();
}

async function updateLeadAPI(
  id: string,
  data: Partial<LeadFormData>
): Promise<Lead> {
  const response = await fetch(`/api/leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update lead');
  }

  return response.json();
}

async function deleteLeadAPI(
  id: string
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/leads/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete lead');
  }

  return response.json(); // { success: true }
}

/* -------------------------------------------------------------------------- */
/*                                QUERY KEYS                                  */
/* -------------------------------------------------------------------------- */

export const leadKeys = {
  all: ['leads'] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
 list: (filters?: Record<string, any>) =>
  [...leadKeys.lists(), filters?.search, filters?.status, filters?.source] as const,

  details: () => [...leadKeys.all, 'detail'] as const,
  detail: (id: string) => [...leadKeys.details(), id] as const,
};

/* -------------------------------------------------------------------------- */
/*                                   QUERIES                                  */
/* -------------------------------------------------------------------------- */

// Get all leads
export function useLeads(filters?: Record<string, any>) {
  return useQuery<Lead[], Error>({
    queryKey: leadKeys.list(filters),
    queryFn: () => fetchLeads(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev, // 🔥 CRITICAL
  });
}




// Get lead by ID (cache-first)
export function useLead(id?: string) {
  const queryClient = useQueryClient();

  return useQuery<LeadView, Error>({
    queryKey: leadKeys.detail(id!),
    enabled: !!id,

    queryFn: () => fetchLeadById(id!), // 🔥 pure queryFn

    initialData: () => {
      if (!id) return undefined;

      const leads = queryClient.getQueryData<LeadView[]>(
        leadKeys.lists()
      );

      return leads?.find((l) => l.id === id);
    },

    staleTime: 1000 * 60 * 5,
  });
}


/* -------------------------------------------------------------------------- */
/*                                  MUTATIONS                                 */
/* -------------------------------------------------------------------------- */

// Create lead
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation<
    Lead,
    Error,
    LeadFormData,
    CreateLeadContext
  >({
    mutationFn: createLeadAPI,

    onMutate: async (newLead) => {
      await queryClient.cancelQueries({ queryKey: leadKeys.lists() });

      const previousLeads =
        queryClient.getQueryData<Lead[]>(leadKeys.lists());

      if (previousLeads) {
        const optimisticLead: Lead = {
          id: 'temp-' + Date.now(),
          ...newLead,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Lead;

        queryClient.setQueryData<Lead[]>(
          leadKeys.lists(),
          [optimisticLead, ...previousLeads]
        );
      }

      return { previousLeads };
    },

    onError: (_err, _newLead, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(
          leadKeys.lists(),
          context.previousLeads
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
    },
  });
}

// Update lead
export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation<
    Lead,
    Error,
    { id: string; data: Partial<LeadFormData> },
    UpdateLeadContext
  >({
    mutationFn: ({ id, data }) => updateLeadAPI(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: leadKeys.lists() });
      await queryClient.cancelQueries({ queryKey: leadKeys.detail(id) });

      const previousLeads =
        queryClient.getQueryData<Lead[]>(leadKeys.lists());
      const previousLead =
        queryClient.getQueryData<Lead>(leadKeys.detail(id));

      if (previousLeads) {
        queryClient.setQueryData<Lead[]>(
          leadKeys.lists(),
          previousLeads.map((l) =>
            l.id === id
              ? { ...l, ...data, updated_at: new Date().toISOString() }
              : l
          )
        );
      }

      if (previousLead) {
        queryClient.setQueryData<Lead>(
          leadKeys.detail(id),
          {
            ...previousLead,
            ...data,
            updated_at: new Date().toISOString(),
          }
        );
      }

      return { previousLeads, previousLead };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Lead>(
        leadKeys.detail(data.id),
        data
      );
    
      const leads = queryClient.getQueryData<Lead[]>(leadKeys.lists());
      if (leads) {
        queryClient.setQueryData<Lead[]>(
          leadKeys.lists(),
          leads.map((l) => (l.id === data.id ? data : l))
        );
      }
    },
    onError: (_err, { id }, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(
          leadKeys.lists(),
          context.previousLeads
        );
      }
      if (context?.previousLead) {
        queryClient.setQueryData(
          leadKeys.detail(id),
          context.previousLead
        );
      }
    },

    onSettled: (_d, _e, variables) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: leadKeys.detail(variables.id),
      });
    },
  });
}

// Delete lead
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    string,
    DeleteLeadContext
  >({
    mutationFn: deleteLeadAPI,

    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: leadKeys.lists() });

      const previousLeads =
        queryClient.getQueryData<Lead[]>(leadKeys.lists());

      if (previousLeads) {
        queryClient.setQueryData<Lead[]>(
          leadKeys.lists(),
          previousLeads.filter((l) => l.id !== deletedId)
        );
      }

      return { previousLeads };
    },

    onError: (_err, _id, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(
          leadKeys.lists(),
          context.previousLeads
        );
      }
    },

    onSuccess: (_data, deletedId) => {
      queryClient.removeQueries({
        queryKey: leadKeys.detail(deletedId),
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
    },
  });
}
