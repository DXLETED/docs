import React, { useState } from 'react'
import st from 'styles/DocumentPage.module.sass'
import { Select } from 'components/Select'
import { useRequest } from 'hooks/request.hook'
import { Helmet } from 'react-helmet'
import { getBlanks } from 'store/blanks'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'

export const DocumentPage: React.FC = () => {
  const [isLoaded] = useRequest(getBlanks())
  const blanks = useSelectorTyped(s => s.blanks)
  const [blankI, setBlankI] = useState(0)
  const blank = blanks[blankI]
  console.log(blank)
  return (
    <>
      <Helmet>
        <title>Document - Docs</title>
      </Helmet>
      <div className={st.document}>
        {isLoaded && 'Blanks loaded'}
        <Select selected={blankI} options={['Blank #1']} set={setBlankI} />
      </div>
    </>
  )
}
