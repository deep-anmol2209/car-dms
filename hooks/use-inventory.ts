'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Vehicle, VehicleFormData } from '@/types/inventory';

/* -------------------------------------------------------------------------- */
/*                                  CONTEXTS                                  */
/* -------------------------------------------------------------------------- */

type CreateInventoryContext = {
  previousInventory?: Vehicle[];
};

type UpdateInventoryContext = {
  previousInventory?: Vehicle[];
  previousVehicle?: Vehicle;
};

type DeleteInventoryContext = {
  previousInventory?: Vehicle[];
};

/* -------------------------------------------------------------------------- */
/*                                API FUNCTIONS                                */
/* -------------------------------------------------------------------------- */

interface InventoryFilters {
  search?: string;
  status?: string;
  year?: number;
  make?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

interface InventoryResponse {
  data: Vehicle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function fetchInventory(
  filters?: InventoryFilters
): Promise<InventoryResponse> {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.sort) params.append("sort", filters.sort);
  if(filters?.year) params.append("year", filters.year.toString());
  if(filters?.make) params.append("make", filters.make);

  const response = await fetch(`/api/inventory?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch inventory");
  }

  return response.json();
}


async function fetchInventoryById(id: string): Promise<Vehicle> {
  const response = await fetch(`/api/inventory/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch vehicle');
  }

  const { data } = await response.json();
  return data;
}

async function createInventoryAPI(
  vehicleData: VehicleFormData
): Promise<Vehicle> {
  const response = await fetch('/api/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicleData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create vehicle');
  }

  const { data } = await response.json();
  return data;
}

