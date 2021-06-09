import React, { useMemo } from 'react'
import st from 'styles/pages/MainPage.module.sass'
import moment from 'moment'
import dict from 'dictionary.json'
import { Table } from 'components/table/Table'
import { Helmet } from 'react-helmet'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload, faFolderOpen, faListAlt } from '@fortawesome/free-solid-svg-icons'
import { useRequest } from 'hooks/request.hook'
import { getStatus, subscribe, unsubscribe } from 'store/status'
import { getUsers } from 'store/users'
import { requestsStatus } from 'utils/requestsStatus'
import { Loading } from 'components/Loading'
import { Error } from 'components/Error'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'
import { Switch } from 'components/Switch'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { useTranslation } from 'react-i18next'

export const MainPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatchTyped()
  const subscribed = useSelectorTyped(s => s.status.subscribed)
  const newDocuments = useSelectorTyped(s => s.status.newDocuments)
  const myDocuments = useSelectorTyped(s => s.status.myDocuments)
  const [notifications, notificationsStatus, notificationsError] = useRequest(
    s => s.status.notifications,
    () => getStatus()
  )
  const [users, usersStatus, usersError] = useRequest(
    s => s.users,
    () => getUsers()
  )
  const status = requestsStatus(notificationsStatus, usersStatus)
  const els = useMemo(
    () =>
      notifications && users
        ? notifications.map(el => ({
            d: {
              author: users.find(u => u.userId === el.userId)?.username || '',
              description: dict.notificationType[el.type],
              title: el.document.title,
              id: el.document.id.slice(-8),
              date: moment(el.date).format('YYYY-MM-DD HH:mm'),
            },
            link: `/documents/${el.document.id}`,
          }))
        : [],
    [notifications, users]
  )
  return (
    <>
      <Helmet>
        <title>Docs</title>
      </Helmet>
      {status === 'done' && (
        <div className={st.container}>
          <div className={st.links}>
            <NavLink className={st.button} to="/newdocument">
              <FontAwesomeIcon className={st.icon} icon={faFileUpload} />
              {t('main.links.createDocument')}
            </NavLink>
            <NavLink className={st.button} to="/mydocuments">
              <FontAwesomeIcon className={st.icon} icon={faFolderOpen} />
              {t('main.links.myDocuments')}<div className={st.count}>{myDocuments}</div>
            </NavLink>
            <NavLink className={st.button} to="/documents">
              <FontAwesomeIcon className={st.icon} icon={faListAlt} />
              {t('main.links.newDocuments')}<div className={st.count}>{newDocuments}</div>
            </NavLink>
          </div>
          <div className={st.subscribe}>
            <Switch
              enabled={!!subscribed}
              set={n => dispatch(n ? subscribe() : unsubscribe())}
              label={t('main.subscribe')}
              loading={subscribed === 'loading'}
            />
          </div>
          <div className={st.notifications}>
            <Table
              id="notificaitons"
              label={t('main.notifications.title')}
              head={{
                author: t('main.notifications.head.author'),
                description: t('main.notifications.head.description'),
                title: t('main.notifications.head.author'),
                id: t('main.notifications.head.id'),
                date: t('main.notifications.head.date'),
              }}
              els={els}
            />
          </div>
        </div>
      )}
      {status === 'loading' && <Loading />}
      {status === 'error' && <Error msg={[notificationsError, usersError]} />}
    </>
  )
}
