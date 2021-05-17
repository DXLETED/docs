import React from 'react'
import st from 'styles/pages/MainPage.module.sass'
import { Table } from 'components/Table'
import { Helmet } from 'react-helmet'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload, faFolderOpen, faListAlt } from '@fortawesome/free-solid-svg-icons'

const notificationsList = [...Array(5)].map(() => ({
  description: 'Документ подписан',
  name: 'NNNNNNNN',
  author: 'AAAAA',
  time: '15 minutes ago',
}))

export const MainPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Docs</title>
      </Helmet>
      <div className={st.container}>
        <div className={st.links}>
          <NavLink className={st.button} to="/documents/create">
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
