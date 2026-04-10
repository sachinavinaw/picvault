import { CloudArrowUpIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { useLoading } from "../stores/loadingStore";
import Loader from "./Loader";

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-1.5 ${isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"}`;
}

export default function Layout() {
  const isLoading = useLoading();
  const location = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "Upload | PicVault",
      "/gallery": "Gallery | PicVault",
    };
    document.title = titles[location.pathname] || "PicVault";
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <Loader />}
      <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-orange-700 flex items-center gap-1">
          <ShieldCheckIcon className="size-6 text-gray-600" />
          PicVault
        </span>
        <nav className="flex gap-6 text-sm font-medium">
          <NavLink to="/" className={navLinkClass}>
            <CloudArrowUpIcon className="size-5" />
            Upload
          </NavLink>
          <NavLink to="/gallery" end className={navLinkClass}>
            <PhotoIcon className="size-5" />
            Gallery
          </NavLink>
        </nav>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 ">
        <Outlet />
      </main>

      <footer className="bg-gray-100 text-center text-sm text-gray-500 py-4">
        &copy; 2026 PicVault. All rights reserved.
      </footer>
    </div>
  );
}
