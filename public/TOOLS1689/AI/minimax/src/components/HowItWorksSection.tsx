import { motion } from 'framer-motion';
import { Search, Wand2, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Discover",
    description: "Explore our platform and find the perfect tools for your needs.",
    gradient: "from-cyan-400 to-blue-500"
  },
  {
    icon: Wand2,
    number: "02",
    title: "Create",
    description: "Build and customize your solution with our intuitive drag-and-drop interface.",
    gradient: "from-purple-400 to-pink-500"
  },
  {
    icon: Rocket,
    number: "03",
    title: "Launch",
    description: "Deploy to production with one click and scale effortlessly.",
    gradient: "from-orange-400 to-red-500"
  }
];

export function HowItWorksSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,255,0.05),transparent)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-purple-400 font-semibold tracking-wider uppercase text-sm">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-white">
            From Idea to <span className="gradient-text">Reality</span> in Minutes
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                {/* Step card */}
                <div className="relative glass-card rounded-2xl p-8 text-center group">
                  {/* Number badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 glow-cyan`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 -translate-y-1/2 z-10">
                    <div className="w-12 h-12 rounded-full bg-[#0a0a0f] border border-gray-700 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
