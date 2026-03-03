import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotificationsAction } from "@/notifications/actions/get-notifications.actions";
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/notifications/actions/mark-notification-read.actions";

export const NOTIFICATIONS_QUERY_KEY = "notifications";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY],
    queryFn: () => getNotificationsAction({ limit: 20 }),
    staleTime: 1000 * 60,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => markNotificationReadAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsReadAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });

  return {
    notifications: data?.results ?? [],
    unreadCount: data?.unread_count ?? 0,
    total: data?.count ?? 0,
    isLoading,
    markRead: (id: number) => markReadMutation.mutate(id),
    markAllRead: () => markAllReadMutation.mutate(),
  };
};
