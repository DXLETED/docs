import React, { useEffect } from 'react'
import st from 'styles/pages/DocumentPage.module.sass'
import { Select } from 'components/input/Select'
import { useRequest } from 'hooks/request.hook'
import { Helmet } from 'react-helmet'
import { BlankField, BlankFields, BlankFieldType, getBlanks } from 'store/blanks'
import { Loading } from 'components/Loading'
import { Error } from 'components/Error'
import { documentActions, sendDocument } from 'store/document'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'
import { DocumentFormFields } from 'components/document/DocumentFormFields'
import { Input } from 'components/input/Input'
import { Textarea } from 'components/input/Textarea'
import { validate } from 'utils/validate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'

const validateField: {
  [key in BlankFieldType]: (data: any, el: BlankField, add: (field: string, errs: string[]) => void) => void
} = {
  text: (data, el, add) => add(el.label, validate(data, el.validations).errors),
  date: (data, el, add) => add(el.label, validate(data, el.validations).errors),
  group: (data, el, add) => validateFields(data, el.fields, add),
}
const validateFields = (
  data: any,
  fields: BlankFields | undefined,
  add: (field: string, errs: string[]) => void
): any =>
  fields?.forEach(el =>
    el.multiple
      ? data[el.name].forEach((d: any) => validateField[el.type](d, el, add))
      : validateField[el.type](data[el.name], el, add)
  )

export const DocumentPage: React.FC = () => {
  const dispatch = useDispatchTyped()
  const [blanks, status, error] = useRequest(
    s => s.blanks,
    () => getBlanks()
  )
  const blanksList = blanks.map(b => b.name)
  const blankId = useSelectorTyped(s => s.document.blankId)
  const blank = blanks?.find(b => b.id === blankId)
  const selectedBlank = blanks.findIndex(b => b.id === blankId)
  const document = useSelectorTyped(s => s.document)
  const blankSelect = (i: number | null) =>
    dispatch(documentActions.init({ blank: typeof i === 'number' ? blanks[i] : null }))
  const send = () => {
    if (!blank) return
    let errors: [string, string[]][] = []
    validateFields(document.data, blank.fields, (field, errs) => (errors = [...errors, [field, errs]]))
    console.log(errors)
    if (errors.length)
      return alert(
        errors
          .filter(([field, errs]) => errs.length)
          .map(([field, errs]) => `${field} - ${errs.join(' | ')}`)
          .join(`\n`)
      )
    dispatch(sendDocument()).then(res =>
      res.meta.requestStatus === 'fulfilled'
        ? alert(`Sended\n${JSON.stringify(document)}`)
        : alert((res as any).error.message)
    )
  }
  useEffect(() => {
    return () => {
      dispatch(documentActions.clear({}))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <Helmet>
        <title>Document - Docs</title>
      </Helmet>
      {status === 'fulfilled' &&
        (blank ? (
          <>
            <div className={st.document}>
              <div className={st.form}>
                <div className={st.inner}>
                  {blank && document && <DocumentFormFields data={document.data} fields={blank.fields} />}
                </div>
              </div>
              <div className={st.side}>
                <div className={st.container}>
                  <Select
                    label="Бланк"
                    selected={selectedBlank !== -1 ? selectedBlank : null}
                    options={blanksList}
                    set={blankSelect}
                    empty
                  />
                  <Input label="Название" value={document.title} set={n => dispatch(documentActions.setTitle(n))} />
                  <Textarea label="Описание" set={n => dispatch(documentActions.setDescription(n))} />
                </div>
                <div className={st.signers} />
                <div className={st.send} onClick={send}>
                  Отправить
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={st.blankSelect}>
            <div className={st.inner}>
              <div className={st.label}>
                <FontAwesomeIcon className={st.icon} icon={faFile} size="lg" />
                Выберите бланк документа
              </div>
              <Select
                selected={selectedBlank !== -1 ? selectedBlank : null}
                options={blanksList}
                set={blankSelect}
                open
              />
            </div>
          </div>
        ))}
      {status === 'loading' && <Loading />}
      {status === 'error' && <Error msg={error} />}
    </>
  )
}
