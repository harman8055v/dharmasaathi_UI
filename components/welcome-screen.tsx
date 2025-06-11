"use client"

import { motion } from "framer-motion"
import { Heart, Users, Compass, Sparkles, CheckCircle, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  onStartOver: () => void
}

export default function WelcomeScreen({ onStartOver }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-slate-800/50 w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl shadow-2xl p-6 sm:p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 12 }}
          className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-maroon-700 to-maroon-900 rounded-full flex items-center justify-center shadow-lg"
        >
          <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-3xl sm:text-4xl font-light text-maroon-800 dark:text-maroon-300 mb-3"
        >
          Welcome to DharmaSaathi!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8"
        >
          May your journey from drama to dharma bring deep connection and joy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-left p-4 sm:p-5 bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl mb-8 flex items-start space-x-3 sm:space-x-4"
        >
          <CheckCircle className="w-8 h-8 sm:w-7 sm:h-7 mt-0.5 text-maroon-700 dark:text-maroon-500 flex-shrink-0" />
          <div>
            <h2 className="text-md sm:text-lg font-medium text-maroon-800 dark:text-maroon-300 mb-1">
              Profile Under Review
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Your profile may take up to 4 business days to be verified due to the high volume of applications. We
              appreciate your patience!
            </p>
          </div>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-xl sm:text-2xl font-medium text-slate-800 dark:text-slate-200 mb-6"
        >
          What's Next?
        </motion.h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {[
            { icon: Users, title: "Connect", text: "Meet aligned souls." },
            { icon: Compass, title: "Explore", text: "Discover shared values." },
            { icon: Sparkles, title: "Grow", text: "Evolve on your journey." },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + idx * 0.15, duration: 0.4 }}
              className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-maroon-100 dark:bg-maroon-900/40 rounded-full flex items-center justify-center">
                <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-maroon-700 dark:text-maroon-400" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-700 dark:text-slate-200 mb-1">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="flex flex-col space-y-3 sm:space-y-4"
        >
          <Button className="w-full bg-maroon-800 hover:bg-maroon-700 dark:bg-maroon-700 dark:hover:bg-maroon-600 text-white py-3 rounded-xl text-base sm:text-lg font-medium">
            Explore the App
          </Button>
          <Button
            onClick={onStartOver}
            variant="ghost"
            className="w-full text-slate-600 dark:text-slate-400 hover:text-maroon-700 dark:hover:text-maroon-400 hover:bg-maroon-50 dark:hover:bg-maroon-900/30 py-3 rounded-xl text-base sm:text-lg"
          >
            <Edit3 className="w-4 h-4 mr-2" /> Edit Profile Information
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
