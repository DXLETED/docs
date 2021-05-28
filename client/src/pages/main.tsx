import React from 'react'
import st from 'styles/pages/MainPage.module.sass'
import moment from 'moment'
import { Table } from 'components/table/Table'
import { Helmet } from 'react-helmet'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload, faFolderOpen, faListAlt } from '@fortawesome/free-solid-svg-icons'

const notificationsList = [...Array(10)]
  .map(() => ({
    d: {
      description: 'Пользователь UUUUU подписал документ',
      name: 'NNNNNNNN',
      author: 'AAAAA',
      time: moment()
        .subtract(Math.random() * 100, 'h')
        .toDate()
        .getTime(),
    },
  }))
  .sort((x, y) => y.d.time - x.d.time)
  .map(n => ({ ...n, d: { ...n.d, time: moment(n.d.time).fromNow() } }))

export const MainPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Docs</title>
      </Helmet>
      <div className={st.container}>
        <div className={st.links}>
          <NavLink className={st.button} to="/newdocument">
            <FontAwesomeIcon className={st.icon} icon={faFileUpload} />
            Создать документ
          </NavLink>
          <NavLink className={st.button} to="/mydocuments">
            <FontAwesomeIcon className={st.icon} icon={faFolderOpen} />
            Мои документы<div className={st.count}>18</div>
          </NavLink>
          <NavLink className={st.button} to="/documents">
            <FontAwesomeIcon className={st.icon} icon={faListAlt} />
            Новые документы<div className={st.count}>4</div>
          </NavLink>
        </div>
        <div className={st.notifications}>
          <Table
            id="notificaitons"
            label="Уведомления"
            head={{ description: 'Описание', name: 'Название', author: 'Автор', time: 'Время' }}
            els={notificationsList}
          />
        </div>
      </div>
    </>
  )
}
