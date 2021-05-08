import React from 'react'
import st from 'styles/DocumentFormGroup.module.sass'
import { BlankFields } from 'store/blanks'
import { DocumentFormFields } from './DocumentFormFields'

interface DocumentFormGroupProps {
  label?: string
  data: any
  fields: BlankFields
  path?: string
}
export const DocumentFormGroup: React.FC<DocumentFormGroupProps> = ({ label, data, fields, path }) => {
  return (
    <div className={st.group}>
      {label && <div className={st.label}>{label.toUpperCase()}</div>}
      <div className={st.inner}><DocumentFormFields {...{ data, fields, path }} /></div>
    </div>
  )
}
