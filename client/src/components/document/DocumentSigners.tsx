import React, { useState } from 'react'
import st from 'styles/components/document/DocumentSigners.module.sass'
import { documentActions } from 'store/document'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from 'components/Modal'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { faCheck, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from 'hooks/auth.hook'

interface DocumentSignersProps {
  users: { userId: string; username: string }[]
}
export const DocumentSigners: React.FC<DocumentSignersProps> = ({ users }) => {
  const dispatch = useDispatchTyped()
  const signers = useSelectorTyped(s => s.document.document.signers)
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const move = (result: DropResult): any =>
    result.destination &&
    dispatch(documentActions.moveSigner({ prev: result.source.index, new: result.destination.index }))
  return (
    <div className={st.signers}>
      <div className={st.label}>Подписанты</div>
      <DragDropContext onDragEnd={move}>
        <Droppable droppableId="signers">
          {provided => (
            <>
              <div {...provided.droppableProps} ref={provided.innerRef} className={st.inner}>
                {signers.map((userId, i) => (
                  <Draggable draggableId={userId} index={i} key={userId}>
                    {provided => (
                      <div
                        className={st.signer}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        key={userId}>
                        {users.find(u => u.userId === userId)?.username}
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
              {provided.placeholder}
            </>
          )}
        </Droppable>
      </DragDropContext>
      <div className={st.add} onClick={() => setIsModalOpen(true)}>
        <FontAwesomeIcon className={st.addIcon} icon={faUserEdit} size="sm" />
        Выбрать
      </div>
      <Modal title="Пользователи" isOpen={isModalOpen} close={() => setIsModalOpen(false)}>
        <div className={st.users}>
          {users
            .filter(u => u.userId !== user?.userId)
            .map(u => (
              <div
                className={st.user}
                onClick={() =>
                  dispatch(
                    signers.find(s => s === u.userId)
                      ? documentActions.delSigner({ userId: u.userId })
                      : documentActions.addSigner({ userId: u.userId })
                  )
                }
                key={`${u.userId}`}>
                <div className={st.check}>
                  {signers.find(s => s === u.userId) && (
                    <FontAwesomeIcon className={st.checkIcon} icon={faCheck} size="sm" />
                  )}
                </div>
                {u.username}
              </div>
            ))}
        </div>
      </Modal>
    </div>
  )
}
