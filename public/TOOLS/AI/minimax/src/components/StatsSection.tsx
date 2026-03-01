import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function Counter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  { value: 10, suffix: "M+", label: "Active Users" },
  { value: 99.9, suffix: "%", label: "Uptime SLA" },
  { value: 150, suffix: "+", label: "Countries" },
  { value: 1, suffix: "B+", label: "API Requests/Day" }
];

export function StatsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <div className="text-4xl md:text-6xl font-bold gradient-text mb-2">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-400 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animated lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </section>
  );
}
