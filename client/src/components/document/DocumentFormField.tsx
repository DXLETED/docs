import { store } from 'store'
import { Input } from 'components/input/Input'
import { DocumentFormGroup } from './DocumentFormGroup'
import { DatePicker } from 'components/input/DatePicker'
import { BlankField, BlankFields, BlankFieldType } from 'store/blanks'
import { documentCreateActions, DocumentPath } from 'store/documentCreate'
import { validate } from 'utils/validate'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'
import { useTranslation } from 'react-i18next'

const update = (path: DocumentPath) => (value: string | number) =>
  store.dispatch(documentCreateActions.update({ path, value }))

const formFields: {
  [key in BlankFieldType]: (
    el: BlankField,
    label: { [key: string]: string } | undefined,
    value: string | number,
    path: DocumentPath,
    lang: string,
    showErrors: boolean
  ) => React.ReactNode
} = {
  text: (el, label, value, path, lang, showErrors) => (
    <Input
    label={label?.[lang]}
      value={value as string}
      set={update(path)}
      {...validate(value as string, el.validations)}
      {...{ showErrors }}
    />
  ),
  date: (el, label, value, path, lang, showErrors) => (
    <DatePicker
      label={label?.[lang]}
      value={value as number}
      set={update(path)}
      {...validate(value?.toString(), el.validations)}
      {...{ showErrors }}
    />
  ),
  group: (el, label, value, path, lang) => (
    <DocumentFormGroup
      label={label?.[lang]}
      data={value}
      fields={el.fields as BlankFields}
      path={path}
      multiple={el.multiple}
    />
  ),
}

interface FieldProps {
  el: BlankField
  label?: { [key: string]: string } | undefined
  path: DocumentPath
  data: any
}
export const DocumentFormField: React.FC<FieldProps> = ({ el, label, path, data }) => {
  const { i18n } = useTranslation()
  const showErrors = useSelectorTyped(s => s.documentCreate.showErrors)
  return <>{formFields[el.type](el, label, data, path, i18n.language, showErrors)}</>
}
