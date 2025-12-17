import { useState, useEffect } from 'react'
import axios from 'axios'
import { Activity, Database, Server, Terminal, Plus, RefreshCw } from 'lucide-react'

// Pointing to your Laravel API
const API_URL = 'http://localhost:8000/api/v1';

function App() {
  const [jobs, setJobs] = useState([]);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Poll Backend every 3 seconds
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/jobs/latest`);
      setJobs(res.data);
    } catch (err) {
      console.error("API connection failed", err);
    }
  };

  const submitJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/jobs`, { url, type: 'generic' });
      setUrl('');
      fetchJobs();
    } catch (err) {
      setError("Failed to start job. Ensure Backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <Activity className="text-indigo-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">SpectraFlow</h1>
        </div>
        <div className="flex gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Server size={14}/> Node: Online</span>
            <span className="flex items-center gap-1 text-green-500"><Database size={14}/> DB: Connected</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto">
        {/* Input Section */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-8 shadow-xl">
            <form onSubmit={submitJob} className="flex gap-4">
                <input 
                  type="url" 
                  required
                  placeholder="Enter URL to scrape (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 px-6 rounded-xl font-medium flex items-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
                  Dispatch Job
                </button>
            </form>
            {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
        </div>

        {/* Results List */}
        <div className="space-y-4">
            <h2 className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Recent Operations</h2>
            {jobs.map(job => (
                <div key={job.id} className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 flex justify-between items-center hover:border-slate-700 transition">
                    <div className="flex items-center gap-4">
                        <StatusBadge status={job.status} />
                        <div>
                            <p className="font-medium text-slate-200">{job.target_url}</p>
                            <p className="text-xs text-slate-500 font-mono">{job.id}</p>
                        </div>
                    </div>
                    {job.payload && (
                        <button 
                            onClick={() => alert(JSON.stringify(job.payload, null, 2))}
                            className="p-2 hover:bg-slate-800 rounded-lg text-indigo-400"
                            title="View JSON Payload"
                        >
                            <Terminal size={20} />
                        </button>
                    )}
                </div>
            ))}
        </div>
      </main>
    </div>
  )
}

function StatusBadge({ status }) {
    const colors = {
        pending: "bg-slate-800 text-slate-400",
        processing: "bg-yellow-500/10 text-yellow-500 animate-pulse",
        completed: "bg-green-500/10 text-green-500",
        failed: "bg-red-500/10 text-red-500"
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${colors[status] || colors.pending}`}>
            {status}
        </span>
    );
}

export default App