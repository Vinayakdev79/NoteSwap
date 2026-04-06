'use client'

import { GraduationCap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-lg">
              <GraduationCap className="h-6 w-6 text-emerald-600" />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                NoteSwap
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The student marketplace for sharing knowledge and trading books. 
              Connect, learn, and save together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Marketplace</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Browse Notes</li>
              <li>Browse Books</li>
              <li>Upload Notes</li>
              <li>List a Book</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Help Center</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Share on WhatsApp</li>
              <li>Email Support</li>
              <li>Student Community</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} NoteSwap. All rights reserved. Built for students, by students.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with care for the student community
          </p>
        </div>
      </div>
    </footer>
  )
}
