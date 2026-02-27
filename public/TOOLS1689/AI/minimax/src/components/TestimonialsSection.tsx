import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO at TechFlow",
    avatar: "SC",
    content: "This platform has completely transformed how we build and deploy our applications. The speed and reliability are unmatched.",
    gradient: "from-cyan-400 to-purple-500"
  },
  {
    name: "Marcus Johnson",
    role: "CTO at DataSphere",
    avatar: "MJ",
    content: "We've seen a 300% improvement in our workflow efficiency since switching. The AI-powered features are game-changing.",
    gradient: "from-purple-400 to-pink-500"
  },
  {
    name: "Elena Rodriguez",
    role: "Founder at CloudNine",
    avatar: "ER",
    content: "The best investment we've made. Our users love the seamless experience, and we've seen engagement skyrocket.",
    gradient: "from-orange-400 to-red-500"
  }
];

export function TestimonialsSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-900/10 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-pink-400 font-semibold tracking-wider uppercase text-sm">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-white">
            Loved by <span className="gradient-text">Innovators</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of companies that trust us to power their digital transformation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative glass-card rounded-2xl p-8 h-full">
                <Quote className="w-10 h-10 text-cyan-400/30 mb-4" />
                
                <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
