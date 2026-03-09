'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Vehicle, VehicleFormData } from '@/types/inventory';

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type CreateVehicleContext = {
  previousVehicles?: Vehicle[];
};

type UpdateVehicleContext = {
  previousVehicles?: Vehicle[];
};

type DeleteVehicleContext = {
  previousVehicles?: Vehicle[];
};

/* -------------------------------------------------------------------------- */
/*                                API CALLS                                   */
/* -------------------------------------------------------------------------- */

async function fetchVehicles(): Promise<Vehicle[]> {
  const res = await fetch('/api/inventory');

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch vehicles');
  }

  const { data } = await res.json();
  return data;
}

async function fetchVehicleById(id: string): Promise<Vehicle> {
  const res = await fetch(`/api/vehicle/${id}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch vehicle');
  }

  const { data } = await res.json();
  return data;
}

async function createVehicleAPI(data: VehicleFormData): Promise<Vehicle> {
  const res = await fetch('/api/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create vehicle');
  }

  const { data: vehicle } = await res.json();
  return vehicle;
}

async function updateVehicleAPI(
  id: string,
  data: Partial<VehicleFormData>
): Promise<Vehicle> {
  const res = await fetch(`/api/vehicle/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update vehicle');
  }

  const { data: vehicle } = await res.json();
  return vehicle;
}

async function deleteVehicleAPI(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/vehicle/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete vehicle');
  }

  return res.json();
}

/* -------------------------------------------------------------------------- */
/*                                 QUERY KEYS                                 */
/* -------------------------------------------------------------------------- */

export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  detail: (id: string) => [...vehicleKeys.all, 'detail', id] as const,
};

/* -------------------------------------------------------------------------- */
/*                                   QUERIES                                  */
/* -------------------------------------------------------------------------- */

export function useVehicles() {
  return useQuery<Vehicle[], Error>({
    queryKey: vehicleKeys.lists(),
    queryFn: fetchVehicles,
    staleTime: 1000 * 60 * 5,
  });
}

export function useVehicle(id: string) {
  return useQuery<Vehicle, Error>({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => fetchVehicleById(id),
    enabled: !!id,
  });
}

/* -------------------------------------------------------------------------- */
/*                                  CREATE                                    */
/* -------------------------------------------------------------------------- */

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation<
    Vehicle,
    Error,
    VehicleFormData,
    CreateVehicleContext
  >({
    mutationFn: createVehicleAPI,

    onMutate: async (newVehicle) => {
      await queryClient.cancelQueries({ queryKey: vehicleKeys.lists() });

      const previousVehicles =
        queryClient.getQueryData<Vehicle[]>(vehicleKeys.lists());

      if (previousVehicles) {
        const optimistic: Vehicle = {
          id: `temp-${Date.now()}`,
          ...newVehicle,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        queryClient.setQueryData<Vehicle[]>(
          vehicleKeys.lists(),
          [optimistic, ...previousVehicles]
        );
      }

      return { previousVehicles };
    },

    onError: (_err, _newVehicle, context) => {
      if (context?.previousVehicles) {
        queryClient.setQueryData(
          vehicleKeys.lists(),
          context.previousVehicles
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                                  UPDATE                                    */
/* -------------------------------------------------------------------------- */

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation<
    Vehicle,
    Error,
    { id: string; vehicle: Partial<VehicleFormData> },
    UpdateVehicleContext
  >({
    mutationFn: ({ id, vehicle }) => updateVehicleAPI(id, vehicle),

    onMutate: async ({ id, vehicle }) => {
      await queryClient.cancelQueries({ queryKey: vehicleKeys.lists() });

      const previousVehicles =
        queryClient.getQueryData<Vehicle[]>(vehicleKeys.lists());

      if (previousVehicles) {
        queryClient.setQueryData<Vehicle[]>(
          vehicleKeys.lists(),
          previousVehicles.map((v) =>
            v.id === id
              ? { ...v, ...vehicle, updated_at: new Date().toISOString() }
              : v
          )
        );
      }

      return { previousVehicles };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousVehicles) {
        queryClient.setQueryData(
          vehicleKeys.lists(),
          context.previousVehicles
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                                  DELETE                                    */
/* -------------------------------------------------------------------------- */

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    string,
    DeleteVehicleContext
  >({
    mutationFn: deleteVehicleAPI,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: vehicleKeys.lists() });

      const previousVehicles =
        queryClient.getQueryData<Vehicle[]>(vehicleKeys.lists());

      if (previousVehicles) {
        queryClient.setQueryData<Vehicle[]>(
          vehicleKeys.lists(),
          previousVehicles.filter((v) => v.id !== id)
        );
      }

      return { previousVehicles };
    },

    onError: (_err, _id, context) => {
      if (context?.previousVehicles) {
        queryClient.setQueryData(
          vehicleKeys.lists(),
          context.previousVehicles
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
}
