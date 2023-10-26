import { getAuth } from "@clerk/remix/ssr.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { and, eq, sql } from "drizzle-orm";
import AppHeader from "~/components/app-header";
import LikeButton from "~/components/like-button";
import ShareButton from "~/components/share-button";
import { formatDate } from "~/lib/date-utils";
import { db } from "~/server/connection.server";
import { posts, postsLikes, users } from "~/server/schema.server";
import type { PostPageData } from "~/types";

export const loader = async ({
  context,
  params,
  request,
}: LoaderFunctionArgs) => {
  const { userId } = await getAuth({
    request,
    context,
    params,
  });

  const postId = Number(params.postId);
  if (isNaN(postId) || postId <= 0) {
    throw new Response("Post not found: The  post does not exist.", {
      status: 404,
    });
  }

  const postData = await db
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
      likesCount: sql<string>`(SELECT COUNT(*) FROM posts_likes WHERE post_id = ${postId})`,
    })
    .from(posts)
    .where(eq(posts.id, postId))
    .innerJoin(users, eq(posts.userId, users.id));

  if (Array.isArray(postData) && !postData.length) {
    throw new Response("Post not found: The  post does not exist.", {
      status: 404,
    });
  }

  let hasLiked = false;
  if (userId) {
    const likeRecord = await db
      .select({ id: postsLikes.postId })
      .from(postsLikes)
      .where(and(eq(postsLikes.userId, userId), eq(postsLikes.postId, postId)));

    hasLiked = likeRecord.length > 0;
  }

  return {
    post: postData.at(0),
    hasLiked,
  };
};

export default function PostPage() {
  const { post, hasLiked } = useLoaderData<PostPageData>();

  return (
    <>
      <AppHeader />
      <article className="px-4 py-6 grid gap-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author.photo}
            alt={`Profile picture of ${post.author.username}`}
            className="h-10 w-10 rounded-full object-cover"
          />

          <span className="text-gray-400 hover:underline">
            {post.author.username}
          </span>
        </div>

        <p className="text-gray-300">{post.content}</p>

        <time
          dateTime={post.created_at.toString()}
          className="text-gray-400 text-sm font-semibold border-y border-y-gray-800 py-4"
        >
          {formatDate(new Date(post.created_at))}
        </time>

        <span className="text-gray-400 text-sm font-semibold border-b border-b-gray-800 pb-4">
          0 Comments, {post.likesCount}{" "}
          {post.likesCount === "1" ? "Like" : "Likes"}
        </span>

        <div className="flex justify-around items-center border-b border-b-gray-800 pb-4">
          <LikeButton hasLiked={hasLiked} postId={post.id} />
          <ShareButton author={post.author.username} postId={post.id} />
        </div>
      </article>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <>
        <AppHeader />
        <div className="px-4 py-5 space-y-1">
          <span className="text-gray-400 font-semibold text-lg">404 Error</span>
          <h1 className="text-2xl text-gray-100 font-bold pretty">
            Sorry, we can't seem to find what you're looking for.
          </h1>
          <p className="text-lg text-gray-300 font-medium pretty">
            You've landed on a URL that doesn't seem to exists on Publicaciones.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="px-4 py-5 space-y-1">
        <span className="text-gray-400 font-semibold text-lg">500 Error</span>
        <h1 className="text-2xl text-gray-100 font-bold pretty">
          Oops, something went wrong.
        </h1>
      </div>
    </>
  );
}
