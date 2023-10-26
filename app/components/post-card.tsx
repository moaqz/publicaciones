import { Link } from "@remix-run/react";
import { getRelativeTimeString } from "~/lib/date-utils";
import type { PostWithLikesCount } from "~/types";

export default function PostCard(props: PostWithLikesCount) {
  return (
    <Link
      to={`/${props.author.username}/${props.id}`}
      className="block hover:transition-colors hover:bg-gray-900 outline-none focus:bg-gray-900"
    >
      <article className="px-4 py-6 grid grid-cols-[auto_1fr] gap-3 border-b border-gray-800">
        <img
          src={props.author.photo}
          alt={`Profile picture of ${props.author.username}`}
          className="h-8 w-8 rounded-full object-cover"
        />

        <div className="flex flex-col gap-2">
          <span className="text-gray-400 text-sm">
            {props.author.username} ·{" "}
            <time dateTime={props.created_at.toString()}>
              {getRelativeTimeString(new Date(props.created_at))}
            </time>
          </span>

          <p className="text-gray-300">{props.content}</p>

          <span className="text-gray-400 text-sm">
            0 Comments, {props.likesCount}{" "}
            {props.likesCount === "1" ? "Like" : "Likes"}
          </span>
        </div>
      </article>
    </Link>
  );
}
