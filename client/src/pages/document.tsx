import React from 'react'
import st from 'styles/pages/DocumentPage.module.sass'
import moment from 'moment'
import { useRequest } from 'hooks/request.hook'
import { useParams } from 'react-router'
import { getDocument, getPDF } from 'store/document'
import { requestsStatus } from 'utils/requestsStatus'
import { Loading } from 'components/Loading'
import { Error } from 'components/Error'
import { Helmet } from 'react-helmet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faEdit, faFilePdf, faUser } from '@fortawesome/free-solid-svg-icons'
import { getUsers } from 'store/users'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { saveAs } from 'file-saver'

export const DocumentPage: React.FC = () => {
  const dispatch = useDispatchTyped()
  const { id } = useParams<{ id: string }>()
  const [doc, documentStatus, documentError] = useRequest(
    s => s.document,
    () => getDocument({ id })
  )
  const [users, usersStatus, usersError] = useRequest(
    s => s.users,
    () => getUsers()
  )
  const status = requestsStatus(documentStatus, usersStatus)
  const pdf = async () => {
    const res = await dispatch(getPDF())
    res.meta.requestStatus === 'fulfilled'
      ? saveAs(new Blob([(res.payload as { file: BlobPart }).file], { type: 'application/pdf' }), doc?.title)
      : alert((res as any).error.message)
  }
  return (
    <>
      <Helmet>
        <title>{doc?.title || id} - Docs</title>
      </Helmet>
      {status === 'done' && doc && users && (
        <div className={st.container}>
          <div className={st.head}>
            <span className={st.title}>{doc.title}</span>
            <div className={st.d}>
              <span>
                <FontAwesomeIcon className={st.icon} icon={faUser} size="sm" />
                {users.find(u => u.userId === doc.userId)?.username}
              </span>
              <span>
                <FontAwesomeIcon className={st.icon} icon={faCalendarPlus} size="sm" />
                {moment(doc.createdAt).format('DD.MM.YYYY')}
              </span>
              {!!doc.updatedAt && (
                <span className={st.updatedAt}>
                  <FontAwesomeIcon className={st.icon} icon={faEdit} size="sm" />
                  {moment(doc.updatedAt).format('DD.MM.YYYY')}
                </span>
              )}
              <div className={st.pdf} onClick={pdf}>
                <FontAwesomeIcon className={st.icon} icon={faFilePdf} />
                PDF
              </div>
            </div>
          </div>
          <div className={st.content} id="content" dangerouslySetInnerHTML={{ __html: doc.rawDocument }} />
        </div>
      )}
      {status === 'loading' && <Loading />}
      {status === 'error' && <Error msg={[documentError, usersError]} />}
    </>
  )
}
