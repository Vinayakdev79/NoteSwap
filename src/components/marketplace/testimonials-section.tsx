'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    college: 'IIT Delhi',
    role: 'Computer Science',
    avatar: 'PS',
    rating: 5,
    text: "NoteSwap saved me so much money on reference books! I found a senior selling all the books I needed at half price. The WhatsApp connect feature is genius — I got my books the very next day.",
  },
  {
    name: 'Arjun Patel',
    college: 'NIT Trichy',
    role: 'Electronics',
    avatar: 'AP',
    rating: 5,
    text: "I uploaded my semester notes and earned ₹2,000 in the first month. The UPI payment integration is seamless — I receive money instantly after someone buys my notes. Absolutely love it!",
  },
  {
    name: 'Sneha Gupta',
    college: 'BITS Pilani',
    role: 'Mechanical Engineering',
    avatar: 'SG',
    rating: 5,
    text: "As someone who makes detailed notes, being able to share them and help other students while earning is amazing. The dashboard makes tracking sales super easy. Highly recommend for every student!",
  },
  {
    name: 'Rahul Verma',
    college: 'VIT Vellore',
    role: 'Information Technology',
    avatar: 'RV',
    rating: 5,
    text: "The free donated notes section helped me prepare for my backlogs. Students here are genuinely helpful. Found amazing quality handwritten notes that were better than any reference book.",
  },
  {
    name: 'Ananya Reddy',
    college: 'IIIT Hyderabad',
    role: 'Data Science',
    avatar: 'AR',
    rating: 4,
    text: "Clean interface, secure payments, and no annoying ads. NoteSwap feels like it was actually built for students. I've both bought and sold — the experience is smooth both ways.",
  },
  {
    name: 'Karthik Iyer',
    college: 'Anna University',
    role: 'Civil Engineering',
    avatar: 'KI',
    rating: 5,
    text: "I donated my old textbooks instead of throwing them away. A junior from my own college found them through NoteSwap and picked them up. Feels great to help while keeping things sustainable!",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
        />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group perspective-1000"
    >
      <div className="card-3d relative h-full rounded-2xl border border-white/6 bg-white/[0.03] p-6 hover:border-emerald-500/15 hover:bg-white/[0.05]">
        {/* Quote icon */}
        <div className="absolute top-4 right-4 opacity-5">
          <Quote className="h-10 w-10 text-emerald-400" />
        </div>

        {/* Stars */}
        <div className="mb-4">
          <StarRating rating={testimonial.rating} />
        </div>

        {/* Text */}
        <p className="text-sm text-slate-300 leading-relaxed mb-6 relative z-10">
          &ldquo;{testimonial.text}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">{testimonial.avatar}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{testimonial.name}</p>
            <p className="text-xs text-slate-500 truncate">{testimonial.role} &middot; {testimonial.college}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#080c16]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-sm font-medium text-amber-300 mb-4">
            <Star className="h-3.5 w-3.5" />
            Student Reviews
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Loved by Students{' '}
            <span className="text-gradient-primary">Everywhere</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Real stories from real students who use NoteSwap to learn smarter and save more.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
