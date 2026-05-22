'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { FileText, BookOpen, Users, IndianRupee, GraduationCap, TrendingUp } from 'lucide-react'

function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

const stats = [
  {
    icon: FileText,
    value: 500,
    suffix: '+',
    label: 'Notes Uploaded',
    description: 'Study materials shared by students',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BookOpen,
    value: 200,
    suffix: '+',
    label: 'Books Listed',
    description: 'Textbooks available for trade',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Users,
    value: 1000,
    suffix: '+',
    label: 'Active Students',
    description: 'Growing student community',
    gradient: 'from-cyan-500 to-sky-500',
  },
  {
    icon: IndianRupee,
    value: 50000,
    suffix: '+',
    label: 'Money Saved',
    description: 'Students saved on study materials',
    gradient: 'from-emerald-500 to-green-500',
  },
]

export default function StatsSection() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-950 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-morph-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl animate-morph-blob" style={{ animationDelay: '-6s' }} />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Trusted by Students{' '}
            <span className="text-gradient-primary">Across India</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Join a thriving community of students who are sharing knowledge and saving money every day.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
              <div className="relative p-6 md:p-8 rounded-2xl glass text-center hover:bg-white/12 transition-all duration-500">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                
                {/* Number */}
                <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                
                {/* Label */}
                <p className="text-sm font-medium text-emerald-300 mb-1">{stat.label}</p>
                <p className="text-xs text-slate-400/60">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
