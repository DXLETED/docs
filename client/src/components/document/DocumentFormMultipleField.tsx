import { useDispatchTyped } from "hooks/dispatchTyped.hook"
import React from "react"
import st from 'styles/DocumentFormFields.module.sass'
import { BlankField } from "store/blanks"
import { documentActions } from "store/document"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { fieldData } from "./DocumentForm"
import { DocumentFormField } from "./DocumentFormField"

interface MultipleFieldsProps {
  label: string
  field: BlankField
  path: (string | number)[]
  data: any
}
export const DocumentFormMultipleField: React.FC<MultipleFieldsProps> = ({ label, field, path, data }) => {
  const list = data[field.name]
  const dispatch = useDispatchTyped()
  return (
    <div className={st.multipleFields}>
      <div className={st.head}>
        <div className={st.label}>{label.toUpperCase()}</div>
        <div
          className={st.add}
          onClick={() => dispatch(documentActions.push({ path: [...path, field.name], value: fieldData(field) }))}>
          <FontAwesomeIcon className={st.addIcon} icon={faPlus} size="sm" />
          ADD
        </div>
      </div>
      {list.map((el: any, i: number) => (
        <div className={st.field} key={i}>
          <div
            className={st.remove}
            onClick={() => dispatch(documentActions.remove({ path: [...path, field.name, i] }))}>
            <FontAwesomeIcon icon={faTrash} size="sm" />
          </div>
          <DocumentFormField el={field} path={[...path, field.name, i]} data={el} />
        </div>
      ))}
    </div>
  )
}