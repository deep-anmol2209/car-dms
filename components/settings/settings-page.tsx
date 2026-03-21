'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessProfileForm } from '@/components/settings/business-profile-form';
import { PersonalProfileForm } from '@/components/settings/personal-profile-form';
import { Button } from '@/components/ui/button';
import { ActivityIcon } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useAuth';
import { Loader2 } from "lucide-react";
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import {
  useBusinessProfile,
  useUpdateBusinessProfile,
  useCreateBusinessProfile
} from '@/hooks/useBusiness-profile';
import { PersonalProfileFormData } from '@/types/personalProfile';

import { useUpdateProfile } from '@/hooks/use-users';

export default function SettingsPage() {

  const { data: businessProfile, isLoading } = useBusinessProfile();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const createProfile = useCreateBusinessProfile();
  const updateProfile = useUpdateBusinessProfile();
  const updateUserProfile= useUpdateProfile();
console.log(user);

  const handleBusinessSubmit = async (data: any) => {
    try {

      if (businessProfile?.id) {
        await updateProfile.mutateAsync({
          id: businessProfile.id,
          profile: data
        });
      } else {
        await createProfile.mutateAsync(data);
      }

      toast.success("Business profile saved successfully");

    } catch (error) {
      toast.error("Failed to save business profile");
    }
  };
  const handlePersonalSubmit = async (data: PersonalProfileFormData) => {
    try {
      await updateUserProfile.mutateAsync(data);
  
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };
  if (isLoading || userLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <Link href="/settings/system-health">
          <Button variant="outline">
            <ActivityIcon className="w-4 h-4 mr-2" />
            System Health
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="business" className="space-y-6">

        <TabsList>
          <TabsTrigger value="business">Business Profile</TabsTrigger>
          <TabsTrigger value="personal">Personal Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <p className="text-sm text-slate-500 mt-2">
                Configure your business information.
              </p>
            </CardHeader>

            <CardContent>
              <BusinessProfileForm
                initialData={businessProfile || {}}
                onSubmit={handleBusinessSubmit}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Profile</CardTitle>
              <p className="text-sm text-slate-500 mt-2">
                Manage your personal information.
              </p>
            </CardHeader>

            <CardContent>
            <PersonalProfileForm
  initialData={
    user
      ? {
          full_name: user.full_name,
          email: user.email,
          phone: user.phone ?? '',
          avatar: user.avatar ?? undefined, 
        }
      : undefined
  }
  onSubmit={handlePersonalSubmit}
/>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}