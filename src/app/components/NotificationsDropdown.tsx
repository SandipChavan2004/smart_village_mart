import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

export default function NotificationsDropdown() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Fetch notifications
    const fetchNotifications = async () => {
        if (!user) {
            console.log('NotificationsDropdown: No user, skipping fetch');
            return;
        }

        console.log('NotificationsDropdown: Fetching notifications for user:', user.id, user.role);
        setLoading(true);
        try {
            const res = await api.get(`/notifications?user_id=${user.id}&user_role=${user.role}`);
            console.log('NotificationsDropdown: Received notifications:', res.data);
            setNotifications(res.data);

            // Count unread
            const unread = res.data.filter((n: Notification) => !n.is_read).length;
            setUnreadCount(unread);
            console.log('NotificationsDropdown: Unread count:', unread);
        } catch (error) {
            console.error('NotificationsDropdown: Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and every 30 seconds
    useEffect(() => {
        if (!user) return;
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user?.id]);

    // Mark notification as read
    const markAsRead = async (notificationId: number) => {
        try {
            await api.put(`/notifications/${notificationId}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    // Format time ago
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    if (!user) return null;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                side="bottom"
                sideOffset={16}
                className="w-[30vw] min-w-[320px] max-w-[400px] h-[calc(100vh-4.5rem)] overflow-hidden rounded-2xl rounded-r-none border-r-0 shadow-2xl p-0"
            >
                {/* Header with gradient */}
                <div className="sticky top-0 z-10 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg">Notifications</h3>
                            {unreadCount > 0 && (
                                <p className="text-xs text-emerald-100 mt-0.5">{unreadCount} unread</p>
                            )}
                        </div>
                        <Bell className="h-5 w-5 opacity-80" />
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto h-[calc(100%-5rem)] p-2">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                            <p className="text-sm">Loading...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Bell className="h-8 w-8 opacity-40" />
                            </div>
                            <p className="font-medium">No notifications yet</p>
                            <p className="text-xs mt-1">We'll notify you when something arrives</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`mb-2 p-4 cursor-pointer rounded-xl transition-all hover:shadow-md ${!notification.is_read
                                    ? 'bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200'
                                    : 'bg-white hover:bg-gray-50 border border-gray-100'
                                    }`}
                                onClick={() => {
                                    if (!notification.is_read) {
                                        markAsRead(notification.id);
                                    }
                                }}
                            >
                                {notification.link ? (
                                    <Link to={notification.link} className="block w-full">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <Bell className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-gray-900">{notification.title}</p>
                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {timeAgo(notification.created_at)}
                                                </p>
                                            </div>
                                            {!notification.is_read && (
                                                <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-emerald-500 mt-1 animate-pulse" />
                                            )}
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Bell className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-gray-900">{notification.title}</p>
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {timeAgo(notification.created_at)}
                                            </p>
                                        </div>
                                        {!notification.is_read && (
                                            <div className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-emerald-500 mt-1 animate-pulse" />
                                        )}
                                    </div>
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
