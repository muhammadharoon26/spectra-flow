<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('scraping_jobs', function (Blueprint $table) {
            // 1. Identity: Use UUID for security
            $table->uuid('id')->primary();

            // 2. Ownership: Who requested this?
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // 3. Request Details
            $table->string('target_url'); // The site to scrape
            $table->string('scraper_type')->default('generic'); // e.g., 'amazon', 'linkedin', 'generic'

            // 4. State Management (Crucial for Queues)
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])
                ->default('pending')
                ->index(); // Index this for faster dashboard queries

            // 5. The Output: PostgreSQL JSONB
            // Stores: {"title": "Product X", "price": "$100", ...}
            $table->jsonb('payload')->nullable();

            // 6. Observability
            $table->text('error_message')->nullable(); // Debugging info
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scraping_jobs');
    }
};