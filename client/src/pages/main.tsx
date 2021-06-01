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
import { getStatus } from 'store/status'
import { getUsers } from 'store/users'
import { requestsStatus } from 'utils/requestsStatus'
import { Loading } from 'components/Loading'
import { Error } from 'components/Error'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'

export const MainPage: React.FC = () => {
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
            link: `/documents/${el.document.id}`
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
              Создать документ
            </NavLink>
            <NavLink className={st.button} to="/mydocuments">
              <FontAwesomeIcon className={st.icon} icon={faFolderOpen} />
              Мои документы<div className={st.count}>{myDocuments}</div>
            </NavLink>
            <NavLink className={st.button} to="/documents">
              <FontAwesomeIcon className={st.icon} icon={faListAlt} />
              Новые документы<div className={st.count}>{newDocuments}</div>
            </NavLink>
          </div>
          <div className={st.notifications}>
            <Table
              id="notificaitons"
              label="Уведомления"
              head={{ author: 'Автор', description: 'Описание', title: 'Название документа', id: 'ID документа', date: 'Время' }}
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
