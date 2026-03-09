import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TestDrive,TestDriveFormValues, TestDriveWithRelations, EndTestDriveValues } from '@/types/testDrive';

/* ----------------------------- Context Types ----------------------------- */

type CreateTestDriveContext = {
  previousTestDrives?: TestDrive[];
};

type UpdateTestDriveContext = {
  previousTestDrives?: TestDrive[];
  previousTestDrive?: TestDrive;
};

type DeleteTestDriveContext = {
  previousTestDrives?: TestDrive[];
};

/* ----------------------------- API Functions ----------------------------- */

async function fetchTestDrives(filters?: Record<string, any>) {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.status && filters.status !== "all")
    params.append("status", filters.status);

  const res = await fetch(`/api/test-drives?${params.toString()}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch test drives");
  }

  const { data } = await res.json();
  return data;
}




async function fetchTestDriveById(id: string): Promise<TestDriveWithRelations> {
  const res = await fetch(`/api/test-drives/${id}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch test drive');
  }

  const { data } = await res.json();
  return data;
}

async function createTestDriveAPI(
  payload: TestDriveFormValues
): Promise<TestDrive> {
  const res = await fetch('/api/test-drives', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create test drive');
  }

  const { data } = await res.json();
  return data;
}

async function patchTestDriveAPI(
  id: string,
  payload: Partial<TestDriveFormValues>
): Promise<TestDrive> {
  const res = await fetch(`/api/test-drives/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update test drive');
  }

  const { data } = await res.json();
  return data;
}

async function deleteTestDriveAPI(
  id: string
): Promise<{ success: boolean }> {
  const res = await fetch(`/api/test-drives/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete test drive');
  }

  return res.json();
}

/* ----------------------------- Query Keys ----------------------------- */

export const testDriveKeys = {
  all: ['test-drives'] as const,
  lists: () => [...testDriveKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) =>
    [...testDriveKeys.lists(), { filters }] as const,
  details: () => [...testDriveKeys.all, 'detail'] as const,
  detail: (id: string) => [...testDriveKeys.details(), id] as const,
};

/* ----------------------------- Queries ----------------------------- */

// Get all test drives
export function useTestDrives(filters?: Record<string, any>) {
  return useQuery({
    queryKey: testDriveKeys.list(filters),
    queryFn: () => fetchTestDrives(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev, // 🔥 prevents flicker
  });
}

// Get test drive by ID
export function useTestDrive(id: string) {
  return useQuery<TestDriveWithRelations, Error>({
    queryKey: testDriveKeys.detail(id),
    queryFn: () => fetchTestDriveById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/* ----------------------------- Mutations ----------------------------- */

// Create test drive
export function useCreateTestDrive() {
  const queryClient = useQueryClient();

  return useMutation<TestDrive, Error, TestDriveFormValues>({
    mutationFn: createTestDriveAPI,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testDriveKeys.lists() });
    },
  });
}

// Update test drive
export function usePatchTestDrive() {
  const queryClient = useQueryClient();

  return useMutation<
    TestDrive,
    Error,
    { id: string; data: Partial<TestDriveFormValues> }
  >({
    mutationFn: ({ id, data }) =>
      patchTestDriveAPI(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: testDriveKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: testDriveKeys.lists(),
      });
    },
  });
}


// Delete test drive
export function useDeleteTestDrive() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    string,
    DeleteTestDriveContext
  >({
    mutationFn: deleteTestDriveAPI,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: testDriveKeys.lists() });

      const previousTestDrives =
        queryClient.getQueryData<TestDrive[]>(testDriveKeys.lists());

      if (previousTestDrives) {
        queryClient.setQueryData<TestDrive[]>(
          testDriveKeys.lists(),
          previousTestDrives.filter((d) => d.id !== id)
        );
      }

      return { previousTestDrives };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previousTestDrives) {
        queryClient.setQueryData(
          testDriveKeys.lists(),
          ctx.previousTestDrives
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: testDriveKeys.lists() });
    },
  });
}
