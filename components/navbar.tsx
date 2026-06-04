import Link from "next/link";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-8 flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold tracking-tight">
            CollegeDiscovery
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/colleges" className="transition-colors hover:text-[#2563EB]">
              Colleges
            </Link>
            <Link href="/compare" className="transition-colors hover:text-[#2563EB]">
              Compare
            </Link>
            <Link href="/predictor" className="transition-colors hover:text-[#2563EB]">
              Rank Predictor
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {/* Mock Auth for now, actual Auth will be handled via Supabase Auth UI / components */}
          <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild className="bg-[#2563EB] hover:bg-[#2563EB]/90">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
