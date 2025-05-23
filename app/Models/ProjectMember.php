<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectMember extends Model
{
    use HasFactory;

    // Role constants
    const ROLE_MEMBER = 'member';
    const ROLE_MANAGER = 'manager';
    const ROLE_VIEWER = 'viewer';

    protected $fillable = [
        'project_id',
        'user_id',
        'role',
        'joined_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
    ];

    // Relationships
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    public function scopeManagers($query)
    {
        return $query->where('role', self::ROLE_MANAGER);
    }

    public function scopeMembers($query)
    {
        return $query->where('role', self::ROLE_MEMBER);
    }

    // Helper methods
    public function canManageProject(): bool
    {
        return in_array($this->role, [self::ROLE_MANAGER]);
    }

    public function canEditTasks(): bool
    {
        return in_array($this->role, [self::ROLE_MEMBER, self::ROLE_MANAGER]);
    }

    public function canViewOnly(): bool
    {
        return $this->role === self::ROLE_VIEWER;
    }
}
