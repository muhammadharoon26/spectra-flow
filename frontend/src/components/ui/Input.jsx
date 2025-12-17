import { cn } from '../../lib/utils';

const Input = ({ className, error, ...props }) => {
  return (
    <div className="relative">
      <input
        className={cn(
          'flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 text-white',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <span className="absolute -bottom-5 left-0 text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
