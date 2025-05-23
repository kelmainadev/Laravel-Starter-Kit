<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Task extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    // Status constants
    const STATUS_TODO = 'todo';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_IN_REVIEW = 'in_review';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    // Priority constants
    const PRIORITY_LOW = 'low';
    const PRIORITY_MEDIUM = 'medium';
    const PRIORITY_HIGH = 'high';
    const PRIORITY_URGENT = 'urgent';

    protected $fillable = [
        'title',
        'description',
        'project_id',
        'assigned_to',
        'created_by',
        'status',
        'priority',
        'due_date',
        'estimated_hours',
        'actual_hours',
        'progress',
        'tags',
        'notes',
        'completed_at',
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_at' => 'datetime',
        'tags' => 'array',
    ];

    // Relationships
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopePending($query)
    {
        return $query->whereIn('status', [self::STATUS_TODO, self::STATUS_IN_PROGRESS, self::STATUS_IN_REVIEW]);
    }

    public function scopeAssignedTo($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeCreatedBy($query, $userId)
    {
        return $query->where('created_by', $userId);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
            ->whereNotIn('status', [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    public function scopeDueSoon($query, $days = 7)
    {
        return $query->whereBetween('due_date', [now(), now()->addDays($days)])
            ->whereNotIn('status', [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    // Accessors & Mutators
    public function getStatusBadgeAttribute()
    {
        $statusColors = [
            self::STATUS_TODO => 'secondary',
            self::STATUS_IN_PROGRESS => 'default',
            self::STATUS_IN_REVIEW => 'default',
            self::STATUS_COMPLETED => 'success',
            self::STATUS_CANCELLED => 'destructive',
        ];

        return [
            'text' => ucfirst(str_replace('_', ' ', $this->status)),
            'variant' => $statusColors[$this->status] ?? 'secondary',
        ];
    }

    public function getPriorityBadgeAttribute()
    {
        $priorityColors = [
            self::PRIORITY_LOW => 'secondary',
            self::PRIORITY_MEDIUM => 'default',
            self::PRIORITY_HIGH => 'destructive',
            self::PRIORITY_URGENT => 'destructive',
        ];

        return [
            'text' => ucfirst($this->priority),
            'variant' => $priorityColors[$this->priority] ?? 'secondary',
        ];
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->due_date && 
               $this->due_date->isPast() && 
               !in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    public function getIsDueSoonAttribute(): bool
    {
        return $this->due_date && 
               $this->due_date->isBetween(now(), now()->addDays(7)) &&
               !in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    // Helper methods
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'progress' => 100,
            'completed_at' => now(),
        ]);

        // Update project progress
        if ($this->project) {
            $this->project->updateProgress();
        }
    }

    public function canUserAccess($userId): bool
    {
        // Task creator or assigned user can access
        if ($this->created_by == $userId || $this->assigned_to == $userId) {
            return true;
        }

        // Project members can access
        if ($this->project && $this->project->canUserAccess($userId)) {
            return true;
        }

        return false;
    }

    public function canUserEdit($userId): bool
    {
        // Only creator, assigned user, or project owner can edit
        return $this->created_by == $userId || 
               $this->assigned_to == $userId || 
               ($this->project && $this->project->isOwner($userId));
    }

    /**
     * Register media collections for the task.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('attachments')
            ->acceptsMimeTypes([
                'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain',
                'application/zip',
                'application/x-rar-compressed',
            ]);
    }

    /**
     * Register media conversions for the task.
     */
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->sharpen(10)
            ->performOnCollections('attachments')
            ->nonQueued();
    }
}
