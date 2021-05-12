import React, { useEffect } from 'react'
import st from 'styles/pages/DocumentPage.module.sass'
import { Select } from 'components/input/Select'
import { useRequest } from 'hooks/request.hook'
import { Helmet } from 'react-helmet'
import { getBlanks } from 'store/blanks'
import { Loading } from 'components/Loading'
import { Error } from 'components/Error'
import { Container } from 'components/Container'
import { documentActions, sendDocument } from 'store/document'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'
import { DocumentFormFields } from 'components/document/DocumentFormFields'

export const DocumentPage: React.FC = () => {
  const dispatch = useDispatchTyped()
  const [blanks, status, error] = useRequest(
    s => s.blanks,
    () => getBlanks()
  )
  const blanksList = blanks.map(b => b.name)
  const blankId = useSelectorTyped(s => s.document.blankId)
  const blank = blanks?.find(b => b.id === blankId)
  const selectedBlank = blanks.findIndex(b => b.id === blankId)
  const data = useSelectorTyped(s => s.document.data)
  const blankSelect = (i: number | null) =>
    dispatch(documentActions.init({ blank: typeof i === 'number' ? blanks[i] : null }))
  const send = () =>
    dispatch(sendDocument()).then(res =>
      res.meta.requestStatus === 'fulfilled' ? alert('Sended') : alert((res as any).error.message)
    )
  useEffect(() => {
    return () => {
      dispatch(documentActions.clear({}))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <Helmet>
        <title>Document - Docs</title>
      </Helmet>
      {status === 'fulfilled' && (
        <div className={st.document}>
          <div className={st.form}>
            <div className={st.inner}>{blank && data && <DocumentFormFields data={data} fields={blank.fields} />}</div>
          </div>
          <div className={st.side}>
            <Container classes={['m-10']}>
              <Select
                label="Blank"
                selected={selectedBlank !== -1 ? selectedBlank : null}
                options={blanksList}
                set={blankSelect}
                empty
              />
            </Container>
            <div className={st.signers} />
            <div className={st.send} onClick={send}>
              SEND
            </div>
          </div>
        </div>
      )}
      {status === 'loading' && <Loading />}
      {status === 'error' && <Error msg={error} />}
    </>
  )
}
