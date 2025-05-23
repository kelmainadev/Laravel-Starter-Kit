<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the user's posts.
     */
    public function index(Request $request)
    {
        $posts = Auth::user()->posts()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('User/Posts/Index', [
            'posts' => $posts,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create()
    {
        return Inertia::render('User/Posts/Create');
    }

    /**
     * Store a newly created post in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post = Auth::user()->posts()->create([
            'title' => $request->title,
            'content' => $request->content,
            'status' => Post::STATUS_DRAFT,
        ]);

        return redirect()->route('user.posts.index')
            ->with('success', 'Post created successfully and is pending approval.');
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post)
    {
        // Check if the user owns this post
        $this->authorize('view', $post);

        return Inertia::render('User/Posts/Show', [
            'post' => $post,
        ]);
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(Post $post)
    {
        // Check if the user owns this post
        $this->authorize('update', $post);

        return Inertia::render('User/Posts/Edit', [
            'post' => $post,
        ]);
    }

    /**
     * Update the specified post in storage.
     */
    public function update(Request $request, Post $post)
    {
        // Check if the user owns this post
        $this->authorize('update', $post);

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        // If the post was already published, an edit will reset it to draft status for remoderation
        $status = $post->status === Post::STATUS_PUBLISHED ? Post::STATUS_DRAFT : $post->status;

        $post->update([
            'title' => $request->title,
            'content' => $request->content,
            'status' => $status,
            // If status changed back to draft, clear moderation data
            'moderated_by' => $status === Post::STATUS_DRAFT ? null : $post->moderated_by,
            'moderated_at' => $status === Post::STATUS_DRAFT ? null : $post->moderated_at,
        ]);

        return redirect()->route('user.posts.index')
            ->with('success', 'Post updated successfully' . ($status === Post::STATUS_DRAFT ? ' and is pending approval.' : '.'));
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy(Post $post)
    {
        // Check if the user owns this post
        $this->authorize('delete', $post);

        $post->delete();

        return redirect()->route('user.posts.index')
            ->with('success', 'Post deleted successfully.');
    }

    /**
     * Report a post for moderation.
     */
    public function report(Post $post)
    {
        // Update the post status to flagged
        $post->update([
            'status' => Post::STATUS_FLAGGED,
            'moderated_by' => null,
            'moderated_at' => null,
        ]);

        return redirect()->back()
            ->with('success', 'Post has been reported and is pending moderation.');
    }
}
