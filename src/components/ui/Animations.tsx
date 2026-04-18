'use client';

import { motion, AnimatePresence } from 'framer-motion';

export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const cardHover = {
  whileHover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  whileTap: { scale: 0.98 }
};

export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionMain = motion.main;

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12
    }
  }
};

export const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

export const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

export const heroItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15
    }
  }
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.2 }
  }
};

export const buttonTap = {
  whileTap: { scale: 0.95 },
  whileHover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

export function AnimatedCard({ 
  children, 
  delay = 0,
  className = "",
  whileHover = true
}: { 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
  whileHover?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }}
      whileHover={whileHover ? { 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedList({ 
  children, 
  className = ""
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedPage({ 
  children, 
  className = ""
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimateOnScroll({ 
  children, 
  threshold = 0.1,
  className = ""
}: { 
  children: React.ReactNode; 
  threshold?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold }}
      transition={{ 
        duration: 0.6,
        type: "spring" as const,
        stiffness: 80,
        damping: 20
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}