<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // Import UUID trait

class ScrapingJob extends Model
{
    use HasFactory, HasUuids; // Enable UUIDs

    // Allow mass assignment for these fields
    protected $fillable = [
        'user_id',
        'target_url',
        'scraper_type',
        'status',
        'payload',
        'error_message',
        'started_at',
        'completed_at'
    ];

    // Cast the payload automatically to an Array (PHP) / JSON (DB)
    protected $casts = [
        'payload' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Relationship: A job belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}