'use client'

import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'

function FloatingShape({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        y: [0, -30, -10, -35, 0],
        x: [0, 15, -10, 5, 0],
        rotate: [0, 10, -5, 15, 0],
        scale: [1, 1.05, 0.95, 1.1, 1],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  )
}

function Particle({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      animate={{
        y: [0, -100, -50, -120, 0],
        x: [0, 20, -15, 10, 0],
        opacity: [0.2, 0.8, 0.4, 0.6, 0.2],
        scale: [0.5, 1, 0.8, 1.2, 0.5],
      }}
      transition={{
        duration: 8 + delay * 2,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  )
}

function GlassCard({ icon: Icon, title, desc, delay = 0 }: { icon: React.ElementType; title: string; desc: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <div className="relative z-10 p-6 rounded-2xl glass hover:bg-white/12 transition-all duration-500 h-full">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300">
          <Icon className="h-6 w-6 text-emerald-300" />
        </div>
        <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
        <p className="text-xs text-emerald-100/60 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

export default function HeroSection() {
  const { setCurrentView, setShowAuthDialog, currentUser } = useAppStore()

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.png"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950/60 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* 3D Floating Geometric Shapes */}
      <FloatingShape
        className="top-[15%] left-[8%] w-20 h-20 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 rotate-12"
        delay={0}
      />
      <FloatingShape
        className="top-[25%] right-[12%] w-16 h-16 rounded-full border border-teal-400/15 bg-teal-500/5"
        delay={2}
      />
      <FloatingShape
        className="bottom-[30%] left-[15%] w-12 h-12 rounded-lg border border-cyan-400/20 bg-cyan-500/5 -rotate-12"
        delay={4}
      />
      <FloatingShape
        className="top-[60%] right-[8%] w-24 h-24 rounded-3xl border border-emerald-400/10 bg-emerald-500/3 rotate-45"
        delay={1}
      />
      <FloatingShape
        className="top-[10%] right-[30%] w-8 h-8 rounded-md border border-teal-300/20 bg-teal-400/10"
        delay={3}
      />

      {/* Glowing particles */}
      <Particle className="w-2 h-2 bg-emerald-400 top-[20%] left-[20%]" delay={0} />
      <Particle className="w-1.5 h-1.5 bg-teal-300 top-[40%] right-[25%]" delay={1.5} />
      <Particle className="w-2.5 h-2.5 bg-emerald-300 bottom-[35%] left-[30%]" delay={0.8} />
      <Particle className="w-1 h-1 bg-cyan-400 top-[15%] right-[40%]" delay={2.5} />
      <Particle className="w-2 h-2 bg-teal-400 bottom-[20%] right-[15%]" delay={1.2} />
      <Particle className="w-1.5 h-1.5 bg-emerald-400 top-[55%] left-[45%]" delay={3} />

      {/* Orbital Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.04]">
        <div className="absolute inset-0 rounded-full border border-emerald-400 animate-spin-slow" />
        <div className="absolute inset-8 rounded-full border border-teal-400 animate-spin-slow-reverse" />
        <div className="absolute inset-16 rounded-full border border-emerald-400/50 animate-spin-slow" style={{ animationDuration: '30s' }} />
      </div>

      {/* Morphing blob */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 animate-morph-blob blur-3xl opacity-60" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/5 animate-morph-blob blur-3xl opacity-40" style={{ animationDelay: '-6s' }} />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2.5 rounded-full glass px-5 py-2.5 text-sm font-medium text-emerald-200">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>India&apos;s First Student Marketplace</span>
              <ChevronRight className="h-3.5 w-3.5 text-emerald-400/60" />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Study Smarter,{' '}
              <br className="hidden sm:block" />
              <span className="text-gradient-primary">
                Trade Wiser
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-base md:text-lg text-slate-300/70 max-w-2xl mx-auto leading-relaxed mb-14"
          >
            Upload &amp; sell study notes, find affordable textbooks, connect with
            students directly. The smarter way to share knowledge and save money.
          </motion.p>

          {/* Feature Cards - Glass 3D */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 max-w-3xl mx-auto mb-14 perspective-1000">
            <GlassCard
              icon={Zap}
              title="Sell & Donate Notes"
              desc="Upload PDFs, set your price or donate to help peers succeed."
              delay={0.4}
            />
            <GlassCard
              icon={TrendingUp}
              title="Trade Old Books"
              desc="Buy, sell, lend or donate textbooks. Connect via WhatsApp."
              delay={0.55}
            />
            <GlassCard
              icon={ShieldCheck}
              title="Secure Payments"
              desc="Razorpay-powered UPI payments. Instant downloads for notes."
              delay={0.7}
            />
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 gap-2 text-base px-10 h-13 rounded-xl font-semibold shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 group"
              onClick={() => setCurrentView('notes')}
            >
              Explore Marketplace
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-xl animate-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base px-10 h-13 rounded-xl font-semibold border-white/15 text-white/90 hover:bg-white/8 hover:text-white hover:border-white/25 transition-all duration-300"
              onClick={() => currentUser ? setCurrentView('dashboard') : setShowAuthDialog(true)}
            >
              {!currentUser ? 'Get Started Free' : 'Go to Dashboard'}
            </Button>
          </motion.div>

          {/* Trust indicator */}
          {!currentUser && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="text-center text-sm text-slate-400/60 mt-6"
            >
              Free to join &middot; No credit card needed &middot; Join 1,000+ students
            </motion.p>
          )}
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.2 }}
        className="relative z-10"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="glass-dark">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20">
              {[
                { value: '500+', label: 'Notes Shared' },
                { value: '200+', label: 'Books Listed' },
                { value: '1,000+', label: 'Active Students' },
                { value: '₹50K+', label: 'Saved by Students' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl md:text-2xl font-bold text-gradient-primary">{stat.value}</p>
                  <p className="text-xs text-slate-400/60 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
