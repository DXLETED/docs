import { FormDatePicker } from 'components/form/FormDatePicker'
import { FormInput } from 'components/form/FormInput'
import { store } from 'store'
import { BlankField, BlankFields, BlankFieldType } from 'store/blanks'
import { documentActions } from 'store/document'
import { validate } from 'utils/validate'
import { DocumentFormGroup } from './DocumentFormGroup'

const update = (path: (string | number)[]) => (value: string | number) =>
  store.dispatch(documentActions.update({ path, value }))

const formFields: {
  [key in BlankFieldType]: (
    el: BlankField,
    label: string | undefined,
    value: string | number,
    path: (string | number)[]
  ) => React.ReactNode
} = {
  text: (el, label, value, path) => (
    <FormInput
      label={label}
      value={value as string}
      set={update(path)}
      errors={validate(value as string, el.validations)}
    />
  ),
  date: (el, label, value, path) => (
    <FormDatePicker
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
  path: (string | number)[]
  data: any
}
export const DocumentFormField: React.FC<FieldProps> = ({ el, label, path, data }) => (
  <>{formFields[el.type](el, label, data, path)}</>
)
