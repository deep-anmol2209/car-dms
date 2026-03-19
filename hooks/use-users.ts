// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { createClient } from '@/lib/supabase/client';
// import { UserFormData } from '@/lib/validations/user';

// function getSupabase() {
//   return createClient();
// }

// export function useUsers() {
//   return useQuery({
//     queryKey: ['users'],
//     queryFn: async () => {
//       const supabase = getSupabase();
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .order('created_at', { ascending: false });
      
//       if (error) throw error;
//       return data;
//     }
//   });
// }

// export function useCreateUser() {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: async (user: UserFormData) => {
//       const supabase = getSupabase();
//       const { data, error } = await supabase
//         .from('users')
//         .insert({
//           ...user,
//           start_date: user.start_date.toISOString().split('T')[0],
//         });
      
//       if (error) throw error;
//       return data;
//     },
//     onMutate: async (newUser) => {
//       await queryClient.cancelQueries({ queryKey: ['users'] });
      
//       const previousUsers = queryClient.getQueryData(['users']) || [];
//       queryClient.setQueryData(['users'], (old: any) => [newUser, ...old]);
      
//       return { previousUsers };
//     },
//     onError: (err, newUser, context) => {
//       queryClient.setQueryData(['users'], context?.previousUsers);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     }
//   });
// }

// export function useUpdateUser() {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: async ({ id, user }: { id: string; user: Partial<UserFormData> }) => {
//       const supabase = getSupabase();
//       const { data, error } = await supabase
//         .from('users')
//         .update({
//           ...user,
//           start_date: user.start_date?.toISOString().split('T')[0],
//         })
//         .eq('id', id);
      
//       if (error) throw error;
//       return data;
//     },
//     onMutate: async ({ id, user }) => {
//       await queryClient.cancelQueries({ queryKey: ['users'] });
      
//       const previousUsers = queryClient.getQueryData(['users']);
//       queryClient.setQueryData(['users'], (old: any) => 
//         old.map((u: any) => u.id === id ? { ...u, ...user } : u)
//       );
      
//       return { previousUsers };
//     },
//     onError: (err, variables, context) => {
//       queryClient.setQueryData(['users'], context?.previousUsers);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     }
//   });
// }

// export function useDeleteUser() {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: async (id: string) => {
//       const supabase = getSupabase();
//       const { error } = await supabase
//         .from('users')
//         .delete()
//         .eq('id', id);
      
//       if (error) throw error;
//     },
//     onMutate: async (id) => {
//       await queryClient.cancelQueries({ queryKey: ['users'] });
      
//       const previousUsers = queryClient.getQueryData(['users']);
//       queryClient.setQueryData(['users'], (old: any) => 
//         old.filter((u: any) => u.id !== id)
//       );
      
//       return { previousUsers };
//     },
//     onError: (err, variables, context) => {
//       queryClient.setQueryData(['users'], context?.previousUsers);
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     }
//   });
// }


import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserFormData, User } from '@/types/user';
import { PersonalProfileFormData } from '@/types/personalProfile';

type CreateUserContext = {
  previousUsers?: User[];
};

type UpdateUserContext = {
  previousUsers?: User[];
  previousUser?: User;
};

type DeleteUserContext = {
  previousUsers?: User[];
};

// API functions
async function fetchUsers({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  const response = await fetch(`/api/user?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch users");
  }

  return response.json();
}

async function fetchAssignableUsers() {
  const response = await fetch("/api/user/assignable");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch assignable users");
  }

  return response.json();
}
async function fetchUserById(id: string): Promise<User> {
  const response = await fetch(`/api/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user');
  }

  const { data } = await response.json();
  return data;
}

async function createUserAPI(userData: UserFormData): Promise<User> {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create user');
  }

  const { data } = await response.json();
  return data;
}

