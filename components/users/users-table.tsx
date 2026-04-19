"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  AlertCircle,
  Pencil,
  Trash2,
  Search,
  MoreHorizontal,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

import { useUsers, useDeleteUser } from "@/hooks/use-users";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";

const roleStyles: Record<string, string> = {
  Admin:
    "bg-red-100 text-red-700 hover:bg-red-100/80 border-red-200",
  Manager:
    "bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-blue-200",
  Staff:
    "bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-slate-200",
};

export default function UsersManagement() {
  const router = useRouter();
 const [searchTerm, setSearchTerm] = useState("");
const [page, setPage] = useState(1);

const debouncedSearch = useDebounce(searchTerm, 500);
const deleteUser = useDeleteUser();
const { data, isLoading, error } = useUsers({
  page,
  limit: 10,
  search: debouncedSearch,
});

const users = data?.data || [];
const totalUsers = data?.pagination?.total || 0;
const totalPages = data?.pagination?.totalPages || 1;

  useEffect(() => {
    router.prefetch("/users/new");
  }, [router]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser.mutate(id, {
        onSuccess: () => toast.success("User deleted successfully"),
        onError: () => toast.error("Failed to delete user"),
      });
    }
  };

useEffect(() => {
  setPage(1);
}, [debouncedSearch]);


  // 🔄 Loading State
  if (isLoading) {
    return (
      <div className="p-6">
      <div className="mb-6">
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-96 bg-slate-200 rounded animate-pulse" />
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-1" />
                  <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    );
  }

  // ❌ Error State
  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-red-500">
        <AlertCircle className="mr-2 h-5 w-5" />
        Failed to load users
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage system access, roles, and staff permissions.
          </p>
        </div>

        <Button
          onClick={() => router.push("/users/new")}
          size="lg"
          className="shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Separator />

      {/* Card */}
      <Card className="shadow-sm border-border/60">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            You have {totalUsers} total users in your organization.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[250px] pl-6">
                    User
                  </TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="pr-6 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.length > 0 ? (
                  users.map((user: any) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-muted/50 group"
                    >
                      {/* User */}
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            <AvatarImage src={user.avatar?.imageUrl} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {user.full_name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {user.full_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-normal ${
                            roleStyles[user.role] ||
                            roleStyles.Staff
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>

                      {/* Phone */}
                      <TableCell>
                        {user.phone ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">
                            —
                          </span>
                        )}
                      </TableCell>

                      {/* Start Date */}
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(
                            user.start_date
                          ).toLocaleDateString()}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground group-hover:text-foreground"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/users/${user.id}`)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                handleDelete(user.id)
                              }
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <ShieldCheck className="h-8 w-8 text-muted-foreground/50" />
                        No users found matching your search.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between pt-4">
  <Button
    variant="outline"
    size="sm"
    disabled={page === 1}
    onClick={() => setPage((p) => p - 1)}
  >
    Previous
  </Button>

  <span className="text-sm text-muted-foreground">
    Page {page} of {totalPages}
  </span>

  <Button
    variant="outline"
    size="sm"
    disabled={page === totalPages}
    onClick={() => setPage((p) => p + 1)}
  >
    Next
  </Button>
</div>

        </CardContent>
      </Card>
    </div>
  );
}
