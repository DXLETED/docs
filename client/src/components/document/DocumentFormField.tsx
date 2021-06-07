import { store } from 'store'
import { Input } from 'components/input/Input'
import { DocumentFormGroup } from './DocumentFormGroup'
import { DatePicker } from 'components/input/DatePicker'
import { BlankField, BlankFields, BlankFieldType } from 'store/blanks'
import { documentCreateActions, DocumentPath } from 'store/documentCreate'
import { validate } from 'utils/validate'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'

const update = (path: DocumentPath) => (value: string | number) =>
  store.dispatch(documentCreateActions.update({ path, value }))

const formFields: {
  [key in BlankFieldType]: (
    el: BlankField,
    label: string | undefined,
    value: string | number,
    path: DocumentPath,
    showErrors: boolean
  ) => React.ReactNode
} = {
  text: (el, label, value, path, showErrors) => (
    <Input
      label={label}
      value={value as string}
      set={update(path)}
      {...validate(value as string, el.validations)}
      {...{ showErrors }}
    />
  ),
  date: (el, label, value, path, showErrors) => (
    <DatePicker
      label={label}
      value={value as number}
      set={update(path)}
      {...validate(value?.toString(), el.validations)}
      {...{ showErrors }}
    />
  ),
  group: (el, label, value, path) => (
    <DocumentFormGroup
      label={label}
      data={value}
      fields={el.fields as BlankFields}
      path={path}
      multiple={el.multiple}
    />
  ),
}

interface FieldProps {
  el: BlankField
  label?: string
  path: DocumentPath
  data: any
}
export const DocumentFormField: React.FC<FieldProps> = ({ el, label, path, data }) => {
  const showErrors = useSelectorTyped(s => s.documentCreate.showErrors)
  return <>{formFields[el.type](el, label, data, path, showErrors)}</>
}
