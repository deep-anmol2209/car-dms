export const queryKeys = {
    social: {
      all: ["social"] as const,
      posts: () => [...queryKeys.social.all, "posts"] as const,
      recentPosts: () => [...queryKeys.social.posts(), "recent"] as const,
    },
  };