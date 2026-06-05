import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AnimatedNav } from "./animated-nav";

export async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-8 flex h-14 items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-xl relative z-50 mix-blend-difference text-white">
          CollegeDiscovery
        </Link>
        <AnimatedNav user={user} />
      </div>
    </header>
  );
}
