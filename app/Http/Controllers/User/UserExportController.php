<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class UserExportController extends Controller
{
    /**
     * Export user posts as CSV.
     */
    public function exportPostsCsv()
    {
        $posts = Auth::user()->posts()->orderBy('created_at', 'desc')->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="posts.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function() use ($posts) {
            $file = fopen('php://output', 'w');
            
            // Add CSV header
            fputcsv($file, ['ID', 'Title', 'Content', 'Status', 'Created At', 'Updated At', 'Moderation Notes']);
            
            // Add data rows
            foreach ($posts as $post) {
                fputcsv($file, [
                    $post->id,
                    $post->title,
                    $post->content,
                    $post->status,
                    $post->created_at,
                    $post->updated_at,
                    $post->moderation_notes,
                ]);
            }
            
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    /**
     * Export user profile data as JSON.
     */
    public function exportProfileJson()
    {
        $user = Auth::user();
        
        // Prepare user data (excluding sensitive information)
        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'status' => $user->status,
            'created_at' => $user->created_at,
            'roles' => $user->roles->pluck('name'),
            'posts_count' => $user->posts()->count(),
            'published_posts_count' => $user->posts()->where('status', Post::STATUS_PUBLISHED)->count(),
        ];

        $headers = [
            'Content-Type' => 'application/json',
            'Content-Disposition' => 'attachment; filename="profile.json"',
        ];

        return Response::make(json_encode($userData, JSON_PRETTY_PRINT), 200, $headers);
    }
}
