import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-surface-border/60 py-6 text-center text-xs text-zinc-600">
        Eventra — built on top of the Event Registration System API.
      </footer>
    </div>
  );
}
