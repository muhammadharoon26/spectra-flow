import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Card = ({ children, className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('rounded-xl glass-panel p-6 text-card-foreground', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
