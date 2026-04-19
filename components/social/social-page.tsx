
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

  if (isLoading) {
    return (
      <div className="w-full px-6 py-6 space-y-6 animate-pulse">

      {/* --- HEADER --- */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-muted rounded-md" />
          <div className="h-8 w-64 bg-muted rounded-md" />
          <div className="h-4 w-80 bg-muted rounded-md" />
        </div>

        <div className="h-10 w-40 bg-muted rounded-md" />
      </div>

      {/* --- CARD --- */}
      <div className="border rounded-xl p-6 space-y-6">

        {/* Card Header */}
        <div className="space-y-2">
          <div className="h-6 w-40 bg-muted rounded-md" />
          <div className="h-4 w-56 bg-muted rounded-md" />
        </div>

        {/* --- POSTS GRID --- */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border rounded-xl overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="h-44 w-full bg-muted" />

              {/* Content */}
              <div className="p-4 space-y-3 flex-1">
                <div className="h-4 w-32 bg-muted rounded-md" />
                <div className="h-3 w-full bg-muted rounded-md" />
                <div className="h-3 w-5/6 bg-muted rounded-md" />
                <div className="h-3 w-2/3 bg-muted rounded-md" />

                {/* Footer */}
                <div className="flex justify-between items-center pt-4">
                  <div className="h-3 w-20 bg-muted rounded-md" />
                  <div className="h-5 w-16 bg-muted rounded-full" />
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
    );
  }

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