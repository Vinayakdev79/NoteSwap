'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react'

export default function CTASection() {
  const { setCurrentView, setShowAuthDialog, currentUser } = useAppStore()

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950/50 to-slate-950" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Morphing blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-3xl animate-morph-blob" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/8 rounded-full blur-3xl animate-morph-blob" style={{ animationDelay: '-6s' }} />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-emerald-400/20`}
            style={{
              width: `${4 + (i % 4) * 2}px`,
              height: `${4 + (i % 4) * 2}px`,
              top: `${15 + (i * 7) % 70}%`,
              left: `${10 + (i * 13) % 80}%`,
            }}
            animate={{
              y: [0, -40, -20, -60, 0],
              x: [0, 20, -15, 10, 0],
              opacity: [0.2, 0.6, 0.3, 0.5, 0.2],
            }}
            transition={{
              duration: 6 + i * 0.8,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-emerald-200 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Join the Community
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight"
          >
            Ready to Share Knowledge{' '}
            <br className="hidden sm:block" />
            <span className="text-gradient-primary">&amp; Earn Money?</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300/70 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Join 1,000+ students who are already sharing notes, trading books, and saving money.
            It&apos;s free, fast, and built for you.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {[
              { icon: Zap, text: 'Instant Downloads' },
              { icon: ShieldCheck, text: 'Secure UPI Payments' },
              { icon: Sparkles, text: '100% Free to Join' },
            ].map((pill) => (
              <div key={pill.text} className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium text-emerald-200">
                <pill.icon className="h-3.5 w-3.5 text-emerald-400" />
                {pill.text}
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 gap-2 text-base px-10 h-13 rounded-xl font-semibold shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 group"
              onClick={() => {
                if (!currentUser) {
                  setShowAuthDialog(true)
                } else {
                  setCurrentView('dashboard')
                }
              }}
            >
              {currentUser ? 'Go to Dashboard' : 'Create Free Account'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base px-10 h-13 rounded-xl font-semibold border-white/15 text-white/90 hover:bg-white/8 hover:text-white hover:border-white/25 transition-all duration-300"
              onClick={() => setCurrentView('notes')}
            >
              Browse Marketplace
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
