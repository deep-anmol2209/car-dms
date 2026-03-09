// 'use client';

// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { UserFormData, userSchema } from '@/lib/validations/user';
// import { Calendar } from '@/components/ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { CalendarIcon } from 'lucide-react';
// import { format } from 'date-fns';

// export function UserFormDialog({
//   open,
//   onOpenChange,
//   user,
//   onSubmit
// }: {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   user?: any;
//   onSubmit: (data: UserFormData) => void;
// }) {
//   const form = useForm<UserFormData>({
//     resolver: zodResolver(userSchema),
//     defaultValues: user || {
//       role: 'Staff',
//       start_date: new Date(),
//     }
//   });

//   const handleSubmit = (data: UserFormData) => {
//     onSubmit(data);
//     form.reset();
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
//         </DialogHeader>
        
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//             <div className="grid grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="full_name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Full Name</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input type="email" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="phone"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Phone (Optional)</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="role"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Role</FormLabel>
//                     <FormControl>
//                       <select {...field} className="w-full p-2 border rounded-md">
//                         <option value="Staff">Staff</option>
//                         <option value="Manager">Manager</option>
//                         <option value="Admin">Admin</option>
//                       </select>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//   control={form.control}
//   name="start_date"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Start Date</FormLabel>
//       <Popover>
//         <PopoverTrigger asChild>
//           <FormControl>
//             <Button
//               type="button"   // ✅ IMPORTANT
//               variant="outline"
//               className="w-full justify-start text-left font-normal"
//             >
//               <CalendarIcon className="mr-2 h-4 w-4" />
//               {field.value ? (
//                 format(field.value, "PPP")
//               ) : (
//                 <span>Pick a date</span>
//               )}
//             </Button>
//           </FormControl>
//         </PopoverTrigger>

//         <PopoverContent className="w-auto p-0">
//           <Calendar
//             mode="single"
//             selected={field.value}
//             onSelect={field.onChange}
//             initialFocus
//           />
//         </PopoverContent>
//       </Popover>
//       <FormMessage />
//     </FormItem>
//   )}
// />

              
//               <FormField
//                 control={form.control}
//                 name="avatar"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Avatar URL (Optional)</FormLabel>
//                     <FormControl>
//                       <Input {...field} placeholder="https://..." />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
            
//             <div className="flex justify-end gap-4">
//               <Button 
//                 type="button" 
//                 variant="outline"
//                 onClick={() => onOpenChange(false)}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit">
//                 {user ? 'Update User' : 'Add User'}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
// UI Components
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Utilities & Schemas
import { cn } from '@/lib/utils';
import { userFormSchema, updateUserSchema, UserFormData, User } from '@/types/user';
import { ImageUploader } from '../imagekit/fileUpload';
import { uploadToImageKit } from '@/helper/upload';

interface UserFormDialogProps {

  user?: User // Typed this strictly for better TS support
  onSubmit: (data: UserFormData) => void;
}

export function UserFormDialog({
  user,
  onSubmit
}: UserFormDialogProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [objectPreview, setObjectPreview] = useState<string | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);

const form = useForm<UserFormData>({
  resolver: zodResolver(userFormSchema),
  defaultValues: {
    full_name: '',
    email: '',
    phone: '',
    role: 'Staff',
    start_date: new Date(),
    avatar: null
  }
});

  useEffect(() => {
    if (user) {
      form.reset({
        ...user,
        phone: user.phone ?? "", // ✅ convert null → ""
        start_date: new Date(user.start_date),
        avatar: user.avatar ?? null,
      });
  console.log("userrrrr: ", user.avatar?.imageUrl);
  
  if (user.avatar?.imageUrl) {
    setPreviewUrl(user.avatar.imageUrl);
    setObjectPreview(null); // important
  }
    } else {
      form.reset({
        full_name: '',
        email: '',
        phone: '',
        role: 'Staff',
        start_date: new Date(),
        avatar: null,
      });
  
      setPreviewUrl(null);
    }
  }, [user, form]);
