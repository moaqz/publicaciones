import { useFetcher } from "@remix-run/react";
import { HeartIcon } from "./icons";

interface LikeButtonProps {
  hasLiked: boolean;
  postId: number;
}

// TODO: show a toast when the action fail.
export default function LikeButton(props: LikeButtonProps) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="POST" action="/like">
      <input
        type="hidden"
        name="like_action"
        value={props.hasLiked ? "down" : "up"}
      />
      <input type="hidden" name="post_id" value={props.postId} />
      <button type="submit" aria-label="Like">
        <HeartIcon
          width={24}
          height={24}
          className={`${
            props.hasLiked
              ? "fill-red-500 text-red-500"
              : "text-gray-400 fill-none"
          }`}
        />
      </button>
    </fetcher.Form>
  );
}
