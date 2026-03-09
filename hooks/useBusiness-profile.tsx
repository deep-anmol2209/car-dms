'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  BusinessProfile,
  BusinessProfileInput,
} from '@/types/businessProfile';

/* -------------------------------------------------------------------------- */
/*                                API FUNCTIONS                                */
/* -------------------------------------------------------------------------- */

async function fetchBusinessProfile(): Promise<BusinessProfile> {
  const response = await fetch('/api/business-profile', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch business profile');
  }

  return response.json();
}

async function createBusinessProfileAPI(
  profile: BusinessProfileInput
): Promise<BusinessProfile> {
  const response = await fetch('/api/business-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create business profile');
  }

  const { profile: data } = await response.json();
  return data;
}

async function updateBusinessProfileAPI(
  id: string,
  profile: Partial<BusinessProfileInput>
): Promise<BusinessProfile> {
  const response = await fetch('/api/business-profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...profile }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update business profile');
  }

  const { data } = await response.json();
  return data;
}

async function deleteBusinessProfileAPI(
  id: string
): Promise<{ success: boolean }> {
  const response = await fetch('/api/business-profile', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete business profile');
  }

  return response.json();
}

/* -------------------------------------------------------------------------- */
/*                                QUERY KEYS                                   */
/* -------------------------------------------------------------------------- */

export const businessProfileKeys = {
  all: ['business-profile'] as const,
  detail: () => [...businessProfileKeys.all, 'detail'] as const,
};

/* -------------------------------------------------------------------------- */
/*                                   QUERIES                                   */
/* -------------------------------------------------------------------------- */

// Get business profile
export function useBusinessProfile() {
  return useQuery({
    queryKey: businessProfileKeys.detail(),
    queryFn: fetchBusinessProfile,
    staleTime: 1000 * 60 * 10,
  });
}

/* -------------------------------------------------------------------------- */
/*                                  MUTATIONS                                  */
/* -------------------------------------------------------------------------- */

// Create business profile
export function useCreateBusinessProfile() {
  const queryClient = useQueryClient();

  return useMutation<BusinessProfile, Error, BusinessProfileInput>({
    mutationFn: createBusinessProfileAPI,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: businessProfileKeys.all,
      });
    },
  });
}

// Update business profile
export function useUpdateBusinessProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    BusinessProfile,
    Error,
    { id: string; profile: Partial<BusinessProfileInput> }
  >({
    mutationFn: ({ id, profile }) => updateBusinessProfileAPI(id, profile),

    onSuccess: (data) => {
      queryClient.setQueryData(businessProfileKeys.detail(), data);
    },
  });
}

// Delete business profile
export function useDeleteBusinessProfile() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: deleteBusinessProfileAPI,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: businessProfileKeys.all,
      });
    },
  });
}