import React, { useEffect } from 'react'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'
import { Blank, BlankField, BlankFieldType } from 'store/blanks'
import { documentActions } from 'store/document'
import { DocumentFormFields } from './DocumentFormFields'

const dataFields: { [key in BlankFieldType]: any } = {
  text: '',
  date: null,
  group: {},
}
export const fieldData = (field: BlankField) => dataFields[field.type]
const dataFromBlank = (blank: Blank) =>
  Object.fromEntries(blank.fields.map(el => [el.name, el.multiple ? [] : fieldData(el)]))

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
