import { FormDatePicker } from 'components/form/FormDatePicker'
import { FormInput } from 'components/form/FormInput'
import React, { Fragment } from 'react'
import { store } from 'store'
import { BlankField, BlankFields, BlankFieldType } from 'store/blanks'
import { documentActions } from 'store/document'
import { DocumentFormGroup } from './DocumentFormGroup'

const update = (path: string, field: number) => (value: string | number) =>
  store.dispatch(documentActions.update({ path, field, value }))

const formElements: {
  [key in BlankFieldType]: (el: BlankField, value: string | number, path: string) => React.ReactNode
} = {
  text: (el, value, path) => <FormInput label={el.label} value={value as string} set={update(path, el.id)} />,
  date: (el, value, path) => <FormDatePicker label={el.label} value={value as number} set={update(path, el.id)} />,
  group: (el, value, path) => (
    <DocumentFormGroup label={el.label} data={value} fields={el.fields as BlankFields} path={el.name} />
  ),
}

// interface MultipleFieldsProps {}
// const MultipleFields: React.FC<MultipleFieldsProps> = ({}) => <></>

interface DocumentFormFieldsProps {
  data: any
  fields: BlankFields
  path?: string
}
export const DocumentFormFields: React.FC<DocumentFormFieldsProps> = ({ data, fields, path = '' }) => {
  return (
    <>
      {fields.map(el => (
        <Fragment key={el.id}>{formElements[el.type](el, data[el.type === 'group' ? el.name : el.id], path)}</Fragment>
      ))}
    </>
  )
}
