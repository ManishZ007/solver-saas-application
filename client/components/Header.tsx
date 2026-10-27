"use client";

import Logo from "@/assets/logos/logo.png";
import Menu from "@/assets/menu.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MobileNavbar } from "./MobileNavbar";
import { ThemeToggle } from "./togglers/theme-toggle";
import { authItems, navItems } from "@/constants";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NotificationBell from "./notifications/NotificationBell";

const UnauthorizedNav = () =>
  authItems.map((item) => (
    <a
      href={item.path}
      key={item.index}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {item.lable}
    </a>
  ));

const AuthorizedNavbar = () => {
  const router = useRouter();
  return navItems.map((item) => (
    <button
      key={item.index}
      onClick={() => router.push(item.path)}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {item.label}
    </button>
  ));
};

const Header = () => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      if (window.innerWidth > 767) setOpenMobileMenu(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => router.push("/")} className="flex items-center gap-2 shrink-0">
          <Image src={Logo} alt="Solver logo" height={28} width={28} />
          <span className="font-bold text-base hidden sm:block">Solver</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          {status === "authenticated" ? <AuthorizedNavbar /> : <UnauthorizedNav />}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {status === "authenticated" && <NotificationBell />}
          <ThemeToggle />
          {status === "authenticated" && (
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-muted"
              onClick={() => setOpenMobileMenu(!openMobileMenu)}
            >
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
          {status !== "authenticated" && (
            <div className="flex gap-3 md:hidden">
              <UnauthorizedNav />
            </div>
          )}
        </div>
      </div>

      <MobileNavbar open={openMobileMenu} handleOpenMobileMenu={() => setOpenMobileMenu(false)} />
    </header>
  );
};

export default Header;
