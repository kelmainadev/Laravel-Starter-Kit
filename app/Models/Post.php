<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    use HasFactory;

    // Status constants
    const STATUS_DRAFT = 'draft';
    const STATUS_PUBLISHED = 'published';
    const STATUS_FLAGGED = 'flagged';
    const STATUS_REJECTED = 'rejected';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'status',
        'moderation_notes',
        'moderated_by',
        'moderated_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'moderated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the post.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the moderator of the post.
     */
    public function moderator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }

    /**
     * Scope a query to only include published posts.
     */
    public function scopePublished($query)
    {
        return $query->where('status', self::STATUS_PUBLISHED);
    }

    /**
     * Scope a query to only include flagged posts.
     */
    public function scopeFlagged($query)
    {
        return $query->where('status', self::STATUS_FLAGGED);
    }

    /**
     * Scope a query to only include posts needing moderation.
     */
    public function scopeNeedsModeration($query)
    {
        return $query->where('status', self::STATUS_FLAGGED)
            ->orWhere(function ($q) {
                $q->where('status', self::STATUS_DRAFT)
                    ->whereNull('moderated_at');
            });
    }
}
