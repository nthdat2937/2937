import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export function CTASection() {
  const benefits = [
    "14-day free trial",
    "No credit card required",
    "Cancel anytime",
    "24/7 support"
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,245,255,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(191,0,255,0.1),transparent)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="relative glass-card rounded-3xl p-12 md:p-20 text-center overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl" />
          
          {/* Content */}
          <div className="relative">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Ready to <span className="gradient-text">Transform</span> Your Business?
            </motion.h2>

            <motion.p
              className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Join over 10 million users worldwide and start building the future today.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <button className="btn-primary text-lg flex items-center gap-2 group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-gray-400">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span>{benefit}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
