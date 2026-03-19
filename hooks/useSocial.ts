

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys/social";



export async function fetchRecentPosts() {
    const res = await fetch("/api/social");
  
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }
  
    const data = await res.json();
  
    if (!data.success) {
      throw new Error(data.message || "Error fetching posts");
    }
  
    return data.data;
  }


  export function useRecentPosts() {
    return useQuery({
      queryKey: queryKeys.social.recentPosts(),
      queryFn: fetchRecentPosts,
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false,
    });
  }