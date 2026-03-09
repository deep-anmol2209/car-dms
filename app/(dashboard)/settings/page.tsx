// 'use client';

// import { useState } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { BusinessProfileForm } from '@/components/settings/business-profile-form';
// import { PersonalProfileForm } from '@/components/settings/personal-profile-form';
// import { BusinessProfileFormData, PersonalProfileFormData } from '@/lib/validations/settings';
// import { Button } from '@/components/ui/button';
// import { ActivityIcon } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from 'react-hot-toast';

// export default function SettingsPage() {
//   const [businessData, setBusinessData] = useState<Partial<BusinessProfileFormData>>({});
//   const [personalData, setPersonalData] = useState<Partial<PersonalProfileFormData>>({});

//   const handleBusinessSubmit = (data: BusinessProfileFormData) => {
//     // In a real app, this would save to Supabase or your backend
//     setBusinessData(data);
//     toast.success('Business profile saved successfully');
//   };

//   const handlePersonalSubmit = (data: PersonalProfileFormData) => {
//     // In a real app, this would save to Supabase or your backend
//     setPersonalData(data);
//     toast.success('Personal profile saved successfully');
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Settings</h1>
//         <Link href="/settings/system-health">
//           <Button variant="outline">
//             <ActivityIcon className="w-4 h-4 mr-2" />
//             System Health
//           </Button>
//         </Link>
//       </div>
      
//       <Tabs defaultValue="business" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="business">Business Profile</TabsTrigger>
//           <TabsTrigger value="personal">Personal Profile</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="business">
//           <Card>
//             <CardHeader>
//               <CardTitle>Business Profile</CardTitle>
//               <p className="text-sm text-slate-500 mt-2">
//                 Configure your business information, tax IDs, and dealer license details.
//               </p>
//             </CardHeader>
//             <CardContent>
//               <BusinessProfileForm 
//                 initialData={businessData}
//                 onSubmit={handleBusinessSubmit}
//               />
//             </CardContent>
//           </Card>
//         </TabsContent>
        
//         <TabsContent value="personal">
//           <Card>
//             <CardHeader>
//               <CardTitle>Personal Profile</CardTitle>
//               <p className="text-sm text-slate-500 mt-2">
//                 Manage your personal information and preferences.
//               </p>
//             </CardHeader>
//             <CardContent>
//               <PersonalProfileForm 
//                 initialData={personalData}
//                 onSubmit={handlePersonalSubmit}
//               />
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

import SettingsPage from "@/components/settings/settings-page";
import { RoleGuard } from "@/helper/role-guard";
export default function Settingspage(){

  return(
    <RoleGuard allowed={["Admin"]}>

<SettingsPage/>
    </RoleGuard>
    
  )
}