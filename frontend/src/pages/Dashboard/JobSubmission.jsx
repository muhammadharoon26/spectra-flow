import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../api/axios';

const JobSubmission = ({ onJobCreated }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const { data } = await api.post('/v1/jobs', { url, type: 'generic' });
      setUrl('');
      if (onJobCreated) onJobCreated(data);
    } catch (error) {
      console.error("Failed to submit job", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8 border-primary/20 bg-primary/5">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 w-full">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="text-primary w-6 h-6" />
            New Extraction
          </h2>
          <p className="text-gray-400 mb-6">Enter a target URL to begin the asynchronous scraping process.</p>
          
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="https://example.com/product/123"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-black/50 border-primary/20 focus-visible:ring-primary/50 text-lg h-12"
              />
            </div>
            <Button type="submit" size="lg" isLoading={loading} icon={Search}>
              Start Scraper
            </Button>
          </form>
        </div>
        
        {/* Visual Decoration */}
        <div className="hidden md:block w-1/3">
           <div className="relative h-32 w-full flex items-center justify-center">
             <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="w-24 h-24 border-2 border-dashed border-primary/30 rounded-full"
             />
             <motion.div 
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute w-12 h-12 bg-primary/20 rounded-full backdrop-blur-md"
             />
           </div>
        </div>
      </div>
    </Card>
  );
};

export default JobSubmission;
