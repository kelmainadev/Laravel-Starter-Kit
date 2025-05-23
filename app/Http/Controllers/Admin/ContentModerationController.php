<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContentModerationController extends Controller
{
    /**
     * Display a listing of the posts that need moderation.
     */
    public function index(Request $request)
    {
        $posts = Post::with('user:id,name,email')
            ->needsModeration()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            })
            ->orderBy('updated_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/ContentModeration/Index', [
            'posts' => $posts,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Display all content (published, draft, flagged, rejected).
     */
    public function all(Request $request)
    {
        $status = $request->input('status');
        
        $posts = Post::with('user:id,name,email')
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            })
            ->orderBy('updated_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/ContentModeration/All', [
            'posts' => $posts,
            'filters' => $request->only(['search', 'status']),
            'statuses' => [
                Post::STATUS_DRAFT => 'Draft',
                Post::STATUS_PUBLISHED => 'Published',
                Post::STATUS_FLAGGED => 'Flagged',
                Post::STATUS_REJECTED => 'Rejected',
            ],
        ]);
    }

    /**
     * Display the specified post for moderation.
     */
    public function show(Post $post)
    {
        $post->load('user:id,name,email');
        
        return Inertia::render('Admin/ContentModeration/Show', [
            'post' => $post,
        ]);
    }

    /**
     * Approve a post.
     */
    public function approve(Request $request, Post $post)
    {
        $post->update([
            'status' => Post::STATUS_PUBLISHED,
            'moderated_by' => Auth::id(),
            'moderated_at' => now(),
            'moderation_notes' => $request->input('notes'),
        ]);

        return redirect()->route('admin.moderation.index')
            ->with('success', 'Post approved and published successfully.');
    }

    /**
     * Reject a post.
     */
    public function reject(Request $request, Post $post)
    {
        $request->validate([
            'notes' => 'required|string',
        ]);

        $post->update([
            'status' => Post::STATUS_REJECTED,
            'moderated_by' => Auth::id(),
            'moderated_at' => now(),
            'moderation_notes' => $request->input('notes'),
        ]);

        return redirect()->route('admin.moderation.index')
            ->with('success', 'Post rejected successfully.');
    }

    /**
     * Flag a post for further review.
     */
    public function flag(Request $request, Post $post)
    {
        $request->validate([
            'notes' => 'required|string',
        ]);

        $post->update([
            'status' => Post::STATUS_FLAGGED,
            'moderated_by' => Auth::id(),
            'moderated_at' => now(),
            'moderation_notes' => $request->input('notes'),
        ]);

        return redirect()->route('admin.moderation.index')
            ->with('success', 'Post flagged for further review.');
    }

    /**
     * Delete a post.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('admin.moderation.index')
            ->with('success', 'Post deleted successfully.');
    }
}
