import React, { useState } from 'react'
import st from 'styles/DocumentPage.module.sass'
import { Select } from 'components/Select'
import { useRequest } from 'hooks/request.hook'
import { Helmet } from 'react-helmet'
import { getBlanks } from 'store/blanks'
import { DocumentForm } from 'components/document/DocumentForm'
import { Loading } from 'Loading'
import { Error } from 'components/Error'
import { Container } from 'components/Container'
import { sendDocument } from 'store/document'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { requestError } from 'utils/requestError'

export const DocumentPage: React.FC = () => {
  const dispatch = useDispatchTyped()
  const [blanks, status, error] = useRequest(
    s => s.blanks,
    () => getBlanks()
  )
  const [blankI, setBlankI] = useState(0)
  const blank = blanks?.[blankI]
  return (
    <>
      <Helmet>
        <title>Document - Docs</title>
      </Helmet>
      {status === 'fulfilled' && (
        <>
          <div className={st.document}>
            <div className={st.form}>
              <DocumentForm blank={blank} />
            </div>
          </div>
          <div className={st.side}>
            <Container classNames={['m-10']}>
              <Select label="Blank" selected={blankI} options={blanks.map(b => b.name)} set={setBlankI} />
            </Container>
            <div className={st.signers} />
            <div
              className={st.send}
              onClick={() =>
                dispatch(sendDocument({ blankId: blank.id })).then(res =>
                  res.meta.requestStatus === 'fulfilled' ? alert('Sended') : requestError((res as any).error.message)
                )
              }>
              SEND
            </div>
          </div>
        </>
      )}
      {status === 'loading' && <Loading />}
      {status === 'error' && <Error msg={error} />}
    </>
  )
}
