import { motion } from 'framer-motion';
import { 
  Zap, Shield, Globe, Cpu, Layers, Palette, 
  ArrowUpRight
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience blazing performance with our optimized infrastructure and cutting-edge caching systems.",
    gradient: "from-cyan-400 to-blue-500",
    glow: "glow-cyan"
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Enterprise-level security with end-to-end encryption and advanced threat protection.",
    gradient: "from-purple-400 to-pink-500",
    glow: "glow-purple"
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Deploy anywhere in the world with our distributed network of edge servers.",
    gradient: "from-green-400 to-cyan-500",
    glow: "glow-cyan"
  },
  {
    icon: Cpu,
    title: "AI-Powered",
    description: "Leverage the power of artificial intelligence for smarter automation and insights.",
    gradient: "from-orange-400 to-red-500",
    glow: "glow-pink"
  },
  {
    icon: Layers,
    title: "Seamless Integration",
    description: "Connect with your favorite tools through our extensive marketplace of integrations.",
    gradient: "from-blue-400 to-purple-500",
    glow: "glow-purple"
  },
  {
    icon: Palette,
    title: "Beautiful Design",
    description: "Stunning visuals and intuitive interfaces that captivate and engage your users.",
    gradient: "from-pink-400 to-rose-500",
    glow: "glow-pink"
  }
];

export function FeaturesSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-cyan-400 font-semibold tracking-wider uppercase text-sm">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Everything You Need to{' '}
            <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powerful tools and features designed to help you build, scale, and thrive in the digital age.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative glass-card rounded-2xl p-8 h-full transition-all duration-300 group-hover:-translate-y-2">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 ${feature.glow}`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed mb-6">
                  {feature.description}
                </p>

                <div className="flex items-center gap-2 text-cyan-400 font-medium group-hover:gap-3 transition-all">
                  <span>Learn more</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
