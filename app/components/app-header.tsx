import { Link } from "@remix-run/react";
import { ArrowLeftIcon } from "./icons";

export default function AppHeader() {
  return (
    <header className="border-b border-b-gray-800 px-4 py-5 sticky top-0 bg-gray-950">
      <Link
        to="/"
        className="text-gray-300 font-semibold inline-flex items-center gap-2 group transition-colors hover:text-gray-50"
      >
        <ArrowLeftIcon
          width={20}
          height={20}
          className="transition-transform group-hover:-translate-x-1"
        />
        <span>Home</span>
      </Link>
    </header>
  );
}
