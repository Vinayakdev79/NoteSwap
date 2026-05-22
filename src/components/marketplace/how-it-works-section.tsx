'use client'

import { motion } from 'framer-motion'
import { Upload, Search, Handshake } from 'lucide-react'

const steps = [
  {
    step: 1,
    icon: Upload,
    title: 'Upload & List',
    description: 'Create an account, upload your study notes as PDFs, or list your old books with details and pricing.',
    gradient: 'from-emerald-500 to-teal-500',
    bgGlow: 'bg-emerald-500/15',
  },
  {
    step: 2,
    icon: Search,
    title: 'Browse & Connect',
    description: 'Other students browse and buy your notes securely via UPI, or connect with you directly for books via WhatsApp.',
    gradient: 'from-teal-500 to-cyan-500',
    bgGlow: 'bg-teal-500/15',
  },
  {
    step: 3,
    icon: Handshake,
    title: 'Earn & Share',
    description: 'Earn money on every note sale. Meet up for book exchanges. Help each other succeed academically!',
    gradient: 'from-cyan-500 to-sky-500',
    bgGlow: 'bg-cyan-500/15',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0f1c]" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-sm font-medium text-teal-300 mb-4">
            Simple & Quick
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            How It{' '}
            <span className="text-gradient-primary">Works</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Get started in three simple steps and join our growing student community.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 -translate-y-1/2">
            <div className="w-full h-full bg-white/5 rounded-full" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="w-full h-full bg-gradient-to-r from-emerald-500/40 via-teal-500/40 to-cyan-500/40 rounded-full origin-left"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative text-center group"
              >
                {/* Step circle */}
                <div className="relative mx-auto mb-8">
                  {/* Glow */}
                  <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-3xl ${item.bgGlow} blur-xl group-hover:scale-125 transition-transform duration-500`} />
                  
                  {/* Circle */}
                  <div className={`relative w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-9 w-9 text-white" />
                  </div>

                  {/* Step badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#0a0f1c] border border-white/10 shadow-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-300">{item.step}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
