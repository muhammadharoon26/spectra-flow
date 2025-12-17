import { CheckCircle2, CircleDashed, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import Card from '../../components/ui/Card';
import JobDetailsModal from './JobDetailsModal';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    failed: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const icons = {
    pending: Clock,
    processing: CircleDashed,
    completed: CheckCircle2,
    failed: AlertCircle,
  };

  const Icon = icons[status] || Clock;

  return (
    <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', styles[status])}>
      <Icon className={cn("w-3.5 h-3.5", status === 'processing' && "animate-spin")} />
      <span className="capitalize">{status}</span>
    </div>
  );
};

const JobHistory = ({ jobs }) => {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <>
      <Card>
        <h3 className="text-xl font-bold text-white mb-4">Recent Jobs</h3>
        
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <div className="bg-black/40 px-4 py-3 border-b border-white/10 grid grid-cols-12 text-xs font-medium text-gray-400 uppercase tracking-wider">
            <div className="col-span-1">ID</div>
            <div className="col-span-6">Target URL</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3 text-right">Created</div>
          </div>

          <div className="divide-y divide-white/5 bg-black/20">
            <AnimatePresence initial={false}>
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onClick={() => setSelectedJob(job)}
                  className="grid grid-cols-12 px-4 py-3 items-center hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div className="col-span-1 font-mono text-xs text-gray-500 truncate" title={job.id}>
                    {job.id.substring(0, 4)}...
                  </div>
                  <div className="col-span-6 text-sm text-gray-300 truncate pr-4">
                    <span className="flex items-center gap-2 group-hover:text-primary transition-colors">
                      {job.target_url}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>
                  <div className="col-span-2">
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="col-span-3 text-right text-xs text-gray-500 font-mono">
                    {new Date(job.created_at).toLocaleString()}
                  </div>
                </motion.div>
              ))}
              
              {jobs.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No jobs found. Start your first extraction above.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </>
  );
};

export default JobHistory;
