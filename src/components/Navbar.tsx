import React from "react";
import { ModeToggle } from "./DarkModeButton";
import Link from "next/link";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";

interface NavbarProps {
  classname? : string;
}

const Navbar = ({classname}:NavbarProps) => {
  const { data: session } = useSession();

  return (
    <nav className={`top-0 z-20 flex justify-between p-4 md:p-6 w-full ${classname}`}>
      <h2 className="font-bold text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        Password Manager
      </h2>
      <div className="flex gap-2">
        <ModeToggle />
        {session ? (
          <Link href="/sign-in">
            <Button className="bg-gradient-to-r hover:from-green-400 hover:to-blue-500 from-pink-500 to-yellow-500" onClick={() => signOut()}>
              Logout
            </Button>
          </Link>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-gradient-to-r hover:from-green-400 hover:to-blue-500 from-pink-500 to-yellow-500">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
