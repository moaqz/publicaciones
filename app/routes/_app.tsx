import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/remix";
import { Outlet } from "@remix-run/react";
import Navbar from "~/components/navbar";

export default function HomeLayout() {
  return (
    <>
      <SignedIn>
        <main>
          <div className="min-h-screen max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-[auto_1fr] relative">
            <Navbar />
            <div className="border-x border-x-gray-800">
              <Outlet />
            </div>
          </div>
        </main>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
