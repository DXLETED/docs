import { store } from 'store'
import { NotificationData, notificationsActions, NotificationType } from 'store/notifications'

const createNotification = (type: NotificationType, data: NotificationData) =>
  store.dispatch(notificationsActions.create({ type, ...data }))

export const notify: { [key in NotificationType]: (data: NotificationData) => void } = {
  info: data => createNotification('info', data),
  success: data => createNotification('success', data),
  warning: data => createNotification('warning', data),
  error: data => createNotification('error', data),
}
