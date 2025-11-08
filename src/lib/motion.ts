// Polyfill for framer-motion to use CSS animations instead
import { forwardRef, ReactNode } from 'react';

interface MotionProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  layoutId?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// Simple motion.div replacement
export const motion = {
  div: forwardRef<HTMLDivElement, MotionProps>(({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`${className} animate-fade-in`} {...props as any}>
      {children}
    </div>
  )),
  span: forwardRef<HTMLSpanElement, MotionProps>(({ children, className = '', ...props }, ref) => (
    <span ref={ref} className={`${className}`} {...props as any}>
      {children}
    </span>
  )),
  h1: forwardRef<HTMLHeadingElement, MotionProps>(({ children, className = '', ...props }, ref) => (
    <h1 ref={ref} className={`${className} animate-fade-in`} {...props as any}>
      {children}
    </h1>
  )),
  p: forwardRef<HTMLParagraphElement, MotionProps>(({ children, className = '', ...props }, ref) => (
    <p ref={ref} className={`${className} animate-fade-in`} {...props as any}>
      {children}
    </p>
  )),
  button: forwardRef<HTMLButtonElement, MotionProps>(({ children, className = '', ...props }, ref) => (
    <button ref={ref} className={`${className}`} {...props as any}>
      {children}
    </button>
  )),
};

// AnimatePresence - just renders children
export function AnimatePresence({ children }: { children?: ReactNode; mode?: string }) {
  return <>{children}</>;
}

// Hooks polyfills
export function useScroll(options?: any) {
  return { scrollYProgress: { get: () => 0 } };
}

export function useTransform(value: any, input: any[], output: any[]) {
  return output[0];
}
