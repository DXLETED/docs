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
  const status = requestsStatus(documentStatus, blanksStatus)
  const html =
    document && blanks
      ? blanks?.[0].template
          .replaceAll(/\$\$([a-zA-Z|.]*)(.*?)\$\$([a-zA-Z|.]*)/g, (_, path, tpl) =>
            objectPath
              .get(document.data, path)
              .map((el: any) =>
                tpl
                  .replaceAll(/\$_/g, el)
                  .replaceAll(/\$([a-zA-Z|.]*)/g, (_: string, path: string) => objectPath.get(el, path))
              )
              .join('')
          )
          .replaceAll(/\$([a-zA-Z|.]*)/g, (_, path) => objectPath.get(document.data, path))
      : ''
  return (
    <>
      <Helmet>
        <title>{document?.title || id} - Docs</title>
      </Helmet>
      {status === 'done' && <div className={st.content} dangerouslySetInnerHTML={{ __html: html }} />}
      {status === 'loading' && <Loading />}
      {status === 'error' && <Error msg={[documentError, blanksError]} />}
    </>
  )
}
