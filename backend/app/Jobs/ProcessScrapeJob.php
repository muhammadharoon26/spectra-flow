<?php

namespace App\Jobs;

use App\Models\ScrapingJob;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Log;

class ProcessScrapeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $jobRecord;

    /**
     * Create a new job instance.
     * Passing the Model automatically serializes it.
     */
    public function __construct(ScrapingJob $jobRecord)
    {
        $this->jobRecord = $jobRecord;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // 1. Update DB: Mark as Processing
        $this->jobRecord->update(['status' => 'processing', 'started_at' => now()]);

        try {
            // 2. Define Command Paths
            // We use the python inside our venv
            $pythonPath = "/opt/venv/bin/python3";
            $scriptPath = "/var/www/scraper/main_scraper.py";
            $url = escapeshellarg($this->jobRecord->target_url);

            Log::info("Starting Scraper for: {$url}");

            // 3. Execute Python
            // cmd: /opt/venv/bin/python3 /var/www/scraper/main_scraper.py --url="http..."
            $result = Process::run("{$pythonPath} {$scriptPath} --url={$url}");

            // 4. Check for Python Errors (Non-zero exit code)
            if ($result->failed()) {
                throw new \Exception($result->errorOutput() ?: "Unknown Python Error");
            }

            // 5. Parse the JSON Output from Python
            $output = $result->output();
            $jsonData = json_decode($output, true);

            if (!$jsonData) {
                throw new \Exception("Scraper returned invalid JSON: {$output}");
            }

            // 6. Success: Save to Postgres JSONB
            $this->jobRecord->update([
                'status' => 'completed',
                'payload' => $jsonData,
                'completed_at' => now()
            ]);

        } catch (\Exception $e) {
            // 7. Failure: Log and Update DB
            Log::error("Scrape Job Failed: " . $e->getMessage());

            $this->jobRecord->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);

            // Fail the queue job so we can see it in failed_jobs table
            $this->fail($e);
        }
    }
}