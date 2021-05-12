import React, { useRef } from 'react'
import st from 'styles/pages/MainPage.module.sass'
import { Table } from 'components/Table'
import { Helmet } from 'react-helmet'
import { Button } from 'components/Button'

export const MainPage: React.FC = () => {
  const myDocumentsRef = useRef<HTMLDivElement>(null)
  const newDocumentsRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <Helmet>
        <title>Docs</title>
      </Helmet>
      <div className={st.container}>
        <div className={st.links}>
          <Button label="Create document" to="/document" flex center />
          <Button
            label="My documents"
            onClick={() => myDocumentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            flex
            center
          />
          <Button
            label="New documents"
            onClick={() => newDocumentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            flex
            center
          />
        </div>
        <div className={st.dashboardEl} ref={myDocumentsRef}>
          <Table
            id="notificaitons"
            label="Notifications"
            head={{ description: 'Description', name: 'Name', author: 'Author', time: 'Time' }}
            els={[...Array(5)].map(() => ({
              description: 'Document signed',
              name: 'NNNNNNNN',
              author: 'AAAAA',
              time: '15 minutes ago',
            }))}
          />
        </div>
        <div className={st.dashboardEl} ref={myDocumentsRef}>
          <Table
            id="docs"
            label="My documents"
            head={{ description: 'Description', name: 'Name', author: 'Author', time: 'Time' }}
            els={[...Array(10)].map(() => ({
              description: 'Document signed',
              name: 'NNNNNNNN',
              author: 'AAAAA',
              time: '15 minutes ago',
            }))}
          />
        </div>
        <div className={st.dashboardEl} ref={newDocumentsRef}>
          <Table
            id="newdocs"
            label="New documents"
            head={{ description: 'Description', name: 'Name', author: 'Author', time: 'Time' }}
            els={[...Array(10)].map(() => ({
              description: 'Document signed',
              name: 'NNNNNNNN',
              author: 'AAAAA',
              time: '15 minutes ago',
            }))}
          />
        </div>
      </div>
    </>
  )
}
