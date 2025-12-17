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
        // HasUuids trait automatically generates the UUID
        $job = ScrapingJob::create([
            'user_id' => $request->user()->id, // Use authenticated user
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

    // Add this method to the class
    // 3. List User Jobs
    public function index(Request $request)
    {
        return ScrapingJob::where('user_id', $request->user()->id ?? 1)
            ->latest()
            ->limit(20)
            ->get();
    }
}