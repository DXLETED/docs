import React, { Fragment } from 'react'
import { useLanguage } from 'hooks/language.hook'
import { BlankFields } from 'store/blanks'
import { DocumentPath } from 'store/documentCreate'
import { DocumentFormField } from './DocumentFormField'
import { DocumentFormMultipleField } from './DocumentFormMultipleField'

interface DocumentFormFieldsProps {
  data: any
  fields: BlankFields
  path?: DocumentPath
}
export const DocumentFormFields: React.FC<DocumentFormFieldsProps> = ({ data, fields, path = [] }) => {
  const lang = useLanguage()
  return (
    <>
      {fields.map(el => (
        <Fragment key={el.id}>
          {el.multiple ? (
            <DocumentFormMultipleField label={el.label?.[lang] as string} field={el} path={path} data={data} />
          ) : (
            <DocumentFormField el={el} label={el.label} path={[...path, el.name]} data={data[el.name]} />
          )}
        </Fragment>
      ))}
    </>
  )
}
