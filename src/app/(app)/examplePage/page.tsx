"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import GetStarted from "@/components/GetStarted";
import MessagesCards from "@/components/MessagesCards";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
          duration: 1.0,
          ease: "easeInOut",
        }}
        className="relative w-full flex flex-col items-center justify-center"
      >
        <h1>Hello, Next.js!</h1>
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            One stop to save all your passwords.
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Password Manager - Where your passwords are securely stored.
          </p>
        </section>
        <MessagesCards />
        <Link href="/sign-up">
          <GetStarted />
        </Link>
      </motion.div>
        <Footer />
    </AuroraBackground>
  );
};

export default page;
