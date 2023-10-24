import type { WebhookEvent } from "@clerk/remix/api.server";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Webhook } from "svix";
import { db } from "~/server/connection.server";
import { users } from "~/server/schema.server";

// Resource: https://docs.svix.com/receiving/verifying-payloads/why
// Resource: https://clerk.com/docs/users/sync-data-to-your-backend
// It's a good practice to verify webhooks.
const CLERK_CREATED_USER_EVENT = "user.created";
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET_KEY || "";

export async function action({ request }: ActionFunctionArgs) {
  const body = JSON.stringify(await request.json());
  const sivx = new Webhook(WEBHOOK_SECRET);

  try {
    const payload = sivx.verify(body, {
      "svix-id": request.headers.get("svix-id") ?? "",
      "svix-signature": request.headers.get("svix-signature") ?? "",
      "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
    }) as WebhookEvent;

    if (payload.type === CLERK_CREATED_USER_EVENT) {
      await db.insert(users).values({
        id: payload.data.id,
        username: payload.data.username ?? payload.data.first_name,
        photo: payload.data.image_url,
      });
    }

    return json({ success: true });
  } catch (error) {
    return json({ success: false });
  }
}
