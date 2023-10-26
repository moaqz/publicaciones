import { Link, useLocation } from "@remix-run/react";
import { HomeIcon } from "./icons";
import { UserButton } from "@clerk/remix";

export default function Navbar() {
  const location = useLocation().pathname;

  return (
    <nav className="fixed bottom-0 left-0 z-50 bg-gray-950 border-t border-t-gray-800 w-full sm:relative sm:border-t-0 sm:z-auto">
      <div className="px-6 flex justify-between items-center sm:min-h-screen sm:px-0 sm:justify-between sm:flex-col sm:sticky sm:top-0 sm:py-6">
        <Link
          to="/"
          className=" flex items-center justify-center text-gray-300 focus:outline focus:outline-2 focus:outline-blue-600 focus:outline-offset-4 rounded-md"
          title="Home"
        >
          <HomeIcon
            className={`w-6 h-6 ${
              location === "/" ? "text-white" : "opacity-50"
            }`}
          />
        </Link>

        <div className="h-16 w-16 flex items-center justify-center">
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
