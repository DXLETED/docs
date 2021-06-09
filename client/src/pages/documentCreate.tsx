import React, { useEffect, useState } from 'react'
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
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
  const [isSaving, setIsSaving] = useState(false)
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
    setIsSaving(true)
    dispatch(sendDocument({ blank })).then(res => {
      res.meta.requestStatus === 'fulfilled'
        ? history.push(`/documents/${(res.payload as Document)._id}`)
        : setIsSaving(false)
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
              <div className={clsx(st.form, { disabled: isSaving })}>
                <div className={st.inner}>
                  {blank && document && <DocumentFormFields data={document.data} fields={blank.fields} />}
                </div>
              </div>
              <div className={st.side}>
                <div className={clsx(st.scrollable, { disabled: isSaving })}>
                  <div className={st.container}>
                    <div className={st.blank}>
                      <Select
                        label={t('document.blank')}
                        selected={selectedBlank !== -1 ? selectedBlank : null}
                        options={blanksList}
                        set={blankSelect}
                        empty
                      />
                    </div>
                    <Input
                      label={t('document.title')}
                      value={document.title}
                      set={n => dispatch(documentCreateActions.setTitle(n))}
                      {...validate(document.title, ['required'])}
                      {...{ showErrors }}
                    />
                    <Textarea label={t('document.description')} set={n => dispatch(documentCreateActions.setDescription(n))} />
                    <DocumentSigners users={users} />
                  </div>
                </div>
                <div className={st.buttons}>
                  {/* process.env.NODE_ENV === 'development' && */!isSaving && (
                    <div className={st.generate} onClick={generate}>
                      {t('document.generateData')}
                    </div>
                  )}
                  <div className={st.send} onClick={send}>
                    {isSaving ? (
                      <>
                        <div className={st.loading}>
                          <Loading size={10} />
                        </div>
                        {t('document.createLoading')}
                      </>
                    ) : (
                      t('document.create')
                    )}
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
                {t('document.selectBlank')}
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
