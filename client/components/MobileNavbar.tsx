"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import {
  ChartPie,
  Home,
  LogOut,
  Moon,
  Sun,
  Tags,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "@/assets/logos/logo.png";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { signOut } from "next-auth/react";

const mobileNavbarItems = [
  {
    label: "Home",
    icon: <Home className="h-4 w-4" />,
    link: "/",
  },
  {
    label: "About",
    icon: <Users className="h-4 w-4" />,
    link: "/about",
  },
  {
    label: "Pricing",
    icon: <Tags className="h-4 w-4" />,
    link: "/pricing",
  },
  {
    label: "Dashboard",
    icon: <ChartPie className="h-4 w-4" />,
    link: "/dashboard",
  },
  {
    label: "Profile",
    icon: <User className="h-4 w-4" />,
    link: "/dashboard/profile",
  },
];

type MobileMenuProps = {
  open?: boolean;
  handleOpenMobileMenu?: () => void;
};

export function MobileNavbar({ open, handleOpenMobileMenu }: MobileMenuProps) {
  const { setTheme, resolvedTheme } = useTheme();

  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={handleOpenMobileMenu}>
      <SheetContent>
        <SheetHeader className="flex flex-col gap-2">
          <SheetTitle className=" text-start flex gap-3 mt-5 ">
            <Image src={Logo} alt="ai-saas-logo" className="h-7 w-6" />
            <p className="text-sm">Get start with solver</p>
          </SheetTitle>
          <SheetDescription className="text-start">
            Community-powered coding solutions with optional AI assistance for
            smarter problem-solving.
          </SheetDescription>
        </SheetHeader>
        <Separator className="mt-4" />
        <div className="flex flex-col gap-2 py-4 ">
          <ul className="flex flex-col gap-5">
            {mobileNavbarItems.map(({ label, icon, link }, index) => (
              <li
                key={index}
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  if (handleOpenMobileMenu) {
                    handleOpenMobileMenu();
                  }
                  router.push(link);
                }}
              >
                {icon}
                {label}
              </li>
            ))}
          </ul>

          <div className="absolute bottom-10 w-full">
            <Separator className="my-4" />

            <ul className="flex flex-col gap-2">
              <li
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => {
                  if (handleOpenMobileMenu) {
                    signOut();
                    handleOpenMobileMenu();
                  }
                }}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </li>
              <li>
                <Button size={`icon`} variant={"outline"} className="mt-5">
                  {resolvedTheme == "dark" ? (
                    <>
                      <Sun
                        className="h-4 w-4 text-orange-300"
                        onClick={() => setTheme("light")}
                      />
                    </>
                  ) : (
                    <>
                      <Moon
                        className="h-4 w-4"
                        onClick={() => setTheme("dark")}
                      />
                    </>
                  )}
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
