<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get users with role 'user'
        $users = User::role('user')->get();
        
        // If no users found, create a few
        if ($users->isEmpty()) {
            $users = collect([
                User::factory()->create(['name' => 'Regular User', 'email' => 'user@example.com'])
                    ->assignRole('user'),
                User::factory()->create(['name' => 'Another User', 'email' => 'user2@example.com'])
                    ->assignRole('user'),
            ]);
        }
        
        // Get an admin for moderation
        $admin = User::role('admin')->first();
        
        // If no admin found, create one
        if (!$admin) {
            $admin = User::factory()->create(['name' => 'Admin User', 'email' => 'admin@example.com'])
                ->assignRole('admin');
        }
        
        // Create some sample posts
        foreach ($users as $user) {
            // Published posts
            for ($i = 1; $i <= 3; $i++) {
                Post::create([
                    'user_id' => $user->id,
                    'title' => "Published Post #{$i} by {$user->name}",
                    'content' => "This is a published post #{$i} by {$user->name}. This post has been reviewed and approved by an admin.",
                    'status' => Post::STATUS_PUBLISHED,
                    'moderated_by' => $admin->id,
                    'moderated_at' => now(),
                ]);
            }
            
            // Draft posts
            for ($i = 1; $i <= 2; $i++) {
                Post::create([
                    'user_id' => $user->id,
                    'title' => "Draft Post #{$i} by {$user->name}",
                    'content' => "This is a draft post #{$i} by {$user->name}. This post is pending approval.",
                    'status' => Post::STATUS_DRAFT,
                ]);
            }
            
            // Flagged post
            Post::create([
                'user_id' => $user->id,
                'title' => "Flagged Post by {$user->name}",
                'content' => "This is a flagged post by {$user->name}. This post has been flagged for review.",
                'status' => Post::STATUS_FLAGGED,
            ]);
            
            // Rejected post
            Post::create([
                'user_id' => $user->id,
                'title' => "Rejected Post by {$user->name}",
                'content' => "This is a rejected post by {$user->name}. This post has been rejected by an admin.",
                'status' => Post::STATUS_REJECTED,
                'moderated_by' => $admin->id,
                'moderated_at' => now(),
                'moderation_notes' => 'This post was rejected because it does not meet our guidelines.',
            ]);
        }
    }
}
