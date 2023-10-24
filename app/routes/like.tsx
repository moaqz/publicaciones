import { getAuth } from "@clerk/remix/ssr.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { and, eq } from "drizzle-orm";
import { db } from "~/server/connection";
import { postsLikes } from "~/server/schema";

export const action = async ({
  context,
  params,
  request,
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
  const postId = Number(formData.get("post_id"));
  const likeAction = formData.get("like_action");

  if (isNaN(postId) || postId <= 0) {
    return json(
      { status: "fail", message: "Invalid or missing post id" },
      { status: 400 },
    );
  }

  if (
    typeof likeAction !== "string" ||
    (likeAction !== "up" && likeAction !== "down")
  ) {
    return json(
      { status: "fail", message: "Invalid like action" },
      { status: 400 },
    );
  }

  try {
    if (likeAction === "up") {
      await db.insert(postsLikes).values({
        postId: postId,
        userId: userId,
      });
    }

    if (likeAction === "down") {
      await db
        .delete(postsLikes)
        .where(
          and(eq(postsLikes.userId, userId), eq(postsLikes.postId, postId)),
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      // @ts-ignore
      if (error.code === "23503") {
        return json(
          { status: "fail", message: `Post with ID ${postId} does not exists` },
          { status: 400 },
        );
      }
    }

    return json({ status: "fail" }, { status: 500 });
  }

  return json({ status: "success" });
};
