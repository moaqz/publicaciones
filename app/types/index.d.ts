export type Post = {
  id: number;
  content: string;
  media?: unknown;
  userId: string;
  created_at: string | Date;
  author: {
    id: string;
    username: string | null;
    photo: string;
  };
};

export type PostWithLikesCount = Omit<Post, "userId"> & { likesCount: string };

export type FeedData = {
  posts: PostWithLikesCount[];
  next: number | null;
};

export type PostPageData = {
  post: PostWithLikesCount;
  hasLiked: boolean;
};
