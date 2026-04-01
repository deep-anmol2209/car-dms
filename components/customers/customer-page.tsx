"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Eye,
  Trash2,
  User,
  AlertCircle,
  Pencil
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { CustomerForm } from "@/components/customers/customer-form";
import { useCustomers, useDeleteCustomer } from "@/hooks/use-customers";
import type { Customer, CustomerFormData } from "@/types/customers";
import { useDebounce } from "@/hooks/use-debounce";
import toast from "react-hot-toast";
// Helper
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export default function CustomersPageClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const deleteCustomer = useDeleteCustomer()
  const router = useRouter();
  const {
    data,
    isLoading,
    error,
  } = useCustomers({
    page: 1,
    limit: 10,
    search: debouncedSearch,
  });

  const queryClient = useQueryClient();

  const handleAddCustomer = async (data: CustomerFormData) => {
    // Ideally use a mutation hook here instead of raw fetch
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create customer");

    queryClient.invalidateQueries({ queryKey: ["customers"] });
    setIsAddDialogOpen(false);
  };
  const handleDeleteCustomer = async () => {
    if (!deleteCustomerId) return;
    deleteCustomer.mutate(deleteCustomerId, {
      onSuccess: () => toast.success("Customer deleted successfully"),
      onError: () => toast.error("Failed to delete customer"),
    });

    queryClient.invalidateQueries({ queryKey: ["customers"] });
    setDeleteCustomerId(null);
  };

  // const filteredCustomers = customers.filter((customer) => {
  //   const search = searchTerm.toLowerCase();
  //   return (
  //     customer.name.toLowerCase().includes(search) ||
  //     customer.phone?.toLowerCase().includes(search) ||
  //     customer.email?.toLowerCase().includes(search)
  //   );
  // });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-red-500">
        <AlertCircle className="mr-2 h-5 w-5" />
        Failed to load customers
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 animate-in fade-in duration-500">

      {/* --- Header --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer base, track history, and resolve duplicates.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} size="lg" className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Separator />

      {/* --- Main Content --- */}
      <Card className="shadow-sm border-border/60">
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
          <CardDescription>
            Viewing {data?.length} registered customers.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Toolbar */}
          <div className="flex items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* ── MOBILE CARD VIEW (≤700px) ── */}
          <div className="rounded-md border divide-y divide-border min-[701px]:hidden">
            {data?.data?.length > 0 ? (
              data.data.map((customer: Customer) => (
                <div key={customer.id} className="p-4 space-y-3 hover:bg-muted/30 transition-colors">

                  {/* Top: avatar + name + actions */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 border shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{customer.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          ID: {customer.id.toString().slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setViewCustomer(customer)}>
                          <Eye className="mr-2 h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/customers/${customer.id}`)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteCustomerId(customer.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Contact info */}
                  <div className="flex flex-col gap-1.5">
                    {customer.email && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    {!customer.email && !customer.phone && (
                      <span className="text-xs text-muted-foreground italic">No contact info</span>
                    )}
                  </div>

                  {/* Location */}
                  {(customer.city || customer.province) && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{[customer.city, customer.province].filter(Boolean).join(", ")}</span>
                    </div>
                  )}

                </div>
              ))
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No customers found matching your search.
              </div>
            )}
          </div>

          {/* ── DESKTOP TABLE VIEW (>700px) ── */}
          <div className="rounded-md border max-[700px]:hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[250px] pl-6">Customer Profile</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data?.data.length > 0 ? (
                  data?.data.map((customer: Customer) => (
                    <TableRow key={customer.id} className="hover:bg-muted/50 group">

                      {/* Customer Profile */}
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            <AvatarFallback className="bg-slate-100 text-slate-700 text-xs">
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-foreground">{customer.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                              ID: {customer.id.toString().slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Contact Info */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {customer.email && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{customer.email}</span>
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                          {!customer.email && !customer.phone && (
                            <span className="text-muted-foreground text-xs italic">No contact info</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Location */}
                      <TableCell>
                        {(customer.city || customer.province) ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {[customer.city, customer.province].filter(Boolean).join(", ")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">—</span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setViewCustomer(customer)}>
                              <Eye className="mr-2 h-4 w-4" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/customers/${customer.id}`)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteCustomerId(customer.id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Customer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No customers found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter the details below to register a new customer.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm
            onSubmit={handleAddCustomer}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={!!viewCustomer} onOpenChange={() => setViewCustomer(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              Customer Profile
            </DialogTitle>
            <DialogDescription>
              Detailed information about the selected customer.
            </DialogDescription>
          </DialogHeader>

          {viewCustomer && (
            <div className="space-y-6">

              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border">
                  <AvatarFallback className="text-sm bg-muted">
                    {getInitials(viewCustomer.name)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold text-lg">{viewCustomer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ID: {viewCustomer.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {viewCustomer.phone || "Not provided"}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {viewCustomer.email || "Not provided"}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                  <MapPin className="h-4 w-4" />
                  {[viewCustomer.city, viewCustomer.province]
                    .filter(Boolean)
                    .join(", ") || "Location not available"}
                </div>

                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs mb-1">Address</p>
                  <p className="text-sm">{viewCustomer.address || "—"}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs mb-1">Postal Code</p>
                  <p className="text-sm">{viewCustomer.postal_code || "—"}</p>
                </div>

              </div>

              <Separator />

              {/* Notes */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm leading-relaxed">
                  {viewCustomer.notes || "No notes available"}
                </p>
              </div>

              <Separator />

              {/* Dates */}
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>
                  Created:{" "}
                  {new Date(viewCustomer.created_at).toLocaleDateString()}
                </span>
                <span>
                  Updated:{" "}
                  {new Date(viewCustomer.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={!!deleteCustomerId}
        onOpenChange={() => setDeleteCustomerId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustomer}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}