async function updateInventoryAPI(
  id: string,
  vehicleData: Partial<VehicleFormData>
): Promise<Vehicle> {
  const response = await fetch(`/api/inventory/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicleData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update vehicle');
  }

  const { data } = await response.json();
  return data;
}

async function deleteInventoryAPI(
  id: string
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/inventory/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete vehicle');
  }

  return response.json();
}

/* -------------------------------------------------------------------------- */
/*                                QUERY KEYS                                   */
/* -------------------------------------------------------------------------- */

export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) =>
    [...inventoryKeys.lists(), { filters }] as const,
  details: () => [...inventoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};

/* -------------------------------------------------------------------------- */
/*                                   QUERIES                                   */
/* -------------------------------------------------------------------------- */

// Get all inventory
export function useInventory(filters?: InventoryFilters) {
  return useQuery<InventoryResponse, Error>({
    queryKey: inventoryKeys.list(filters),
    queryFn: () => fetchInventory(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}



// Get vehicle by ID
export function useInventoryItem(id: string) {
  return useQuery<Vehicle, Error>({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => fetchInventoryById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/* -------------------------------------------------------------------------- */
/*                                  MUTATIONS                                  */
/* -------------------------------------------------------------------------- */

// Create vehicle
export function useCreateInventory() {
  const queryClient = useQueryClient();

  return useMutation<
    Vehicle,
    Error,
    VehicleFormData,
    CreateInventoryContext
  >({
    mutationFn: createInventoryAPI,

    onMutate: async (newVehicle) => {
      await queryClient.cancelQueries({ queryKey: inventoryKeys.lists() });

      const previousInventory =
        queryClient.getQueryData<Vehicle[]>(inventoryKeys.lists()) || [];

      const optimisticVehicle: Vehicle = {
        id: 'temp-' + Date.now(),
        ...newVehicle,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Vehicle;

      queryClient.setQueryData<Vehicle[]>(
        inventoryKeys.lists(),
        [optimisticVehicle, ...previousInventory]
      );

      return { previousInventory };
    },

    onSuccess: (data) => {
      queryClient.setQueryData<Vehicle[]>(
        inventoryKeys.lists(),
        (old = []) =>
          old.map(v => v.id.startsWith('temp-') ? data : v)
      );
    },
    onError: (_err, _newVehicle, context) => {
      if (context?.previousInventory) {
        queryClient.setQueryData(
          inventoryKeys.lists(),
          context.previousInventory
        );
      }
    },

    onSettled: () => {
     queryClient.invalidateQueries({
  queryKey: inventoryKeys.all,
});

    },
  });
}

// Update vehicle
export function useUpdateInventory() {
  const queryClient = useQueryClient();

  return useMutation<
    Vehicle,
    Error,
    { id: string; vehicle: Partial<VehicleFormData> },
    UpdateInventoryContext
  >({
    mutationFn: ({ id, vehicle }) => updateInventoryAPI(id, vehicle),

    onMutate: async ({ id, vehicle }) => {
      await queryClient.cancelQueries({ queryKey: inventoryKeys.lists() });
      await queryClient.cancelQueries({
        queryKey: inventoryKeys.detail(id),
      });

      const previousInventory =
        queryClient.getQueryData<Vehicle[]>(inventoryKeys.lists());
      const previousVehicle =
        queryClient.getQueryData<Vehicle>(inventoryKeys.detail(id));

      if (previousInventory) {
        queryClient.setQueryData<Vehicle[]>(
          inventoryKeys.lists(),
          previousInventory.map((v) =>
            v.id === id
              ? { ...v, ...vehicle, updated_at: new Date().toISOString() }
              : v
          )
        );
      }

      if (previousVehicle) {
        queryClient.setQueryData<Vehicle>(
          inventoryKeys.detail(id),
          {
            ...previousVehicle,
            ...vehicle,
            updated_at: new Date().toISOString(),
          }
        );
      }

      return { previousInventory, previousVehicle };
    },

    onError: (_err, { id }, context) => {
      if (context?.previousInventory) {
        queryClient.setQueryData(
          inventoryKeys.lists(),
          context.previousInventory
        );
      }
      if (context?.previousVehicle) {
        queryClient.setQueryData(
          inventoryKeys.detail(id),
          context.previousVehicle
        );
      }
    },

    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        inventoryKeys.detail(variables.id),
        data
      );

      const inventory =
        queryClient.getQueryData<Vehicle[]>(inventoryKeys.lists());

      if (inventory) {
        queryClient.setQueryData<Vehicle[]>(
          inventoryKeys.lists(),
          inventory.map((v) => (v.id === variables.id ? data : v))
        );
      }
    },

    onSettled: (_d, _e, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(variables.id),
      });
    },
  });
}

// Delete vehicle
export function useDeleteInventory() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { id: string },
    DeleteInventoryContext
  >({
    mutationFn: ({ id }) => deleteInventoryAPI(id),

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: inventoryKeys.lists() });

      const previousInventory =
        queryClient.getQueryData<Vehicle[]>(inventoryKeys.lists());

      if (previousInventory) {
        queryClient.setQueryData<Vehicle[]>(
          inventoryKeys.lists(),
          previousInventory.filter((v) => v.id !== id)
        );
      }

      return { previousInventory };
    },

    onError: (_err, _id, context) => {
      if (context?.previousInventory) {
        queryClient.setQueryData(
          inventoryKeys.lists(),
          context.previousInventory
        );
      }
    },

    onSuccess: (_data, { id }) => {
      queryClient.removeQueries({
        queryKey: inventoryKeys.detail(id),
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                              CLIENT FILTERING                               */
/* -------------------------------------------------------------------------- */

// export function useFilteredInventory(filters?: {
//   search?: string;
//   status?: Vehicle['status'];
//   make?: string;
// }) {
//   const { data: inventory, ...rest } = useInventory();

//   const filteredInventory = inventory?.filter((v) => {
//     if (filters?.search) {
//       const s = filters.search.toLowerCase();
//       if (
//         !v.vin.toLowerCase().includes(s) &&
//         !v.stock_number?.toLowerCase().includes(s)
//       ) {
//         return false;
//       }
//     }

//     if (filters?.status && v.status !== filters.status) return false;
//     if (filters?.make && v.make !== filters.make) return false;

//     return true;
//   });

//   return { data: filteredInventory, ...rest };
// }
