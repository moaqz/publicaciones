import { getAuth } from "@clerk/remix/ssr.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { db } from "~/server/connection.server";
import { posts } from "~/server/schema.server";

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
  const content = formData.get("content");

  if (
    typeof content !== "string" ||
    content.length < 1 ||
    content.length > 200
  ) {
    return json({ error: "Missing or Invalid content" }, { status: 400 });
  }

  try {
    await db.insert(posts).values({
      content: content,
      userId: userId,
    });

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
