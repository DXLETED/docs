import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'
import React, { useEffect } from 'react'
import { Blank, BlankFieldType } from 'store/blanks'
import { documentActions } from 'store/document'
import { DocumentFormFields } from './DocumentFormFields'

const dataFields: { [key in BlankFieldType]: any } = {
  text: '',
  date: null,
  group: {},
}
const dataFromBlank = (blank: Blank) =>
  Object.fromEntries(
    blank.fields.map(el => [el.type === 'group' ? el.name : el.id, el.multiple ? [] : dataFields[el.type]])
  )

interface DocumentFormProps {
  blank: Blank
}
export const DocumentForm: React.FC<DocumentFormProps> = ({ blank }) => {
  const data = useSelectorTyped(s => s.document)
  const dispatch = useDispatchTyped()
  useEffect(() => {
    dispatch(documentActions.init(dataFromBlank(blank)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blank])
  return <>{data && <DocumentFormFields data={data} fields={blank.fields} />}</>
}
