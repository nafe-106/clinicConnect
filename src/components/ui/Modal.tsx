'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
  showClose = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => setMounted(true), []);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!mounted || !isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[96vw] h-[92vh]',
  };

  const modalUI = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      {/* PREMIUM BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* MODAL WINDOW */}
      <motion.div
        style={{ x, y }}
        initial={{ opacity: 0, scale: 0.96, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className={`
          relative w-full ${sizeStyles[size]}
          rounded-2xl
          bg-white/80 backdrop-blur-xl
          shadow-[0_20px_80px_rgba(0,0,0,0.25)]
          border border-white/20
          max-h-[90vh] overflow-hidden
        `}
      >

        {/* HEADER (DRAG HANDLE ONLY) */}
        {title && (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.15}
            onDragEnd={() => {
              // snap back to center
              x.set(0);
              y.set(0);
            }}
            className="flex items-center justify-between px-5 py-4 border-b border-white/30 cursor-grab active:cursor-grabbing select-none"
          >
            <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
              {title}
            </h2>

            {showClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-black/5 transition"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            )}
          </motion.div>
        )}

        {/* BODY */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {children}
        </div>

      </motion.div>
    </div>
  );

  return createPortal(modalUI, document.body);
}

export function ModalFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200/60 ${className}`}>
      {children}
    </div>
  );
}

export default Modal;