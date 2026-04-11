"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Car,
  Mail,
  Phone,
  Edit,
  Trash2,
  Clock,
  User,
  FileText,
  Briefcase,
  MoreVertical,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Circle,
  Save,
  MapPin
} from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LeadForm } from "./Lead-form";
import { useLead, useDeleteLead, useUpdateLead } from "@/hooks/use-leads";

// --- IMPORTS ---
// Uncomment this in your real project:
// import { LeadForm } from "./Lead-form";

import { LeadFormData, LeadSource, LeadStatus, LeadView } from "@/types/leads";
import toast from "react-hot-toast";




// --- MAIN PAGE COMPONENT ---
export default function LeadDetailPage() {
   const params = useParams();
  const id = params?.id as string;
 const { data: lead, isLoading, isError } = useLead(id);
  const deleteLead = useDeleteLead();
  const updateLead = useUpdateLead();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const router = useRouter()

    
console.log(lead);

  /* ---------------------------- Error / 404 ---------------------------- */
 if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-slate-500">Loading lead details…</p>
      </div>
    );
  }
 if (isError || !lead) {
    notFound();
  }
  if (!lead) notFound();

const getInitials = (name?: string) => {
  if (!name) return "NA";

  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};


  // Helper: Status Styling
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Qualified':
        return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 };
      case 'New':
        return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: Circle };
      case 'Lost':
        return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: XCircle };
      default:
        return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", icon: Circle };
    }
  };


  const handleDelete = async () => {
    setIsDeleting(true);
   deleteLead.mutate(id,{
    onSuccess: ()=>{
      router.back()
      toast.success("lead deleted")
    },
     onError: ()=>{
      router.back
      
      toast.error("error in deletion")
    }
   })
   setIsDeleting(false)
   
  };
function mapLeadViewToFormData(lead: LeadView): Partial<LeadFormData> {
  return {
    customer_id: lead.customer?.id ?? "",
    source: lead.source,
    status: lead.status,
    interest_vehicle_id: lead.interest_vehicle?.id ?? null,
    assigned_to: lead.assigned_to?.id ?? null,
    notes: lead.notes ?? "",
  };
}

  const handleEditSubmit = (data: LeadFormData) => {
    console.log("Saving data:", data);
    updateLead.mutate({id, data},  {
                  onSuccess: () => {
                    toast.success("Lead updated");
                    
                  },
                  onError: ()=>{
                    toast.error("error in updation")
                  }
                })
    setShowEditDialog(false);
  };

  const statusConfig = getStatusConfig(lead.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">

            {/* Top Row: Back Button (Always visible) */}
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-slate-900 -ml-2 h-8 px-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to Leads
              </Button>
            </div>

            {/* Main Header Content */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              {/* Left: Title & Status */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {lead?.customer?.name}
                  </h1>
                  {/* Status Badge */}
                  <Badge variant="outline" className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} px-2.5 py-0.5 text-sm font-medium`}>
                    <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                    {lead.status}
                  </Badge>
                </div>

                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-500">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono text-xs">
                    ID: {lead.id.substring(0, 8)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Created {new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 mt-2 sm:mt-0">

                {/* Desktop Buttons */}
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(true)}
                  className="hidden sm:flex bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm"
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit Lead
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="hidden sm:flex shadow-sm bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>

                {/* Mobile Menu (Three Dots) */}
                <div className="sm:hidden w-full flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowEditDialog(true)}
                    className="flex-1 bg-white border-slate-300"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-white border-slate-300">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-red-600" onClick={() => setShowDeleteDialog(true)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Lead
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT GRID --- */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* LEFT COLUMN (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Customer Contact Card */}
            <Card className="shadow-sm border-slate-200 overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Customer Information
                  </h3>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-sm ring-1 ring-slate-100">
                      <AvatarFallback className="bg-indigo-600 text-white text-xl font-bold">
                        {getInitials(lead?.customer?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email Address</label>
                      <a href={`mailto:${lead?.customer?.email}`} className="flex items-center gap-2 group p-2 -ml-2 rounded-md hover:bg-slate-50 transition-colors">
                        <div className="h-8 w-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-900 group-hover:text-indigo-700 truncate">
                          {lead?.customer?.email}
                        </span>
                      </a>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone Number</label>
                      <a href={`tel:${lead?.customer?.phone}`} className="flex items-center gap-2 group p-2 -ml-2 rounded-md hover:bg-slate-50 transition-colors">
                        <div className="h-8 w-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-900 group-hover:text-indigo-700">
                          {lead?.customer?.phone}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Vehicle Card */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-slate-500" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Vehicle Interest
                  </h3>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-100">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{lead?.interest_vehicle?.make} {lead?.interest_vehicle?.model}</p>
                    <p className="text-sm text-slate-500">Target Vehicle</p>
                  </div>
                  <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                    <Car className="h-6 w-6 text-slate-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Notes Card (Fixed Responsiveness & Wrapping) */}
            <Card className="shadow-sm border-slate-200 ">
              <CardHeader className="bg-amber-50/40 border-b border-amber-100/60 py-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-600" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Notes & Requirements
                  </h3>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative rounded-md bg-amber-50/30 p-4 border border-amber-100/50">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words font-normal">
                    {lead.notes}
                  </p>
                  <div className="mt-4 pt-3 border-t border-amber-100/50 flex items-center gap-1.5 text-xs text-amber-600/70">
                    <Edit className="h-3 w-3" />
                    Last updated by System
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN (1/3 width) - Sidebar */}
          <div className="space-y-6">

            {/* Assignment Card */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Staff Assignment
                  </h3>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10 border border-slate-100">
                    <AvatarFallback className="bg-slate-800 text-white font-medium">
                      {getInitials(lead?.assigned_to?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{lead?.assigned_to?.full_name}</p>
                    <p className="text-xs text-slate-500 truncate" title={lead?.assigned_to?.email}>
                      {lead?.assigned_to?.email}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-green-50 text-green-700 px-3 py-2 rounded-md border border-green-100 flex items-center justify-center gap-2 text-xs font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active Assignment
                </div>
              </CardContent>
            </Card>

            {/* Timeline / Metadata */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    System Metadata
                  </h3>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" /> Source
                  </span>
                  <Badge variant="secondary" className="font-normal bg-slate-100 text-slate-700 hover:bg-slate-200">
                    {lead.source}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Created On</span>
                    <span className="text-sm text-slate-700 font-medium">
                      {new Date(lead.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Last Updated</span>
                    <span className="text-sm text-slate-700 font-medium">
                      {new Date(lead.updated_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>

      {/* --- EDIT DIALOG --- */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Lead Information</DialogTitle>
          </DialogHeader>

          <LeadForm
            initialData={mapLeadViewToFormData(lead)}
            onSubmit={handleEditSubmit}
            onCancel={() => setShowEditDialog(false)}
          />

        </DialogContent>
      </Dialog>

      {/* --- DELETE DIALOG --- */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:rounded-xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <ShieldAlert className="h-5 w-5 text-red-600" />
              </div>
              <AlertDialogTitle>Delete Lead Record?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-600 ml-1">
              This action cannot be undone. This will permanently delete the lead
              <span className="font-bold text-slate-900 mx-1">{lead?.customer?.name}</span>
              and remove all associated data, tasks, and history from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={isDeleting} className="border-slate-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete Lead"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}