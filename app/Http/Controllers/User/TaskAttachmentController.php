<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class TaskAttachmentController extends Controller
{
    /**
     * Upload a file attachment to a task
     */
    public function store(Request $request, Task $task): JsonResponse
    {
        // Check if user can edit this task
        if (!$task->canUserEdit(Auth::id())) {
            return response()->json([
                'message' => 'You do not have permission to add attachments to this task.'
            ], 403);
        }

        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        try {
            $media = $task
                ->addMediaFromRequest('file')
                ->toMediaCollection('attachments');

            return response()->json([
                'message' => 'File uploaded successfully!',
                'attachment' => [
                    'id' => $media->id,
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'mime_type' => $media->mime_type,
                    'size' => $media->size,
                    'human_readable_size' => $media->human_readable_size,
                    'url' => $media->getUrl(),
                    'uploaded_at' => $media->created_at->format('M d, Y H:i'),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all attachments for a task
     */
    public function index(Task $task): JsonResponse
    {
        // Check if user can access this task
        if (!$task->canUserAccess(Auth::id())) {
            return response()->json([
                'message' => 'You do not have access to this task.'
            ], 403);
        }

        $attachments = $task->getMedia('attachments')->map(function (Media $media) {
            return [
                'id' => $media->id,
                'name' => $media->name,
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'size' => $media->size,
                'human_readable_size' => $media->human_readable_size,
                'url' => $media->getUrl(),
                'thumb_url' => $media->hasGeneratedConversion('thumb') ? $media->getUrl('thumb') : null,
                'uploaded_at' => $media->created_at->format('M d, Y H:i'),
                'is_image' => in_array($media->mime_type, ['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
            ];
        });

        return response()->json([
            'attachments' => $attachments
        ]);
    }

    /**
     * Download an attachment
     */
    public function download(Task $task, Media $media)
    {
        // Check if user can access this task
        if (!$task->canUserAccess(Auth::id())) {
            abort(403, 'You do not have access to this task.');
        }

        // Check if the media belongs to this task
        if ($media->model_id !== $task->id || $media->model_type !== Task::class) {
            abort(404, 'Attachment not found.');
        }

        return response()->download($media->getPath(), $media->file_name);
    }

    /**
     * Delete an attachment
     */
    public function destroy(Task $task, Media $media): JsonResponse
    {
        // Check if user can edit this task
        if (!$task->canUserEdit(Auth::id())) {
            return response()->json([
                'message' => 'You do not have permission to delete attachments from this task.'
            ], 403);
        }

        // Check if the media belongs to this task
        if ($media->model_id !== $task->id || $media->model_type !== Task::class) {
            return response()->json([
                'message' => 'Attachment not found.'
            ], 404);
        }

        try {
            $media->delete();

            return response()->json([
                'message' => 'Attachment deleted successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete attachment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get attachment preview/thumbnail
     */
    public function preview(Task $task, Media $media)
    {
        // Check if user can access this task
        if (!$task->canUserAccess(Auth::id())) {
            abort(403, 'You do not have access to this task.');
        }

        // Check if the media belongs to this task
        if ($media->model_id !== $task->id || $media->model_type !== Task::class) {
            abort(404, 'Attachment not found.');
        }

        // Return thumbnail if available, otherwise the original file
        if ($media->hasGeneratedConversion('thumb')) {
            return response()->file($media->getPath('thumb'));
        }

        return response()->file($media->getPath());
    }
}
