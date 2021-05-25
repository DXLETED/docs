import React from 'react'
import st from 'styles/pages/DocumentPage.module.sass'
import { useRequest } from 'hooks/request.hook'
import objectPath from 'object-path'
import { useParams } from 'react-router'
import { getBlanks } from 'store/blanks'
import { getDocument } from 'store/document'
import { requestsStatus } from 'utils/requestsStatus'
import { Loading } from 'components/Loading'
import { Error } from 'components/Error'
import { Helmet } from 'react-helmet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faEdit, faUser } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { getUsers } from 'store/users'

export const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [document, documentStatus, documentError] = useRequest(
    s => s.document,
    () => getDocument({ id })
  )
  const [blanks, blanksStatus, blanksError] = useRequest(
    s => s.blanks,
    () => getBlanks()
  )
  const [users, usersStatus, usersError] = useRequest(
    s => s.users,
    () => getUsers()
  )
  const status = requestsStatus(documentStatus, blanksStatus, usersStatus)
  const render = (tpl: string, data: any) =>
    tpl
      .replaceAll(/\$\$([a-zA-Z|.]*)(.*?)\$\$([a-zA-Z|.]*)/g, (_, path, tpl) =>
        objectPath
          .get(data, path)
          .map((el: any) => render(tpl, el))
          .join('')
      )
      .replaceAll(/\$_/g, data)
      .replaceAll(/\$([a-zA-Z|.]*)/g, (_, path) => objectPath.get(data, path))
  const html = document && blanks ? render(blanks?.[0].template, document.data) : ''
  return (
    <>
      <Helmet>
        <title>{document?.title || id} - Docs</title>
      </Helmet>
      {status === 'done' && document && blanks && (
        <div className={st.container}>
          <div className={st.head}>
            <span className={st.title}>{document.title}</span>
            <div className={st.d}>
              <span>
                <FontAwesomeIcon className={st.icon} icon={faUser} size="sm" />
                {users.find(u => u.userId === document.userId)?.username}
              </span>
              <span>
                <FontAwesomeIcon className={st.icon} icon={faCalendarPlus} size="sm" />
                {moment(document.createdAt).format('DD.MM.YYYY')}
              </span>
              {document.updatedAt && (
                <span className={st.updatedAt}>
                  <FontAwesomeIcon className={st.icon} icon={faEdit} size="sm" />
                  {moment(document.updatedAt).format('DD.MM.YYYY')}
                </span>
              )}
            </div>
          </div>
          <div className={st.content} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}
      {status === 'loading' && <Loading />}
      {status === 'error' && <Error msg={[documentError, blanksError, usersError]} />}
    </>
  )
}
