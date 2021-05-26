import React, { useState } from 'react'
import st from 'styles/pages/DocumentPage.module.sass'
import moment from 'moment'
import dict from 'dictionary.json'
import clsx from 'clsx'
import { useRequest } from 'hooks/request.hook'
import { useParams } from 'react-router'
import { archiveDocument, documentActions, getDocument, getPDF, rejectDocument, resolveDocument } from 'store/document'
import { requestsStatus } from 'utils/requestsStatus'
import { Loading } from 'components/Loading'
import { Error } from 'components/Error'
import { Helmet } from 'react-helmet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faCheck, faEdit, faFilePdf, faUser } from '@fortawesome/free-solid-svg-icons'
import { getUsers } from 'store/users'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { saveAs } from 'file-saver'
import { useAuth } from 'hooks/auth.hook'
import { Modal } from 'components/Modal'
import { useForm } from 'hooks/form.hook'
import { Input } from 'components/input/Input'
import { FormContainer } from 'components/form/FormContainer'
import { FormSubmit } from 'components/form/FormSubmit'
import { Textarea } from 'components/input/Textarea'

interface SignModalProps {
  close: () => void
}
const SignModal: React.FC<SignModalProps> = ({ close }) => {
  const dispatch = useDispatchTyped()
  const [formData, update] = useForm({ password: '' })
  const onSubmit = () =>
    dispatch(resolveDocument(formData)).then(res => {
      res.meta.requestStatus === 'fulfilled'
        ? dispatch(documentActions.set(res.payload))
        : alert((res as any).error.message)
      close()
    })
  return (
    <div className={st.signModal}>
      <FormContainer>
        <Input value={formData.password} label="Пароль" type="password" set={update('password')} />
        <FormSubmit sendText="Подписать" onSubmit={onSubmit} />
      </FormContainer>
    </div>
  )
}

interface RejectModalProps {
  close: () => void
}
const RejectModal: React.FC<RejectModalProps> = ({ close }) => {
  const dispatch = useDispatchTyped()
  const [formData, update] = useForm({ rejectReason: '', password: '' })
  const onSubmit = () =>
    dispatch(rejectDocument(formData)).then(res => {
      res.meta.requestStatus === 'fulfilled'
        ? dispatch(documentActions.set(res.payload))
        : alert((res as any).error.message)
      close()
    })
  return (
    <div className={st.rejectModal}>
      <FormContainer>
        <Input
          value={formData.password}
          autoComplete="new-password"
          label="Пароль"
          type="password"
          set={update('password')}
        />
        <Textarea value={formData.rejectReason} label="Причина" set={update('rejectReason')} />
        <FormSubmit sendText="Отклонить" onSubmit={onSubmit} />
      </FormContainer>
    </div>
  )
}

export const DocumentPage: React.FC = () => {
  const dispatch = useDispatchTyped()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [isSignModalOpen, setIsSignModalOpen] = useState<boolean>(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false)
  const [doc, documentStatus, documentError] = useRequest(
    s => s.document,
    () => getDocument({ id })
  )
  const [users, usersStatus, usersError] = useRequest(
    s => s.users,
    () => getUsers()
  )
  const status = requestsStatus(documentStatus, usersStatus)
  const pdf = async () => {
    const res = await dispatch(getPDF())
    res.meta.requestStatus === 'fulfilled'
      ? saveAs(new Blob([(res.payload as { file: BlobPart }).file], { type: 'application/pdf' }), doc?.title)
      : alert((res as any).error.message)
  }
  const currentSigner = doc?.signers.find(
    (s, i, signers) => s.status === 'WAITING' && !signers.slice(0, i).some(s => s.status === 'WAITING')
  )
  const archive = () =>
    dispatch(archiveDocument()).then(res =>
      res.meta.requestStatus === 'fulfilled'
        ? dispatch(documentActions.set(res.payload))
        : alert((res as any).error.message)
    )
  return (
    <>
      <Helmet>
        <title>{doc?.title || id} - Docs</title>
      </Helmet>
      {status === 'done' && doc && users && (
        <div className={st.container}>
          <div className={st.document}>
            <div className={st.head}>
              <span className={st.title}>{doc.title}</span>
              <div className={st.d}>
                <span>
                  <FontAwesomeIcon className={st.icon} icon={faUser} size="sm" />
                  {users.find(u => u.userId === doc.userId)?.username}
                </span>
                <span>
                  <FontAwesomeIcon className={st.icon} icon={faCalendarPlus} size="sm" />
                  {moment(doc.createdAt).format('DD.MM.YYYY')}
                </span>
                {!!doc.updatedAt && (
                  <span className={st.updatedAt}>
                    <FontAwesomeIcon className={st.icon} icon={faEdit} size="sm" />
                    {moment(doc.updatedAt).format('DD.MM.YYYY')}
                  </span>
                )}
                <div className={st.pdf} onClick={pdf}>
                  <FontAwesomeIcon className={st.icon} icon={faFilePdf} />
                  PDF
                </div>
              </div>
            </div>
            <div className={st.content} id="content" dangerouslySetInnerHTML={{ __html: doc.rawDocument }} />
          </div>
          <div className={st.side}>
            <div className={st.docstatus}>
              <span>Статус</span>
              {dict.documentStatus[doc.status]}
            </div>
            <div className={st.signers}>
              <div className={st.label}>Подписанты</div>
              <div className={st.inner}>
                {doc.signers.map((s, i) => (
                  <div
                    className={clsx(st.signer, st[s.status], { [st.current]: s === currentSigner })}
                    key={s.userId + i}>
                    <div className={st.username}>{users.find(u => u.userId === s.userId)?.username}</div>
                    <div className={st.d}>
                      <span>{dict.signerStatus[s.status]}</span>
                      {!!s.updatedAt && <span>{moment(s.updatedAt).format('YYYY-MM-DD HH:mm')}</span>}
                    </div>
                    {s.status === 'REJECTED' && (
                      <div className={st.rejectReason}>{s.rejectReason || 'Причина не указана'}</div>
                    )}
                    {s.status === 'RESOLVED' && <FontAwesomeIcon className={st.resolved} icon={faCheck} />}
                  </div>
                ))}
              </div>
            </div>
            {currentSigner?.userId === user?.userId && (
              <>
                <div className={st.sign} onClick={() => setIsSignModalOpen(true)}>
                  Подписать
                </div>
                <div className={st.reject} onClick={() => setIsRejectModalOpen(true)}>
                  Отклонить
                </div>
              </>
            )}
            {doc.signers.every(s => s.status !== 'WAITING') && doc.status !== 'ARCHIVED' && (
              <div className={st.archive} onClick={archive}>
                Архивировать
              </div>
            )}
          </div>
        </div>
      )}
      {status === 'loading' && <Loading />}
      {status === 'error' && <Error msg={[documentError, usersError]} />}
      <Modal isOpen={isSignModalOpen} close={() => setIsSignModalOpen(false)}>
        <SignModal close={() => setIsSignModalOpen(false)} />
      </Modal>
      <Modal isOpen={isRejectModalOpen} close={() => setIsRejectModalOpen(false)}>
        <RejectModal close={() => setIsRejectModalOpen(false)} />
      </Modal>
    </>
  )
}
