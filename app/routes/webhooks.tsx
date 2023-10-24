import { json, type ActionFunctionArgs } from "@remix-run/node";
import { db } from "~/server/connection.server";
import { users } from "~/server/schema.server";

// Resource: https://docs.svix.com/receiving/verifying-payloads/why
// Resource: https://clerk.com/docs/users/sync-data-to-your-backend
// It's a good practice to verify webhooks.
const CLERK_CREATED_USER_EVENT = "user.created";

export async function action({ request }: ActionFunctionArgs) {
  const event = await request.json();

  try {
    if (event.type === CLERK_CREATED_USER_EVENT) {
      await db.insert(users).values({
        id: event.data.id,
        username: event.data.username ?? event.data.first_name,
        photo: event.data.image_url,
      });
    }

    return json({ ok: true });
  } catch (error) {
    return json({ ok: false });
  }
}
