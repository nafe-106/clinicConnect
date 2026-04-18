'use client';

import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({ 
  children, 
  className = "",
  delay = 0 
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({ 
  children, 
  className = "",
  delay = 0,
  index = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: delay + index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedListItem({ 
  children, 
  className = "",
  index = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ 
  children, 
  className = ""
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    duration: 0.5, 
    ease: [0.25, 0.46, 0.45, 0.94]
  }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { 
    duration: 0.4, 
    ease: "easeOut"
  }
};

export function PageTransition({ 
  children, 
  className = ""
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroTitle({ 
  children, 
  className = ""
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }}
      className={className}
    >
      {children}
    </motion.h1>
  );
}

export function AnimatedStatCard({ 
  children, 
  className = "",
  index = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.2 + index * 0.1,
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}