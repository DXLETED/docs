import React, { useEffect, useState } from 'react'
import st from 'styles/components/Notifications.module.sass'
import clsx from 'clsx'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'
import { createPortal } from 'react-dom'
import { Notification, notificationsActions } from 'store/notifications'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamationTriangle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons'

const NotificationEl: React.FC<{ ntf: Notification }> = ({ ntf }) => {
  const dispatch = useDispatchTyped()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(true)
    setTimeout(() => setVisible(false), 5000)
  }, [])
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
          {ntf.type === 'info' && <FontAwesomeIcon icon={faInfoCircle} size="4x" />}
          {ntf.type === 'success' && <FontAwesomeIcon icon={faCheck} size="4x" />}
          {ntf.type === 'warning' && <FontAwesomeIcon icon={faExclamationTriangle} size="4x" />}
          {ntf.type === 'error' && <FontAwesomeIcon icon={faTimes} size="4x" />}
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
