'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { PersonalProfileFormData, personalProfileSchema } from '@/types/personalProfile'
import { useState, useEffect, useRef } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

import { ImageUploader, ImageUploaderRef } from '@/components/imagekit/fileUpload'
import { uploadToImageKit } from '@/helper/upload'

export function PersonalProfileForm({
  initialData,
  onSubmit,
}: {
  initialData?: Partial<PersonalProfileFormData>
  onSubmit: (data: PersonalProfileFormData) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showUploader, setShowUploader] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const uploaderRef = useRef<ImageUploaderRef>(null)

  const form = useForm<PersonalProfileFormData>({
    resolver: zodResolver(personalProfileSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      avatar: '',
     
    },
  })

  const handleSubmit = async (data: PersonalProfileFormData) => {
    try {
      let avatar = data.avatar;
  
      if (avatarFile) {
        const uploaded = await uploadToImageKit(avatarFile);
  
        if (!uploaded.fileId || !uploaded.url) {
          throw new Error("Invalid ImageKit upload response");
        }
  
        avatar = {
          fileId: uploaded.fileId,
          imageUrl: uploaded.url,
        };
      }
  
      await onSubmit({
        ...data,
        avatar,
      });
  
      setAvatarFile(null);
  
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  useEffect(() => {
    if (initialData) {
      const avatarUrl =
        typeof initialData.avatar === 'object' && initialData.avatar !== null
          ? (initialData.avatar as any).imageUrl
          : initialData.avatar ?? ''

      form.reset({
        ...initialData,
        avatar: avatarUrl,
      })
    }
  }, [initialData, form])

  const handleDeleteAvatar = () => {
    form.setValue('avatar', '')
    uploaderRef.current?.clear()
    setMenuOpen(false)
  }
  const avatarValue = form.watch("avatar");

  const avatarUrl =
    typeof avatarValue === "object"
      ? avatarValue?.imageUrl
      : avatarValue || undefined;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">

          <div className="relative">

          <Avatar className="h-28 w-28 border">
  <AvatarImage src={avatarUrl} />
  <AvatarFallback className="text-xl">
    {form.watch("full_name")
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "U"}
  </AvatarFallback>
</Avatar>

            {isEditing && (
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="absolute -right-1 -top-1 rounded-full border bg-background p-2 shadow"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-md border bg-background shadow-lg">

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    setShowUploader(true)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Photo
                </button>

                <button
                  type="button"
                  onClick={handleDeleteAvatar}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-muted"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>

              </div>
            )}

          </div>

          {showUploader && (
            <ImageUploader
              ref={uploaderRef}
              multiple={false}
              defaultImage={
               avatarUrl
              }
              onFilesChange={(files) => {
                const file = files[0]
                if (!file) return
              
                setAvatarFile(file) // store file
              
                const preview = URL.createObjectURL(file)
                form.setValue("avatar", preview) // preview only
              
                setShowUploader(false)
              }}
            />
          )}

        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

      

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t pt-6">

          {!isEditing && (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}

          {isEditing && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset(initialData)
                  setIsEditing(false)
                }}
              >
                Cancel
              </Button>

              <Button type="submit">
                Save Changes
              </Button>
            </>
          )}

        </div>

      </form>
    </Form>
  )
}