async function updateUserAPI(id: string, userData: Partial<UserFormData>): Promise<User> {
  const response = await fetch(`/api/user/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user');
  }

  const { data } = await response.json();
  return data;
}

async function updateProfileAPI(data: PersonalProfileFormData) {
  const res = await fetch("/api/user/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error);
  }

  return result.data;
}
async function deleteUserAPI(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/user/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete user');
  }

  const result = await response.json();
  return result;
}

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Get all users
export function useUsers(filters: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => fetchUsers(filters),
    placeholderData: (prevData) => prevData,
    staleTime: 1000 * 60 * 5,
  });

}

export function useAssignableUsers() {
  return useQuery({
    queryKey: ["assignable-users"],
    queryFn: fetchAssignableUsers,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
}


// Get user by ID
export function useUser(id: string) {
  return useQuery<User, Error>({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Create user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<
    User,                // TData - return type
    Error,               // TError
    UserFormData,        // TVariables - input type
    CreateUserContext    // TContext
  >({
    mutationFn: createUserAPI,

    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      const previousUsers = queryClient.getQueryData<User[]>(userKeys.lists());

      if (previousUsers) {
        const optimisticUser: User = {
          id: 'temp-' + Date.now(),
          full_name: newUser.full_name,
          email: newUser.email,
          phone: newUser.phone || null,
          role: newUser.role,
          avatar: newUser.avatar? {
            fileId: newUser.avatar.fileId || "",
            imageUrl: newUser.avatar.imageUrl || "",
          } : null,
          start_date: newUser.start_date,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        queryClient.setQueryData<User[]>(
          userKeys.lists(),
          [optimisticUser, ...previousUsers]
        );
      }

      return { previousUsers };
    },

    onError: (_err, _newUser, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData<User[]>(
          userKeys.lists(),
          context.previousUsers
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// Update user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<
    User,                                                    // TData - return type
    Error,                                                   // TError
    { id: string; user: Partial<UserFormData> },           // TVariables - input type
    UpdateUserContext                                        // TContext
  >({
    mutationFn: ({ id, user }) => updateUserAPI(id, user),

    onMutate: async ({ id, user }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });
      await queryClient.cancelQueries({ queryKey: userKeys.detail(id) });

      const previousUsers = queryClient.getQueryData<User[]>(userKeys.lists());
      const previousUser = queryClient.getQueryData<User>(userKeys.detail(id));

      if (previousUsers) {
        queryClient.setQueryData<User[]>(
          userKeys.lists(),
          previousUsers.map((u) =>
            u.id === id
              ? {
                  ...u,
                  ...user,
                  phone: user.phone !== undefined ? user.phone : u.phone,
                  avatar: user.avatar !== undefined ? user.avatar : u.avatar,
                  updated_at: new Date().toISOString(),
                }
              : u
          )
        );
      }

      if (previousUser) {
        queryClient.setQueryData<User>(userKeys.detail(id), {
          ...previousUser,
          ...user,
          phone: user.phone !== undefined ? user.phone : previousUser.phone,
          avatar: user.avatar !== undefined ? user.avatar : previousUser.avatar,
          updated_at: new Date().toISOString(),
        });
      }

      return { previousUsers, previousUser };
    },

    onError: (_err, { id }, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData<User[]>(userKeys.lists(), context.previousUsers);
      }
      if (context?.previousUser) {
        queryClient.setQueryData<User>(userKeys.detail(id), context.previousUser);
      }
    },

    onSuccess: (data, variables) => {
      queryClient.setQueryData<User>(userKeys.detail(variables.id), data);
      
      const users = queryClient.getQueryData<User[]>(userKeys.lists());
      if (users) {
        queryClient.setQueryData<User[]>(
          userKeys.lists(),
          users.map((u) => (u.id === variables.id ? data : u))
        );
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
}

// Delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },  // TData - return type (what deleteUserAPI returns)
    Error,                 // TError
    string,                // TVariables - input type (the user id)
    DeleteUserContext      // TContext
  >({
    mutationFn: deleteUserAPI,

    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      const previousUsers = queryClient.getQueryData<User[]>(userKeys.lists());

      if (previousUsers) {
        queryClient.setQueryData<User[]>(
          userKeys.lists(),
          previousUsers.filter((user) => user.id !== deletedId)
        );
      }

      return { previousUsers };
    },

    onError: (_err, _deletedId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData<User[]>(userKeys.lists(), context.previousUsers);
      }
    },

    onSuccess: (_data, deletedId) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    User,                     // returned user
    Error,                    // error type
    PersonalProfileFormData   // input
  >({
    mutationFn: updateProfileAPI,

    onSuccess: (updatedUser) => {
      // update current user cache
      queryClient.setQueryData(["auth", "user"], updatedUser);
    },

    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });
}

