import React, { useEffect } from 'react'
import st from 'styles/pages/DocumentCreatePage.module.sass'
import { Select } from 'components/input/Select'
import { useRequest } from 'hooks/request.hook'
import { Helmet } from 'react-helmet'
import { BlankField, BlankFields, BlankFieldType, getBlanks } from 'store/blanks'
import { Loading } from 'components/Loading'
import { Error } from 'components/Error'
import { documentCreateActions, sendDocument } from 'store/documentCreate'
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
import { DocumentSigners } from 'components/document/DocumentSigners'
import { useHistory } from 'react-router'
import { Document } from 'store/document'
import { notify } from 'utils/notify'

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

export const DocumentCreatePage: React.FC = () => {
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
  const blankId = useSelectorTyped(s => s.documentCreate.document.blankId)
  const blank = blanks?.find(b => b.id === blankId)
  const showErrors = useSelectorTyped(s => s.documentCreate.showErrors)
  const selectedBlank = blanks.findIndex(b => b.id === blankId)
  const document = useSelectorTyped(s => s.documentCreate.document)
  const history = useHistory()
  const blankSelect = (i: number | null) =>
    dispatch(documentCreateActions.init({ blank: typeof i === 'number' ? blanks[i] : null }))
  const generate = () => dispatch(documentCreateActions.random(null))
  const send = () => {
    if (!blank) return
    const hasErrors = !document.title || !document.signers.length || validateFields(document.data, blank.fields)
    if (hasErrors) return dispatch(documentCreateActions.showErrors({}))
    dispatch(sendDocument({ blank })).then(res => {
      if (res.meta.requestStatus === 'fulfilled') {
        history.push(`/documents/${(res.payload as Document)._id}`)
        notify.success({ content: 'Документ создан' })
      } else notify.error({ content: (res as any).error.message })
    })
  }
  useEffect(() => {
    return () => {
      dispatch(documentCreateActions.clear({}))
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
                <div className={st.scrollable}>
                  <div className={st.container}>
                    <div className={st.blank}>
                      <Select
                        label="Бланк"
                        selected={selectedBlank !== -1 ? selectedBlank : null}
                        options={blanksList}
                        set={blankSelect}
                        empty
                      />
                    </div>
                    <Input
                      label="Название"
                      value={document.title}
                      set={n => dispatch(documentCreateActions.setTitle(n))}
                      {...validate(document.title, ['required'])}
                      {...{ showErrors }}
                    />
                    <Textarea label="Описание" set={n => dispatch(documentCreateActions.setDescription(n))} />
                    <DocumentSigners users={users} />
                  </div>
                </div>
                <div className={st.buttons}>
                  {process.env.NODE_ENV === 'development' && document.blankId === 1 && (
                    <div className={st.generate} onClick={generate}>
                      Сгенерировать данные
                    </div>
                  )}
                  <div className={st.send} onClick={send}>
                    Создать документ
                  </div>
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
