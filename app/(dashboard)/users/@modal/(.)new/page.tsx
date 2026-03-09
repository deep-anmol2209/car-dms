'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { useCreateUser } from '@/hooks/use-users';
import { UserFormDialog } from '@/components/users/user-form-dialog';

export default function NewUserModal() {
  const router = useRouter();
  const createUser = useCreateUser();
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        // Only close when user explicitly closes dialog
        if (!value) {
          setOpen(false);
          router.back();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user.
          </DialogDescription>
        </DialogHeader>

        <UserFormDialog
          onSubmit={(data) => {
            createUser.mutateAsync(data, {
              onSuccess: () => {
                toast.success('User created');
                setOpen(false);
                router.back();
              },
              onError: () => {
                toast.error('Failed to create user');
              },
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
