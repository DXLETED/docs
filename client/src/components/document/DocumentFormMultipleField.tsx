import React, { useState } from 'react'
import st from 'styles/components/document/DocumentFormMultipleField.module.sass'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { BlankField } from 'store/blanks'
import { documentActions, DocumentPath, fieldData } from 'store/document'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faPlus } from '@fortawesome/free-solid-svg-icons'
import { DocumentFormField } from './DocumentFormField'
import { ValidationErrors } from 'components/input/ValidationErrors'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'
import { validateMultiple } from 'utils/validate'

interface MultipleFieldsProps {
  label: string
  field: BlankField
  path: DocumentPath
  data: any
}
export const DocumentFormMultipleField: React.FC<MultipleFieldsProps> = ({ label, field, path, data }) => {
  const list = data[field.name]
  const dispatch = useDispatchTyped()
  const showErrors = useSelectorTyped(s => s.document.showErrors)
  const [isEdited, setIsEdited] = useState(false)
  const add = () => {
    dispatch(documentActions.push({ path: [...path, field.name], value: fieldData(field) }))
    !isEdited && setIsEdited(true)
  }
  const remove = (i: number) => {
    dispatch(documentActions.remove({ path: [...path, field.name, i] }))
    !isEdited && setIsEdited(true)
  }
  const { required, errors } = validateMultiple(list, field.validations)
  return (
    <div className={st.multipleFields}>
      <div className={st.head}>
        <div className={st.label}>{label.toUpperCase()}{required && ' *'}</div>
        <div className={st.add} onClick={add}>
          <FontAwesomeIcon className={st.addIcon} icon={faPlus} size="sm" />
          ADD
        </div>
      </div>
      {list.map((el: any, i: number) => (
        <div className={st.field} key={i}>
          <div className={st.remove} onClick={() => remove(i)}>
            <FontAwesomeIcon icon={faEraser} size="sm" />
          </div>
          <DocumentFormField el={field} path={[...path, field.name, i]} data={el} />
        </div>
      ))}
      {!!errors.length && (isEdited || showErrors) && <ValidationErrors errors={errors} visible />}
    </div>
  )
}
