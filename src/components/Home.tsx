"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import GetStarted from "@/components/GetStarted";
import MessagesCards from "@/components/MessagesCards";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";
import React from "react";
import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <AuroraBackground>
      <Navbar classname={"fixed"}  />
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
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-700 dark:text-stone-200">
            One stop to save all your passwords.
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg dark:text-stone-200">
            Password Manager - Where your passwords are securely stored.
          </p>
        </section>
        <MessagesCards />
        <Link href="/sign-up" className="mt-3">
          <GetStarted />
        </Link>
      </motion.div>
      <Footer classname="absolute" />
    </AuroraBackground>
  );
};

export default Home;
