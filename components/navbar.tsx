"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Disease Prediction", href: "/disease-prediction" },
  { name: "Recommendation", href: "/recommendation" },
  { name: "Weather", href: "/weather" },
  { name: "Contact-Us", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <Search className="h-8 w-8 text-green-600" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-green-600" />
            </div>
          </div>
          <span className="text-xl font-bold text-green-700 dark:text-green-400">Crop Care</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-green-600 dark:hover:text-green-400",
                pathname === item.href ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-green-600 dark:hover:text-green-400 py-2",
                      pathname === item.href ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button variant="outline" className="mt-4">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
