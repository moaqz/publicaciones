import { getRelativeTimeString } from "~/lib/date-utils";
import type { Post } from "~/types";

export default function PostCard(props: Omit<Post, "userId">) {
  return (
    <div className="px-4 py-6 border-b border-gray-800">
      <div className="flex items-center gap-2 text-gray-400">
        <img
          src={props.author.photo}
          alt={`Profile picture of ${props.author.username}`}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span>
          {props.author.username} ·{" "}
          {getRelativeTimeString(new Date(props.created_at))}
        </span>
      </div>
      <p className="mt-4 text-gray-300">{props.content}</p>
    </div>
  );
}