const handleSubmit = async (data: UserFormData) => {
  try {
    setIsSubmitting(true);

    let uploaded;

    if (avatarFile) {
      uploaded = await uploadToImageKit(avatarFile);

      if (
        !uploaded.fileId ||
        !uploaded.url ||
        !uploaded.thumbnailUrl ||
        !uploaded.name ||
        !uploaded.size ||
        !uploaded.filePath
      ) {
        throw new Error("Invalid ImageKit upload response");
      }
    }

    const finalData = {
      ...data,
      avatar: uploaded
        ? {
            fileId: uploaded.fileId!,
            imageUrl: uploaded.url!,
          }
        : null,
    };

    await onSubmit(finalData);

    form.reset();
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <> 
            {user 
              ? "Make changes to the user's profile here. Click save when you're done." 
              : "Fill in the details below to create a new user account."}
 
        <Form {...form}>
         <form
  onSubmit={form.handleSubmit(handleSubmit)}
  className="space-y-6"
>
  <fieldset disabled={isSubmitting} className="space-y-6">

            {/* Grid Layout: Stacks on mobile (grid-cols-1), 2 cols on tablet/desktop (md:grid-cols-2) */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              
              {/* Full Name */}
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Role - Updated to Shadcn Select */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Staff">Staff</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Start Date - Modernized */}
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Avatar */}
              <FormField
  control={form.control}
  name="avatar"
  render={() => (
    <FormItem>
      <FormLabel>Avatar (Optional)</FormLabel>
      <FormControl>
        <div className="space-y-3">

          <ImageUploader
            multiple={false}
            onFilesChange={(files) => {
              const file = files[0] || null;
              if (!file) return;

              setAvatarFile(file);

              if (objectPreview) {
                URL.revokeObjectURL(objectPreview);
              }

              const localUrl = URL.createObjectURL(file);
              setObjectPreview(localUrl);
              setPreviewUrl(null);
            }}
          />

          {/* 🔥 Preview Section */}
          {(objectPreview || previewUrl) && (
            <div className="relative w-32 h-32 rounded-md overflow-hidden border">
             {(objectPreview || previewUrl) && (
  <div className="relative w-32 h-32 rounded-md overflow-hidden border">
    <Image
      src={objectPreview ?? previewUrl ?? ""}
      alt="Avatar preview"
      fill
      sizes="128px"
      className="object-cover"
      unoptimized
    />

    {/* ❌ Remove Button */}
    <button
      type="button"
      onClick={() => {
        if (objectPreview) {
          URL.revokeObjectURL(objectPreview);
        }

        setAvatarFile(null);
        setObjectPreview(null);
        setPreviewUrl(null);

        form.setValue("avatar", null);
      }}
      className="absolute top-1 right-1 z-10 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black"
    >
      ✕
    </button>
  </div>
)}

              {/* ❌ Remove Button */}
              <button
                type="button"
                onClick={() => {
                  if (objectPreview) {
                    URL.revokeObjectURL(objectPreview);
                  }

                  setAvatarFile(null);
                  setObjectPreview(null);
                  setPreviewUrl(null);

                  form.setValue("avatar", null);
                }}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


            </div>
            
          
             <div className="flex justify-end gap-3 pt-6 border-t">
  <Button
    type="button"
    variant="outline"
    disabled={isSubmitting}
  >
    Cancel
  </Button>

  <Button
    type="submit"
    disabled={isSubmitting}
    className="min-w-[130px]"
  >
    {isSubmitting ? (
      <span className="flex items-center gap-2">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        {user ? "Saving..." : "Creating..."}
      </span>
    ) : user ? (
      "Save Changes"
    ) : (
      "Create User"
    )}
  </Button>
</div>
</fieldset>
          </form>
        </Form>
</>

  );
}

function uploadFileToImageKit(avatarFile: File | null) {
  throw new Error('Function not implemented.');
}
