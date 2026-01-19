"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

// Animated wave SVG for the hero section
export function AnimatedWaves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
      <svg
        className="relative block w-full h-[60px] md:h-[80px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        {/* Back wave - slowest */}
        <motion.path
          d="M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z"
          fill="rgba(255,255,255,0.1)"
          animate={{
            d: [
              "M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z",
              "M0,60 C150,30 350,90 600,60 C850,30 1050,90 1200,60 L1200,120 L0,120 Z",
              "M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Middle wave */}
        <motion.path
          d="M0,80 C200,50 400,100 600,70 C800,40 1000,90 1200,70 L1200,120 L0,120 Z"
          fill="rgba(255,255,255,0.15)"
          animate={{
            d: [
              "M0,80 C200,50 400,100 600,70 C800,40 1000,90 1200,70 L1200,120 L0,120 Z",
              "M0,70 C200,100 400,50 600,80 C800,100 1000,50 1200,80 L1200,120 L0,120 Z",
              "M0,80 C200,50 400,100 600,70 C800,40 1000,90 1200,70 L1200,120 L0,120 Z",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Front wave - fastest */}
        <motion.path
          d="M0,90 C300,70 500,110 700,85 C900,60 1100,100 1200,90 L1200,120 L0,120 Z"
          fill="rgba(255,255,255,0.2)"
          animate={{
            d: [
              "M0,90 C300,70 500,110 700,85 C900,60 1100,100 1200,90 L1200,120 L0,120 Z",
              "M0,85 C300,110 500,70 700,90 C900,110 1100,70 1200,85 L1200,120 L0,120 Z",
              "M0,90 C300,70 500,110 700,85 C900,60 1100,100 1200,90 L1200,120 L0,120 Z",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  )
}

// Animated floating bubbles for underwater effect
export function FloatingBubbles() {
  const bubbles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 10,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-white/10"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            bottom: -50,
          }}
          animate={{
            y: [0, -800],
            x: [0, Math.sin(bubble.id) * 50],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

// Hero content with fade-in animations
interface HeroContentProps {
  children: ReactNode
}

export function AnimatedHeroContent({ children }: HeroContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mx-auto max-w-3xl text-center"
    >
      {children}
    </motion.div>
  )
}

// Staggered title animation
export function AnimatedTitle({ children }: { children: ReactNode }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
    >
      {children}
    </motion.h1>
  )
}

export function AnimatedDescription({ children }: { children: ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-6 text-lg text-blue-100 md:text-xl"
    >
      {children}
    </motion.p>
  )
}

export function AnimatedButtons({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
    >
      {children}
    </motion.div>
  )
}

// Section fade in on scroll
interface FadeInSectionProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeInSection({ children, className = "", delay = 0 }: FadeInSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Staggered cards container
interface StaggerContainerProps {
  children: ReactNode
  className?: string
}

export function StaggerContainer({ children, className = "" }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animated number counter for stats
interface AnimatedStatProps {
  children: ReactNode
}

export function AnimatedStat({ children }: AnimatedStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2"
    >
      {children}
    </motion.div>
  )
}

// Animated step number
interface AnimatedStepProps {
  step: number
  children: ReactNode
}

export function AnimatedStep({ step, children }: AnimatedStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: step * 0.2,
        type: "spring",
        stiffness: 200
      }}
      className="relative text-center"
    >
      {children}
    </motion.div>
  )
}

// Pulsing step number
export function PulsingStepNumber({ step }: { step: number }) {
  return (
    <motion.div
      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white"
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(37, 99, 235, 0.4)",
          "0 0 0 15px rgba(37, 99, 235, 0)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: step * 0.5,
      }}
    >
      {step}
    </motion.div>
  )
}
