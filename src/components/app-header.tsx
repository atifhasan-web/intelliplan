
"use client";

import Link from "next/link";
import {
  Book,
  Bell,
  CheckSquare,
  Timer,
  Home,
  Search,
  Settings,
  Target,
  Moon,
  Sun,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { HamburgerIcon } from "./hamburger-icon";
import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearch } from "@/hooks/use-search";


const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/tasks", icon: CheckSquare, label: "Tasks" },
    { href: "/pomodoro", icon: Timer, label: "Timer" },
    { href: "/reminder", icon: Bell, label: "Reminder" },
    { href: "/goals", icon: Target, label: "Goals" },
];

export function AppHeader() {
  const pathname = usePathname();
  const { user } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const { searchQuery, setSearchQuery } = useSearch();

  // Manage theme state
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };


  const handleLinkClick = () => {
    setIsMenuOpen(false);
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleFeatureNotImplemented = () => {
    toast({
        title: "Coming Soon",
        description: "This feature is not yet implemented.",
    })
  }

  const filteredNavItems = useMemo(() => {
    if (!searchQuery) {
        return navItems;
    }
    return navItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <HamburgerIcon isOpen={isMenuOpen} />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <SheetHeader>
            <SheetTitle className="text-left">Navigation</SheetTitle>
          </SheetHeader>
          <nav className="grid gap-6 text-lg font-medium mt-4">
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Book className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">IntelliPlan</span>
            </Link>
            {filteredNavItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleLinkClick} className={cn("flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground", pathname === item.href && "text-foreground")}>
                    <item.icon className="h-5 w-5" />
                    {item.label}
                </Link>
            ))}
            <Link href="/settings" onClick={handleLinkClick} className={cn("flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground", pathname === "/settings" && "text-foreground")}>
                <Settings className="h-5 w-5" />
                Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="relative ml-auto flex flex-1 items-center gap-2 md:grow-0">
        <Button variant="outline" size="icon" className="shrink-0 h-10 w-10" onClick={toggleTheme}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user?.displayName ?? user?.email}&backgroundColor=a7d1ab,b3e2cd,fde3a7,f9a8a8,d1c4e9,b2dfdb`} alt="User avatar" />
              <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user?.displayName ?? user?.email ?? 'My Account'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/settings')}>Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
