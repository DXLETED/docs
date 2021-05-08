import React from 'react'
import st from 'styles/DocumentFormGroup.module.sass'
import { BlankFields } from 'store/blanks'
import { DocumentFormFields } from './DocumentFormFields'
import clsx from 'clsx'

interface DocumentFormGroupProps {
  label?: string
  data: any
  fields: BlankFields
  path?: (string | number)[]
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
