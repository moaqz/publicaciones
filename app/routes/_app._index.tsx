import type { MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import ComposePost from "~/components/compose-post";
import PostCard from "~/components/post-card";
import { getPostsWithLikesCountQuery } from "~/server/helpers.server";
import type { FeedData } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Publicaciones" },
    { name: "description", content: "Publicaciones, a community app by moaqz" },
  ];
};

export const loader = async () => {
  const data = await getPostsWithLikesCountQuery();

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

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="px-4 py-5 space-y-1">
        <span className="text-gray-400 font-semibold text-lg">404 Error</span>
        <h1 className="text-2xl text-gray-100 font-bold pretty">
          Sorry, we can't seem to find what you're looking for.
        </h1>
        <p className="text-lg text-gray-300 font-medium pretty">
          You've landed on a URL that doesn't seem to exists on Publicaciones.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-1">
      <span className="text-gray-400 font-semibold text-lg">500 Error</span>
      <h1 className="text-2xl text-gray-100 font-bold pretty">
        Oops, something went wrong.
      </h1>
    </div>
  );
}
