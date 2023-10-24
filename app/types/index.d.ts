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

export type FeedData = {
  posts: Omit<Post, "userId">[];
  next: number | null;
};

export type PostPageData = {
  post: Omit<Post, "userId"> & {
    likesCount: string;
  };
  hasLiked: boolean;
};
