<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

class ScrapingJob extends Model
{
    use HasFactory, HasUuids;

    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = false;

    /**
     * The data type of the primary key ID.
     */
    protected $keyType = 'string';

    /**
     * Generate a new UUID v4 for the model.
     * Override default UUID v7 for PostgreSQL compatibility.
     */
    public function newUniqueId(): string
    {
        return (string) Str::uuid();
    }

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