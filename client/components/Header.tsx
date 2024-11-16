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

const UnauthorizedNav = () => {
  return authItems.map((items) => (
    <a href={items.path} key={items.index}>
      {items.lable}
    </a>
  ));
};

const AuthorizedNavbar = () => {
  const router = useRouter();

  return navItems.map((item) => (
    <p
      key={item.index}
      onClick={() => router.push(item.path)}
      className="cursor-pointer"
    >
      {item.label}
    </p>
  ));
};

const Header = () => {
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const { status } = useSession();

  const router = useRouter();

  const handleOpenMobileMenu = () => {
    setOpenMobileMenu(!openMobileMenu);
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);

      if (screenWidth > 767) {
        setOpenMobileMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="py-2 ">
        <div className="px-8">
          <div className="flex items-center justify-between">
            <Image
              src={Logo}
              alt="ai-saas-logo"
              height={30}
              width={30}
              onClick={() => router.push("/")}
              className="cursor-pointer"
            />
            {status === "authenticated" ? (
              <>
                <div className="md:hidden" onClick={handleOpenMobileMenu}>
                  <Menu className=" h-5 w-5 text-muted-foreground" />
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-5 md:hidden">
                  <UnauthorizedNav />
                </div>
              </>
            )}

            <nav className="hidden md:flex gap-6  items-center text-sm">
              {status === "authenticated" ? (
                <>
                  <AuthorizedNavbar />
                </>
              ) : (
                <>
                  <UnauthorizedNav />
                </>
              )}
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </div>
      <MobileNavbar
        open={openMobileMenu}
        handleOpenMobileMenu={handleOpenMobileMenu}
      />
    </header>
  );
};

export default Header;
