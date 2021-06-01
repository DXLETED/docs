import React, { useEffect, useState } from 'react'
import st from 'styles/components/Notifications.module.sass'
import clsx from 'clsx'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'
import { createPortal } from 'react-dom'
import { Notification, notificationsActions, NotificationType } from 'store/notifications'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faCheck, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

const NotificationEl: React.FC<{ ntf: Notification }> = ({ ntf }) => {
  const dispatch = useDispatchTyped()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(true)
    setTimeout(() => setVisible(false), 5000)
  }, [])
  const icon: { [key in NotificationType]: IconProp } = {
    info: faInfoCircle,
    success: faCheck,
    warning: faExclamationTriangle,
    error: faBan,
  }
  return (
    <CSSTransition
      in={visible}
      classNames={st}
      timeout={250}
      onExited={() => dispatch(notificationsActions.close(ntf.id))}>
      <div
        className={clsx(st.notification, st[ntf.type.toUpperCase()])}
        onClick={(e: React.MouseEvent) => {
          setVisible(false)
          e.stopPropagation()
        }}
        key={ntf.id}>
        <div className={st.background} />
        <div className={st.icon}>
          <FontAwesomeIcon icon={icon[ntf.type]} size="2x" />
        </div>
        {ntf.title && <div className={st.title}>{ntf.title}</div>}
        {ntf.content && <div className={st.content}>{ntf.content}</div>}
      </div>
    </CSSTransition>
  )
}

export const Notifications: React.FC = () => {
  const list = useSelectorTyped(s => s.notifications)
  return createPortal(
    <div className={st.container}>
      <div className={st.notifications}>
        {list.map(ntf => (
          <NotificationEl {...{ ntf }} key={ntf.id} />
        ))}
      </div>
    </div>,
    document.getElementById('notifications') as Element
  )
}
