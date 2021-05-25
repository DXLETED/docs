import React, { Fragment } from 'react'
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
  return (
    <>
      {fields.map(el => (
        <Fragment key={el.id}>
          {el.multiple ? (
            <DocumentFormMultipleField label={el.label} field={el} path={path} data={data} />
          ) : (
            <DocumentFormField el={el} label={el.label} path={[...path, el.name]} data={data[el.name]} />
          )}
        </Fragment>
      ))}
    </>
  )
}
