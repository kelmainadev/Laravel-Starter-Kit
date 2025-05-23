import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/Components/ui/dropdown-menu';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { router } from '@inertiajs/react';

export default function NotificationCenter({ user }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Early return if user is not available
    if (!user) {
        return (
            <Button variant="ghost" size="sm" className="relative" disabled>
                <Bell className="h-5 w-5" />
            </Button>
        );
    }

    // Load notifications when dropdown opens
    useEffect(() => {
        if (isOpen) {
            loadNotifications();
        }
    }, [isOpen]);

    // Set up real-time notifications
    useEffect(() => {
        if (window.Echo && user) {
            // Listen for new notifications
            window.Echo.private(`user.${user.id}`)
                .notification((notification) => {
                    console.log('New notification received:', notification);
                    
                    // Add to notifications list
                    setNotifications(prev => [notification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                    
                    // Show browser notification if permission granted
                    if (Notification.permission === 'granted') {
                        new Notification(notification.data.message, {
                            icon: '/favicon.ico',
                            tag: notification.id
                        });
                    }
                });

            // Load initial unread count
            loadUnreadCount();
        }

        return () => {
            if (window.Echo && user) {
                window.Echo.leave(`user.${user.id}`);
            }
        };
    }, [user]);

    // Request notification permission
    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const response = await window.axios.get(route('user.notifications.index'));
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const response = await window.axios.get(route('user.notifications.unread-count'));
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error('Failed to load unread count:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await window.axios.patch(route('user.notifications.mark-as-read', notificationId));
            
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === notificationId 
                        ? { ...notification, read_at: new Date().toISOString() }
                        : notification
                )
            );
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await window.axios.patch(route('user.notifications.mark-all-read'));
            
            setNotifications(prev => 
                prev.map(notification => ({
                    ...notification,
                    read_at: notification.read_at || new Date().toISOString()
                }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const response = await window.axios.delete(route('user.notifications.destroy', notificationId));
            
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleNotificationClick = (notification) => {
        if (notification.data.action_url) {
            if (!notification.read_at) {
                markAsRead(notification.id);
            }
            router.visit(notification.data.action_url);
            setIsOpen(false);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'task_assigned':
                return '📋';
            case 'task_updated':
                return '✏️';
            case 'project_invitation':
                return '🔗';
            default:
                return '📢';
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={markAllAsRead}
                            className="h-auto p-1 text-xs"
                        >
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <ScrollArea className="h-96">
                    {loading ? (
                        <div className="p-4 text-center text-muted-foreground">
                            Loading notifications...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                                    !notification.read_at ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-lg">{getNotificationIcon(notification.data.type)}</span>
                                    
                                    <div className="flex-1 min-w-0">
                                        <p 
                                            className="text-sm cursor-pointer hover:text-blue-600"
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            {notification.data.message}
                                        </p>
                                        
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatTimeAgo(notification.created_at)}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                        {!notification.read_at && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => markAsRead(notification.id)}
                                                className="h-6 w-6 p-0"
                                            >
                                                <Check className="h-3 w-3" />
                                            </Button>
                                        )}
                                        
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteNotification(notification.id)}
                                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 