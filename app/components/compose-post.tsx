import { useUser } from "@clerk/remix";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

export default function ComposePost() {
  const { user } = useUser();
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current?.reset();
    }
  }, [isSubmitting]);

  return (
    <div className="px-4 py-6 border-b border-b-gray-800 flex gap-4 sticky top-0 bg-gray-950">
      <img
        src={user?.imageUrl ?? "placeholder-user.svg"}
        alt={`Profile picture of ${user?.username}`}
        className="h-8 w-8 rounded-full object-cover"
      />
      <fetcher.Form
        className="flex flex-col gap-1.5 w-full"
        action="/comment"
        method="POST"
        ref={formRef}
      >
        <textarea
          name="content"
          placeholder="What's on your mind..."
          required
          minLength={1}
          maxLength={200}
          className="bg-transparent resize-none min-h-[60px] p-1"
        />

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none bg-blue-600 enabled:hover:bg-blue-700 focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Post"}
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}
