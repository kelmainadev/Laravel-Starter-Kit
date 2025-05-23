<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    // Define status constants
    const STATUS_ACTIVE = 'active';
    const STATUS_SUSPENDED = 'suspended';
    const STATUS_INACTIVE = 'inactive';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'avatar',
        'bio',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if the user account is active.
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Check if the user account is suspended.
     *
     * @return bool
     */
    public function isSuspended(): bool
    {
        return $this->status === self::STATUS_SUSPENDED;
    }

    /**
     * Get the posts for the user.
     */
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Get the posts moderated by the user.
     */
    public function moderatedPosts()
    {
        return $this->hasMany(Post::class, 'moderated_by');
    }

    /**
     * Get the user's avatar URL with fallback to default.
     */
    public function getAvatarUrlAttribute()
    {
        if ($this->avatar) {
            // If avatar is a full URL, return as is
            if (filter_var($this->avatar, FILTER_VALIDATE_URL)) {
                return $this->avatar;
            }
            // If avatar is a file path, prepend storage URL
            return asset('storage/' . $this->avatar);
        }
        
        // Return default avatar based on user initials
        return $this->getDefaultAvatarUrl();
    }

    /**
     * Get default avatar URL using initials.
     */
    public function getDefaultAvatarUrl()
    {
        $initials = $this->getInitials();
        $backgroundColor = $this->getAvatarBackgroundColor();
        
        // Using a service like UI Avatars or similar
        return "https://ui-avatars.com/api/?name=" . urlencode($initials) . 
               "&background=" . $backgroundColor . 
               "&color=ffffff&size=200&font-size=0.6";
    }

    /**
     * Get user initials.
     */
    public function getInitials()
    {
        $words = explode(' ', trim($this->name));
        $initials = '';
        
        foreach ($words as $word) {
            if (!empty($word)) {
                $initials .= strtoupper(substr($word, 0, 1));
                if (strlen($initials) >= 2) break;
            }
        }
        
        return $initials ?: 'U';
    }

    /**
     * Get a consistent background color for the user's avatar.
     */
    private function getAvatarBackgroundColor()
    {
        $colors = [
            '3B82F6', '8B5CF6', 'EF4444', 'F59E0B', 
            '10B981', 'F97316', '06B6D4', 'EC4899'
        ];
        
        $index = abs(crc32($this->email)) % count($colors);
        return $colors[$index];
    }

    // Task and Project relationships
    
    /**
     * Get the projects owned by the user.
     */
    public function ownedProjects()
    {
        return $this->hasMany(Project::class, 'owner_id');
    }

    /**
     * Get the projects the user is a member of.
     */
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_members')
            ->withPivot(['role', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * Get all projects (owned + member).
     */
    public function allProjects()
    {
        return Project::where('owner_id', $this->id)
            ->orWhereHas('members', function ($query) {
                $query->where('user_id', $this->id);
            });
    }

    /**
     * Get tasks created by the user.
     */
    public function createdTasks()
    {
        return $this->hasMany(Task::class, 'created_by');
    }

    /**
     * Get tasks assigned to the user.
     */
    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    /**
     * Get all tasks (created + assigned).
     */
    public function allTasks()
    {
        return Task::where('created_by', $this->id)
            ->orWhere('assigned_to', $this->id);
    }
}
