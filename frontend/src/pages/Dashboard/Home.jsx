import { useState, useEffect } from 'react';
import useSWR from 'swr';
import api from '../../api/axios';
import JobSubmission from './JobSubmission';
import JobHistory from './JobHistory';

// SWR fetcher
const fetcher = url => api.get(url).then(res => res.data);

const Home = () => {
  // Poll for jobs every 2 seconds
  const { data: jobs, error, mutate } = useSWR('/v1/jobs', fetcher, { 
    refreshInterval: 2000,
    fallbackData: []
  });

  const handleJobCreated = () => {
    mutate(); // Refresh immediately
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor and manage your scraping operations.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-card px-4 py-2 rounded-lg border border-white/5">
            <span className="text-xs text-gray-500 uppercase block">Queue Status</span>
            <span className="text-green-400 font-mono text-sm">● Operational</span>
          </div>
        </div>
      </div>

      <JobSubmission onJobCreated={handleJobCreated} />
      <JobHistory jobs={jobs || []} />
    </div>
  );
};

export default Home;
