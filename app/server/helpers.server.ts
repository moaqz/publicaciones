import { desc, eq, sql } from "drizzle-orm";
import { db } from "./connection.server";
import { posts, postsLikes, users } from "./schema.server";

export async function getPostsWithLikesCountQuery() {
  const postLikesSq = db
    .select({
      postId: postsLikes.postId,
      likesCount: sql<string>`count(*)`.as("likes_count"),
    })
    .from(postsLikes)
    .groupBy(postsLikes.postId)
    .as("post_likes_sq");

  return db
    .select({
      id: posts.id,
      content: posts.content,
      media: posts.media,
      created_at: posts.createdAt,
      author: {
        id: users.id,
        username: users.username,
        photo: users.photo,
      },
      likesCount: sql<string>`coalesce(${postLikesSq.likesCount}, '0')`,
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .leftJoin(postLikesSq, eq(posts.id, postLikesSq.postId))
    .orderBy(desc(posts.createdAt));
}
