"use client";

import HeroVideoDialog from "@/components/magicui/hero-video";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

function HeroPill() {
  return (
    <motion.a
      href="/blog/introducing-loopearn"
      className="bg-primary/20 ring-accent flex w-auto items-center space-x-2 rounded-full px-2 py-1 whitespace-pre ring-1"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}>
      <div className="bg-accent text-primary w-fit rounded-full px-2 py-0.5 text-center text-xs font-medium sm:text-sm">
        📣 Announcement
      </div>
      <p className="text-primary text-xs font-medium sm:text-sm">Introducing Loopearn</p>
      <svg
        width="12"
        height="12"
        className="ml-1"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.78141 5.33312L5.20541 1.75712L6.14808 0.814453L11.3334 5.99979L6.14808 11.1851L5.20541 10.2425L8.78141 6.66645H0.666748V5.33312H8.78141Z"
          fill="hsl(var(--primary))"
        />
      </svg>
    </motion.a>
  );
}

function HeroTitles() {
  return (
    <div className="flex w-full max-w-2xl flex-col space-y-4 overflow-hidden pt-8">
      <motion.h1
        className="text-foreground text-center text-4xl leading-tight font-medium sm:text-5xl md:text-6xl"
        initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease,
          staggerChildren: 0.2,
        }}>
        {["Open", "Source", "Rewards", "Infrastructure"].map((text, index) => (
          <motion.span
            key={index}
            className="inline-block px-1 font-semibold text-balance md:px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: index * 0.2,
              ease,
            }}>
            {text}
          </motion.span>
        ))}
      </motion.h1>
      <motion.p
        className="text-muted-foreground mx-auto max-w-xl text-center text-lg leading-7 text-balance sm:text-xl sm:leading-9"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.6,
          duration: 0.8,
          ease,
        }}>
        LoopEarn combines the trust of open-source infrastructure with enterprise-grade SaaS tools to help
        businesses gamify customer engagement.
      </motion.p>
    </div>
  );
}

function HeroImage() {
  return (
    <motion.div
      className="relative mx-auto flex w-full items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 1, ease }}>
      <HeroVideoDialog
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="/dashboard.png"
        thumbnailAlt="Hero Video"
        className="mt-16 max-w-screen-lg rounded-lg border shadow-lg"
      />
    </motion.div>
  );
}

export default function Hero2() {
  return (
    <section id="hero">
      <div className="relative flex w-full flex-col items-center justify-start px-4 pt-32 sm:px-6 sm:pt-24 md:pt-32 lg:px-8">
        <HeroPill />
        <HeroTitles />
        <HeroImage />
        <div className="from-background via-background pointer-events-none absolute inset-x-0 -bottom-12 h-1/3 bg-gradient-to-t to-transparent lg:h-1/4"></div>
      </div>
    </section>
  );
}
