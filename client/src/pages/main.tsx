import React from 'react'
import st from 'styles/pages/MainPage.module.sass'
import { Table } from 'components/Table'
import { Helmet } from 'react-helmet'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload, faFolderOpen, faListAlt } from '@fortawesome/free-solid-svg-icons'

const notificationsList = [...Array(5)].map(() => ({
  description: 'Document signed',
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
            Create document
          </NavLink>
          <NavLink className={st.button} to="/mydocuments">
            <FontAwesomeIcon className={st.icon} icon={faFolderOpen} />
            My documents<div className={st.count}>18</div>
          </NavLink>
          <NavLink className={st.button} to="/documents">
            <FontAwesomeIcon className={st.icon} icon={faListAlt} />
            New documents<div className={st.count}>4</div>
          </NavLink>
        </div>
        <div className={st.notifications}>
          <Table
            id="notificaitons"
            label="Notifications"
            head={{ description: 'Description', name: 'Name', author: 'Author', time: 'Time' }}
            els={notificationsList}
          />
        </div>
      </div>
    </>
  )
}
