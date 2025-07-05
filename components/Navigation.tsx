"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Calendar, Home, Plus, User, LogOut } from "lucide-react";
import { ConnectButton } from "thirdweb/react";
import { cn } from "@/lib/utils";
import { client } from "@/config/client";
import { useWalletUser } from "@/components/providers/WalletUserProvider";

export default function Navigation() {
  const pathname = usePathname();
  const { account, user } = useWalletUser();
  console.log(user);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/dashboard", label: "Dashboard", icon: User }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">EventChain</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {account?.address ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground/80">
                {user && user.name ? user.name : account?.address ? account.address.slice(0, 6) + "..." + account.address.slice(-4) : ""}
              </span>
              {/* Optionally add a disconnect button here if available in your thirdweb version */}
            </div>
          ) : null}

          <ConnectButton
            client={client}
            appMetadata={{
              name: "EventChain",
              url: "https://eventchain.example.com"
            }}
          />
        </div>
      </div>
    </nav>
  );
}
