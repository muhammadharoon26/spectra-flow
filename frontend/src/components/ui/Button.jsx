import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = ({ children, className, variant = 'primary', size = 'md', isLoading = false, icon: Icon, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 neon-glow',
    secondary: 'bg-accent text-accent-foreground hover:bg-accent/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </motion.button>
  );
};

export default Button;
