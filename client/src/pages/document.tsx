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
import { getUsers } from 'store/users'
import { requestsStatus } from 'utils/requestsStatus'

const validateField: {
  [key in BlankFieldType]: (data: any, el: BlankField) => boolean
} = {
  text: (data, el) => !!validate(data, el.validations).errors.length,
  date: (data, el) => !!validate(data, el.validations).errors.length,
  group: (data, el) => validateFields(data, el.fields),
}
const validateFields = (data: any, fields: BlankFields | undefined): boolean =>
  !!fields?.some(el =>
    el.multiple
      ? data[el.name].some((d: any) => validateField[el.type](d, el))
      : validateField[el.type](data[el.name], el)
  )

export const DocumentPage: React.FC = () => {
  const dispatch = useDispatchTyped()
  const [blanks, blanksStatus, blanksError] = useRequest(
    s => s.blanks,
    () => getBlanks()
  )
  const [users, usersStatus, usersError] = useRequest(
    s => s.users,
    () => getUsers()
  )
  const status = requestsStatus(blanksStatus, usersStatus)
  const blanksList = blanks.map(b => b.name)
  const blankId = useSelectorTyped(s => s.document.document.blankId)
  const blank = blanks?.find(b => b.id === blankId)
  const showErrors = useSelectorTyped(s => s.document.showErrors)
  const selectedBlank = blanks.findIndex(b => b.id === blankId)
  const document = useSelectorTyped(s => s.document.document)
  const blankSelect = (i: number | null) =>
    dispatch(documentActions.init({ blank: typeof i === 'number' ? blanks[i] : null }))
  const send = () => {
    if (!blank) return
    const hasErrors = validateFields(document.data, blank.fields)
    if (hasErrors) return dispatch(documentActions.showErrors({}))
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
      {status === 'done' &&
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
                  <Input
                    label="Название"
                    value={document.title}
                    set={n => dispatch(documentActions.setTitle(n))}
                    {...validate(document.title, ['required'])}
                    {...{ showErrors }}
                  />
                  <Textarea label="Описание" set={n => dispatch(documentActions.setDescription(n))} />
                </div>
                <div className={st.signers}>
                  {users.map(user => user.username)}
                </div>
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
      {status === 'error' && <Error msg={[blanksError, usersError]} />}
    </>
  )
}
