import { useUser } from "@clerk/remix";
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Form, useSubmit } from "@remix-run/react";

export default function ComposePost() {
  const { user } = useUser();
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const submitAction = useSubmit();

  const HandleOnSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (content === "" || content.length > 200) {
      fieldRef.current?.focus();
      return;
    }

    const formData = new FormData();
    formData.append("content", content);

    submitAction(formData, { method: "post" });
    setContent("");
  };

  const handleOnChange = async (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const isValid = content !== "" && content.length < 200;

  return (
    <div className="px-4 py-6 border-b border-b-gray-800 flex gap-4 sticky top-0 bg-gray-950">
      <img
        src={user?.imageUrl ?? "placeholder-user.svg"}
        alt={`Profile picture of ${user?.username}`}
        className="h-8 w-8 rounded-full object-cover"
      />
      <Form className="flex flex-col gap-1.5 w-full" onSubmit={HandleOnSubmit}>
        <textarea
          name="content"
          placeholder="What's on your mind..."
          maxLength={200}
          ref={fieldRef}
          value={content}
          onChange={handleOnChange}
          className="bg-transparent resize-none min-h-[60px] p-1"
        />

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={!isValid}
            className="px-4 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none bg-blue-600 enabled:hover:bg-blue-700 focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </Form>
    </div>
  );
}
