"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const page = () => {
  const { data: session } = useSession();
  return (
    <div>
      page
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default page;
