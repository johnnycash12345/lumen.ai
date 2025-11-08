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

// Create individual components with forwardRef
const MotionDiv = forwardRef<HTMLDivElement, MotionProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`${className} animate-fade-in`} {...props as any}>
      {children}
    </div>
  )
);
MotionDiv.displayName = 'MotionDiv';

const MotionSpan = forwardRef<HTMLSpanElement, MotionProps>(
  ({ children, className = '', ...props }, ref) => (
    <span ref={ref} className={className} {...props as any}>
      {children}
    </span>
  )
);
MotionSpan.displayName = 'MotionSpan';

const MotionH1 = forwardRef<HTMLHeadingElement, MotionProps>(
  ({ children, className = '', ...props }, ref) => (
    <h1 ref={ref} className={`${className} animate-fade-in`} {...props as any}>
      {children}
    </h1>
  )
);
MotionH1.displayName = 'MotionH1';

const MotionP = forwardRef<HTMLParagraphElement, MotionProps>(
  ({ children, className = '', ...props }, ref) => (
    <p ref={ref} className={`${className} animate-fade-in`} {...props as any}>
      {children}
    </p>
  )
);
MotionP.displayName = 'MotionP';

const MotionButton = forwardRef<HTMLButtonElement, MotionProps>(
  ({ children, className = '', ...props }, ref) => (
    <button ref={ref} className={className} {...props as any}>
      {children}
    </button>
  )
);
MotionButton.displayName = 'MotionButton';

// Export as motion object
export const motion = {
  div: MotionDiv,
  span: MotionSpan,
  h1: MotionH1,
  p: MotionP,
  button: MotionButton,
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
