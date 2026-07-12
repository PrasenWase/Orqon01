import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import './Card.css';

interface CardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={clsx('card', hoverable && 'card-hoverable', className)}
        {...props}
      >
        {children as React.ReactNode}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
