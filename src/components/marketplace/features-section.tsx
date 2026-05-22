'use client'

import { motion } from 'framer-motion'
import { 
  FileText, BookOpen, ShieldCheck, Zap, Users, MessageCircle,
  Upload, Download, Wallet, BarChart3, Star
} from 'lucide-react'

const features = [
  {
    icon: Upload,
    title: 'Upload Study Notes',
    description: 'Share your PDFs, handwritten notes, or typed study material. Set your own price or donate to help peers.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BookOpen,
    title: 'Trade Old Books',
    description: 'Sell, lend, or donate your used textbooks. Connect with buyers directly via WhatsApp or email.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Wallet,
    title: 'Secure UPI Payments',
    description: 'Razorpay-powered payment gateway for safe transactions. Instant digital downloads for purchased notes.',
    gradient: 'from-emerald-500 to-cyan-500',
  },
  {
    icon: Download,
    title: 'Instant Downloads',
    description: 'Purchase and download notes instantly. No waiting, no hassle. Start studying right away.',
    gradient: 'from-cyan-500 to-sky-500',
  },
  {
    icon: BarChart3,
    title: 'Seller Dashboard',
    description: 'Track your sales, earnings, and downloads. Set up UPI for instant payouts on every sale.',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    icon: MessageCircle,
    title: 'Direct Connection',
    description: 'Connect with book sellers via WhatsApp or email. No middlemen, direct student-to-student deals.',
    gradient: 'from-teal-500 to-emerald-500',
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group perspective-1000"
    >
      <div className="card-3d relative h-full rounded-2xl border border-white/6 bg-white/[0.03] p-6 md:p-8 hover:border-emerald-500/20 hover:bg-white/[0.05]">
        {/* Gradient accent top bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Icon */}
        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <feature.icon className="h-7 w-7 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {feature.description}
        </p>

        {/* Hover arrow */}
        <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-emerald-400 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
          Learn more
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

export default function FeaturesSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#080c16]" />
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm font-medium text-emerald-300 mb-4">
            <Star className="h-3.5 w-3.5" />
            Why NoteSwap?
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Everything You Need,{' '}
            <span className="text-gradient-primary">One Platform</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            A complete marketplace built for Indian students. Share notes, find books, earn money — all in one place.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
