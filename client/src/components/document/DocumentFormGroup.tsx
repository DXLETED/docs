import React from 'react'
import st from 'styles/components/document/DocumentFormGroup.module.sass'
import clsx from 'clsx'
import { BlankFields } from 'store/blanks'
import { DocumentFormFields } from './DocumentFormFields'
import { DocumentPath } from 'store/document'

interface DocumentFormGroupProps {
  label?: string
  data: any
  fields: BlankFields
  path?: DocumentPath
  multiple?: boolean
}
export const DocumentFormGroup: React.FC<DocumentFormGroupProps> = ({ label, data, fields, path = [], multiple }) => {
  return (
    <div className={clsx(st.group, {[st.multiple]: multiple})}>
      {label && <div className={st.label}>{label.toUpperCase()}</div>}
      <div className={st.inner}><DocumentFormFields {...{ data, fields, path }} /></div>
    </div>
  )
}
