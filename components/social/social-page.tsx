// 'use client';

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Share2, Facebook, Instagram, Twitter, Plus } from 'lucide-react';

// export default function SocialPostingPage() {
//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div className="space-y-1">
//           <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
//             Social Posting
//           </h1>
//           <p className="text-muted-foreground text-lg">
//             Manage social media posts and campaigns
//           </p>
//         </div>
//         <Button>
//           <Plus className="w-4 h-4 mr-2" />
//           Create Post
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle className="flex items-center gap-2">
//                 <Facebook className="w-5 h-5 text-blue-600" />
//                 Facebook
//               </CardTitle>
//               <Badge variant="outline">Connected</Badge>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-slate-500">Posts This Month</p>
//                 <p className="text-2xl font-bold">12</p>
//               </div>
//               <Button variant="outline" className="w-full">
//                 <Share2 className="w-4 h-4 mr-2" />
//                 View Posts
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle className="flex items-center gap-2">
//                 <Instagram className="w-5 h-5 text-pink-600" />
//                 Instagram
//               </CardTitle>
//               <Badge variant="outline">Not Connected</Badge>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-slate-500">Posts This Month</p>
//                 <p className="text-2xl font-bold">0</p>
//               </div>
//               <Button variant="outline" className="w-full" disabled>
//                 Connect Account
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle className="flex items-center gap-2">
//                 <Twitter className="w-5 h-5 text-blue-400" />
//                 Twitter
//               </CardTitle>
//               <Badge variant="outline">Not Connected</Badge>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-slate-500">Posts This Month</p>
//                 <p className="text-2xl font-bold">0</p>
//               </div>
//               <Button variant="outline" className="w-full" disabled>
//                 Connect Account
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="mt-6">
//         <CardHeader>
//           <CardTitle>Recent Posts</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-center py-12 text-slate-500">
//             <p>No posts yet</p>
//             <p className="text-sm mt-2">Create your first social media post from the Inventory page</p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Plus,
  ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";

import CreatePostModal from "@/components/social/create-post-modal";
import { useRecentPosts } from "@/hooks/useSocial";

export default function SocialPostingPage() {
  const [openCreatePost, setOpenCreatePost] = useState(false);

  const { data: posts, isLoading, error } = useRecentPosts();

  return (
    <div className="w-full px-6 py-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
            <Facebook className="w-4 h-4" />
            Facebook Posting
          </div>
          <h1 className="text-3xl font-bold mt-1">
            Create & Manage Posts
          </h1>
          <p className="text-muted-foreground">
            Quickly create and publish posts to your Facebook page.
          </p>
        </div>

        <Button
          onClick={() => setOpenCreatePost(true)}
          size="lg"
          
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Post
        </Button>
      </div>

      {/* MAIN */}
      <Card className="w-full rounded-xl">
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>
            Your latest Facebook posts
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* LOADING */}
          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="text-center py-20 text-red-500">
              Failed to load posts
            </div>
          )}

          {/* EMPTY */}
          {!isLoading && posts?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="bg-slate-100 p-5 rounded-full mb-4">
                <ImageIcon className="w-8 h-8 text-slate-400" />
              </div>

              <h3 className="font-semibold text-xl">No posts yet</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Start posting your vehicles on Facebook.
              </p>

              <Button
                
                size="lg"
                onClick={() => setOpenCreatePost(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Post
              </Button>
            </div>
          )}

          {/* POSTS */}
          {!isLoading && posts?.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => {
                const firstImage = post.image_urls?.[0];

                return (
                  <div
                    key={post.id}
                    className="border rounded-xl overflow-hidden bg-white hover:shadow-lg transition flex flex-col"
                  >
                    {/* IMAGE */}
                    <div className="relative h-44 w-full bg-slate-100">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="font-semibold text-sm mb-1">
                        {post.vehicles?.year} {post.vehicles?.make}{" "}
                        {post.vehicles?.model}
                      </p>

                      <p className="text-xs text-muted-foreground line-clamp-3 flex-1">
                        {post.post_text}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>

                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                            post.status === "Published"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL */}
      <CreatePostModal
        open={openCreatePost}
        onClose={() => setOpenCreatePost(false)}
      />
    </div>
  );
}