import { toast } from "sonner";
import { ShareIcon } from "./icons";
import { BASE_URL } from "~/lib/constants";

interface ShareButtonProps {
  author: string | null; // TODO: Investigate why the author can be null.
  postId: number;
}

export default function ShareButton(props: ShareButtonProps) {
  const postUrl = BASE_URL + `/${props.author}/${props.postId}`;

  const handleOnShare = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success("Post URL copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy URL to clipboard. Please try again later.");
    }
  };

  return (
    <button
      onClick={handleOnShare}
      aria-label="Copy post URL to clipboard"
      title="Copy post URL to clipboard"
    >
      <ShareIcon width={24} height={24} className="text-gray-400" />
    </button>
  );
}
