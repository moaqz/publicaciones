import { Link, useLocation } from "@remix-run/react";
import { HomeIcon, LogOutIcon, UserCircleIcon } from "./icons";
import { SignOutButton, useUser } from "@clerk/remix";

export default function Navbar() {
  const { user } = useUser();
  const location = useLocation().pathname;

  return (
    <nav className="fixed bottom-0 left-0 z-50 bg-gray-950 border-t border-t-gray-800 w-full sm:relative sm:border-t-0 sm:z-auto">
      <div className="flex items-center sm:flex-col sm:sticky sm:top-0">
        <Link
          to="/"
          className="h-16 w-16 flex items-center justify-center text-gray-300"
          title="Home"
        >
          <HomeIcon
            className={`w-6 h-6 ${
              location === "/" ? "text-white" : "opacity-50"
            }`}
          />
        </Link>

        <Link
          to={`/${user?.username}`}
          className="h-16 w-16 flex items-center justify-center text-gray-300"
          title="Profile"
        >
          <UserCircleIcon
            className={`w-6 h-6 ${
              location === `/${user?.username}` ? "text-white" : "opacity-50"
            }`}
          />
        </Link>

        <SignOutButton>
          <button
            className="h-16 w-16 flex items-center justify-center text-gray-300"
            title="Logout"
          >
            <LogOutIcon className="w-6 h-6 opacity-50" />
          </button>
        </SignOutButton>
      </div>
    </nav>
  );
}
