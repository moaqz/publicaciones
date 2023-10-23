import { UserButton } from "@clerk/remix";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Publicaciones" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return <UserButton />;
}
