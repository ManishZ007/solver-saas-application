import { Copyright } from "lucide-react";
import React from "react";
import { Separator } from "../ui/separator";

const Footer = () => {
  return (
    <footer className="py-5">
      <div className="container">
        <Separator className="my-5" />
        <div className="flex items-center justify-center gap-4">
          <Copyright className="h-4 w-4" /> 2024 All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
