<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ScrapingJob;
use App\Jobs\ProcessScrapeJob;
use Illuminate\Http\Request;
use Illuminate\Support\Str; // For generating UUIDs

class JobController extends Controller
{
    // 1. Submit a Job
    public function store(Request $request)
    {
        // Validation: Ensure we get a valid URL
        $validated = $request->validate([
            'url' => 'required|url',
            'type' => 'nullable|string|in:generic,amazon,linkedin'
        ]);

        // Create the Database Record (Pending State)
        // We use a UUID manually here so we can return it immediately
        $job = ScrapingJob::create([
            'id' => Str::uuid(),
            'user_id' => 1, // Hardcoded for now (Auth comes later)
            'target_url' => $validated['url'],
            'scraper_type' => $validated['type'] ?? 'generic',
            'status' => 'pending'
        ]);

        // Dispatch to Redis Queue
        // The 'queue_worker' container will pick this up
        ProcessScrapeJob::dispatch($job);

        // Return 202 Accepted (Standard for Async tasks)
        return response()->json([
            'message' => 'Scraping job started successfully.',
            'job_id' => $job->id,
            'status_url' => url("/api/v1/jobs/{$job->id}")
        ], 202);
    }

    // 2. Check Status
    public function show($id)
    {
        $job = ScrapingJob::findOrFail($id);

        return response()->json([
            'job_id' => $job->id,
            'status' => $job->status,
            'data' => $job->payload, // Will be null until complete
            'created_at' => $job->created_at,
            'completed_at' => $job->completed_at
        ]);
    }
}