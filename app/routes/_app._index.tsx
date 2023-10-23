import { getAuth } from "@clerk/remix/ssr.server";
import { redirect } from "@remix-run/node";
import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { desc, eq } from "drizzle-orm";
import ComposePost from "~/components/compose-post";
import PostCard from "~/components/post-card";
import { db } from "~/server/connection";
import { posts, users } from "~/server/schema";
import type { FeedData } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Publicaciones" },
    { name: "description", content: "Publicaciones, a community app by moaqz" },
  ];
};

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const { userId } = await getAuth({
    request,
    context,
    params,
  });

  if (userId == null) {
    return redirect("/sign-in?redirect_url=" + request.url);
  }

  const formData = await request.formData();
  const content = String(formData.get("content"));

  try {
    await db.insert(posts).values({
      content: content,
      userId: userId,
    });
  } catch (error) {
    return { ok: false };
  }

  return { ok: true };
};

export const loader = async () => {
  const data = await db
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
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .orderBy(desc(posts.createdAt));

  return {
    posts: data,
    next: null,
  };
};

export default function HomePage() {
  const { posts } = useLoaderData<FeedData>();

  return (
    <>
      <ComposePost />

      {posts && posts.length > 0 ? (
        posts.map((post) => {
          return <PostCard key={post.id} {...post} />;
        })
      ) : (
        <p className="py-6 px-4 text-center font-semibold text-gray-300">
          Nothing to see here
        </p>
      )}
    </>
  );
}
