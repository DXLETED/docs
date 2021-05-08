import { store } from 'store'
import { Input } from 'components/Input'
import { DocumentFormGroup } from './DocumentFormGroup'
import { DatePicker } from 'components/DatePicker'
import { BlankField, BlankFields, BlankFieldType } from 'store/blanks'
import { documentActions, DocumentPath } from 'store/document'
import { validate } from 'utils/validate'

const update = (path: DocumentPath) => (value: string | number) =>
  store.dispatch(documentActions.update({ path, value }))

const formFields: {
  [key in BlankFieldType]: (
    el: BlankField,
    label: string | undefined,
    value: string | number,
    path: DocumentPath
  ) => React.ReactNode
} = {
  text: (el, label, value, path) => (
    <Input
      label={label}
      value={value as string}
      set={update(path)}
      errors={validate(value as string, el.validations)}
    />
  ),
  date: (el, label, value, path) => (
    <DatePicker
      label={label}
      value={value as number}
      set={update(path)}
      errors={validate(value?.toString(), el.validations)}
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
export const DocumentFormField: React.FC<FieldProps> = ({ el, label, path, data }) => (
  <>{formFields[el.type](el, label, data, path)}</>
)
