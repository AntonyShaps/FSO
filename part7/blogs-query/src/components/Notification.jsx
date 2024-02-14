import { useNotificationValue } from '../NotificationContext'
const Notification = () => {
  const notification = useNotificationValue()
  if (!notification) return null

  return <div>{notification}</div>
}

export default Notification
