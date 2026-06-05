import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-8 flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold tracking-tight">
            CollegeDiscovery
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/colleges" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Colleges
            </Link>
            <Link href="/compare" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Compare
            </Link>
            <Link href="/predictor" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Rank Predictor
            </Link>
            <Link href="/discover" className="text-sm font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center gap-1">
              MatchMaker ✨
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:inline-block">
                {user.email}
              </span>
              <form action="/auth/signout" method="post">
                <Button variant="outline" type="submit">
                  Log out
                </Button>
              </form>
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
