<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $notifications = $user->notifications()
            ->when($request->boolean('unread_only'), function ($query) {
                return $query->whereNull('read_at');
            })
            ->latest()
            ->paginate(20);

        return response()->json([
            'notifications' => $notifications->items(),
            'unread_count' => $user->unreadNotifications()->count(),
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ]
        ]);
    }

    /**
     * Get unread notifications count
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'unread_count' => $user->unreadNotifications()->count()
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, string $notificationId): JsonResponse
    {
        $user = $request->user();
        
        $notification = $user->notifications()
            ->where('id', $notificationId)
            ->first();

        if (!$notification) {
            return response()->json([
                'message' => 'Notification not found'
            ], 404);
        }

        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read',
            'unread_count' => $user->unreadNotifications()->count()
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $user->unreadNotifications->markAsRead();

        return response()->json([
            'message' => 'All notifications marked as read',
            'unread_count' => 0
        ]);
    }

    /**
     * Delete a notification
     */
    public function destroy(Request $request, string $notificationId): JsonResponse
    {
        $user = $request->user();
        
        $notification = $user->notifications()
            ->where('id', $notificationId)
            ->first();

        if (!$notification) {
            return response()->json([
                'message' => 'Notification not found'
            ], 404);
        }

        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted',
            'unread_count' => $user->unreadNotifications()->count()
        ]);
    }

    /**
     * Clear all read notifications
     */
    public function clearRead(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $user->readNotifications()->delete();

        return response()->json([
            'message' => 'Read notifications cleared'
        ]);
    }
}
