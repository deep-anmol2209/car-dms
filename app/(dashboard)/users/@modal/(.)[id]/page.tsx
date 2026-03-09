"use client";

import { useRouter } from "next/navigation";
import { UserFormDialog } from "@/components/users/user-form-dialog";
import { useUser, useUpdateUser } from "@/hooks/use-users";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function EditUserModal({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useUser(params.id);
  const updateUser = useUpdateUser();
 console.log("user: ",user);
 
  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user details and save changes.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="py-8 text-center text-muted-foreground">
            Loading user...
          </div>
        )}

        {isError && (
          <div className="py-8 text-center text-red-500">
            Failed to load user
          </div>
        )}

        {user && (
          <UserFormDialog
            user={user}
            onSubmit={(data) => {
              updateUser.mutate(
                { id: params.id, user: data },
                {
                  onSuccess: () => {
                    toast.success("User updated");
                    router.back();
                  },
                }
              );
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
