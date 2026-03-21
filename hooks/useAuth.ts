import { UserSchemaType } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/* ============================================================================
   Types
============================================================================ */

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'Admin' | 'Staff' | 'Manager';
  full_name: string;
}

/* ============================================================================
   API FUNCTIONS
============================================================================ */

// Login
async function loginAPI(data: LoginFormData): Promise<AuthUser> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Login failed');
  }

  return result.user;
}

// Logout
async function logoutAPI(): Promise<{ success: true }> {
  const response = await fetch('/api/auth', {
    method: 'DELETE',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Logout failed');
  }

  return result;
}

// Get current user
async function fetchCurrentUser(): Promise<UserSchemaType | null> {
  const response = await fetch('/api/user/me');


  if (!response.ok) return null;

  const result = await response.json();
  console.log(result);
  
  return result;
}

/* ============================================================================
   QUERY KEYS
============================================================================ */

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

/* ============================================================================
   QUERIES
============================================================================ */

// Current logged-in user
export function useCurrentUser() {
  return useQuery<UserSchemaType | null, Error>({
    queryKey: authKeys.user(),
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 10, // 10 min
    retry: false,
  });
}

/* ============================================================================
   MUTATIONS
============================================================================ */

// Login
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<
    AuthUser,        // TData
    Error,           // TError
    LoginFormData    // TVariables
  >({
    mutationFn: loginAPI,

    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user(), user);
    },

    onError: (_err, _newLead, context) => {
     
    },
  });
}

// Logout
export function useLogout() {
  const router= useRouter()
  const queryClient = useQueryClient();

  return useMutation<
    { success: true }, // TData
    Error,             // TError
    void               // TVariables
  >({
    mutationFn: logoutAPI,

    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.clear(); // 🔥 clears all cached protected data
      router.push('/login')
    },
  });
}
