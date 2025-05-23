<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    // Status constants
    const STATUS_PLANNING = 'planning';
    const STATUS_ACTIVE = 'active';
    const STATUS_ON_HOLD = 'on_hold';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    // Priority constants
    const PRIORITY_LOW = 'low';
    const PRIORITY_MEDIUM = 'medium';
    const PRIORITY_HIGH = 'high';
    const PRIORITY_URGENT = 'urgent';

    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'status',
        'priority',
        'start_date',
        'due_date',
        'budget',
        'progress',
        'tags',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
        'budget' => 'decimal:2',
        'tags' => 'array',
    ];

    // Relationships
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_members')
            ->withPivot(['role', 'joined_at'])
            ->withTimestamps();
    }

    public function projectMembers(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopeByOwner($query, $userId)
    {
        return $query->where('owner_id', $userId);
    }

    public function scopeByMember($query, $userId)
    {
        return $query->whereHas('members', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }

    // Accessors & Mutators
    public function getStatusBadgeAttribute()
    {
        $statusColors = [
            self::STATUS_PLANNING => 'secondary',
            self::STATUS_ACTIVE => 'default',
            self::STATUS_ON_HOLD => 'destructive',
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

    // Helper methods
    public function isOwner($userId): bool
    {
        return $this->owner_id == $userId;
    }

    public function isMember($userId): bool
    {
        return $this->members()->where('user_id', $userId)->exists();
    }

    public function canUserAccess($userId): bool
    {
        return $this->isOwner($userId) || $this->isMember($userId);
    }

    public function getCompletionPercentage(): int
    {
        $totalTasks = $this->tasks()->count();
        if ($totalTasks === 0) {
            return 0;
        }

        $completedTasks = $this->tasks()->where('status', Task::STATUS_COMPLETED)->count();
        return round(($completedTasks / $totalTasks) * 100);
    }

    public function updateProgress(): void
    {
        $this->update(['progress' => $this->getCompletionPercentage()]);
    }
}
