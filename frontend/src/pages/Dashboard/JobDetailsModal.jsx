import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          <Card className="relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {job.status === 'completed' && <CheckCircle className="text-green-500 w-6 h-6" />}
                  Job Details
                </h2>
                <p className="text-sm text-gray-400 font-mono mt-1">{job.id}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Job Info */}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Target URL</label>
                <p className="text-white break-all">{job.target_url}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Status</label>
                  <p className="text-white capitalize">{job.status}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Created</label>
                  <p className="text-white text-sm">{new Date(job.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Scraped Data */}
              {job.payload && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Scraped Data</label>
                  <pre className="bg-black/40 border border-white/10 rounded-lg p-4 overflow-x-auto text-sm">
                    <code className="text-green-400">{JSON.stringify(job.payload, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default JobDetailsModal;
