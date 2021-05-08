import React, { useState } from 'react'
import st from 'styles/DocumentPage.module.sass'
import { Select } from 'components/Select'
import { useRequest } from 'hooks/request.hook'
import { Helmet } from 'react-helmet'
import { getBlanks } from 'store/blanks'
import { DocumentForm } from 'components/document/DocumentForm'
import { Container } from 'components/Container'
import { Loading } from 'Loading'
import { Error } from 'components/Error'

export const DocumentPage: React.FC = () => {
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
      <div className={st.document}>
        {status === 'fulfilled' && (
          <>
            <Container classNames={['mb-30']}>
              <Select label="Blank" selected={blankI} options={blanks.map(b => b.name)} set={setBlankI} />
            </Container>
            <Container classNames={['column']}>
              <DocumentForm blank={blank} />
            </Container>
          </>
        )}
        {status === 'loading' && <Loading />}
        {status === 'error' && <Error msg={error} />}
      </div>
    </>
  )
}
