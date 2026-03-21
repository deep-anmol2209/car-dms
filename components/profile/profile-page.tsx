'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Trash2, Loader2, Camera, X, Check, User, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { PersonalProfileFormData, personalProfileSchema } from '@/types/personalProfile'
import { ImageUploader, ImageUploaderRef } from '@/components/imagekit/fileUpload'
import { uploadToImageKit } from '@/helper/upload'
import { useCurrentUser } from '@/hooks/useAuth'
import { useUpdateProfile } from '@/hooks/use-users'

export function PersonalProfileForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showUploader, setShowUploader] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const { data: user, isLoading: userLoading } = useCurrentUser()
  const uploaderRef = useRef<ImageUploaderRef>(null)
  const updateUserProfile = useUpdateProfile()

  const form = useForm<PersonalProfileFormData>({
    resolver: zodResolver(personalProfileSchema),
    defaultValues: { full_name: '', email: '', phone: '', avatar: '' },
  })

  useEffect(() => {
    if (!user) return
    const avatarUrl =
      user.avatar && typeof user.avatar === 'object'
        ? user.avatar.imageUrl
        : user.avatar ?? ''
    form.reset({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: avatarUrl,
    })
  }, [user, form])

  const handleSubmit = async (data: PersonalProfileFormData) => {
    try {
      let avatar = data.avatar
      if (avatarFile) {
        const uploaded = await uploadToImageKit(avatarFile)
        if (!uploaded.fileId || !uploaded.url) throw new Error('Invalid upload response')
        avatar = { fileId: uploaded.fileId, imageUrl: uploaded.url }
      }
      await updateUserProfile.mutateAsync({ ...data, avatar })
      toast.success('Profile updated')
      setIsEditing(false)
      setAvatarFile(null)
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setAvatarFile(null)
    setShowUploader(false)
    form.reset()
  }

  if (userLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground h-5 w-5" />
      </div>
    )

  const avatarValue = form.watch('avatar')
  const avatarUrl =
    typeof avatarValue === 'object' ? avatarValue?.imageUrl : avatarValue || undefined
  const fullName = form.watch('full_name')
  const initials = fullName?.split(' ').map((n: string) => n[0]).join('') || 'U'

  return (

  <div className="max-w-8xl mx-auto px-6 py-8 space-y-8">

    {/* Title */}
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Personal Profile</h1>
      <p className="text-muted-foreground">
        Manage your account details
      </p>
    </div>

    {/* CARD */}
    <div className="rounded-2xl border border-border bg-card p-8">

      {/* CENTERED HEADER */}
      <div className="flex flex-col items-center text-center mb-10">

        {/* AVATAR */}
        <div className="relative group mb-4">

          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* EDIT OVERLAY */}
          {isEditing && (
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
            >
              <Camera size={20} className="text-white" />
            </button>
          )}

          {/* DROPDOWN */}
          {menuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-44 bg-popover border border-border rounded-xl shadow-lg z-50 py-1">

              <button
                onClick={() => {
                  setMenuOpen(false)
                  setShowUploader(true)
                }}
                className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted transition"
              >
                <Pencil size={14} /> Change photo
              </button>

              <button
                onClick={() => {
                  form.setValue('avatar', '')
                  setMenuOpen(false)
                }}
                className="w-full px-3 py-2 text-sm flex items-center gap-2 text-destructive hover:bg-destructive/10 transition"
              >
                <Trash2 size={14} /> Remove photo
              </button>

            </div>
          )}
        </div>

        {/* NAME */}
        <p className="text-lg font-semibold">{fullName || '—'}</p>

        {/* EMAIL */}
        <p className="text-sm text-muted-foreground">
          {form.watch('email')}
        </p>

        {isEditing && (
          <p className="text-xs text-muted-foreground mt-1">
            Click avatar to change photo
          </p>
        )}
      </div>

      {/* UPLOADER */}
      {showUploader && (
        <div className="mb-6 p-4 border border-dashed border-border rounded-xl bg-muted/30">

          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium">Upload new photo</p>
            <button onClick={() => setShowUploader(false)}>
              <X size={16} />
            </button>
          </div>

          <ImageUploader
            ref={uploaderRef}
            multiple={false}
            onFilesChange={(files) => {
              const file = files[0]
              if (!file) return
              setAvatarFile(file)
              form.setValue('avatar', URL.createObjectURL(file))
              setShowUploader(false)
            }}
          />
        </div>
      )}

      {/* FORM */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* FULL NAME */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PHONE */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Phone</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-center lg:justify-end gap-3 pt-6 border-t border-border">

            {!isEditing ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={updateUserProfile.isPending}
                >
                  {updateUserProfile.isPending ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </>
            )}

          </div>

        </form>
      </Form>
    </div>

  </div>
)
  
}