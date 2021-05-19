import React, { useRef, useState } from 'react'
import st from 'styles/components/document/DocumentSigners.module.sass'
import { documentActions } from 'store/document'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from 'components/Modal'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { faCheck, faChevronDown, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from 'hooks/auth.hook'
import clsx from 'clsx'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'

const UsersSelect: React.FC = () => {
  const ref = useRef<HTMLDivElement | any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatchTyped()
  const signers = useSelectorTyped(s => s.document.document.signers)
  const { user } = useAuth()
  const users = useSelectorTyped(s => s.users)
  useOnClickOutside<HTMLDivElement>(ref, () => isOpen && setIsOpen(false))
  const add = (userId: string) => {
    dispatch(documentActions.addSigner({ userId }))
    setIsOpen(false)
  }
  return (
    <div className={clsx(st.usersSelect, { [st.open]: isOpen })} onClick={() => setIsOpen(true)} ref={ref}>
      <div className={st.label}>Добавить пользователя</div>
      <FontAwesomeIcon className={st.arrow} icon={faChevronDown} />
      <div className={st.dropdown}>
        {users
          .filter(u => u.userId !== user?.userId && !signers.includes(u.userId))
          .map((user, i) => (
            <div className={st.el} onClick={() => add(user.userId)} key={user.userId}>
              {user.username}
            </div>
          ))}
      </div>
    </div>
  )
}

interface DocumentSignersProps {
  users: { userId: string; username: string }[]
}
export const DocumentSigners: React.FC<DocumentSignersProps> = ({ users }) => {
  const dispatch = useDispatchTyped()
  const signers = useSelectorTyped(s => s.document.document.signers)
  const move = (result: DropResult): any =>
    result.destination &&
    dispatch(documentActions.moveSigner({ prev: result.source.index, new: result.destination.index }))
  const remove = (userId: string) => dispatch(documentActions.delSigner({ userId }))
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
                      <div className={st.signer} ref={provided.innerRef} {...provided.draggableProps} key={userId}>
                        <div className={st.username} {...provided.dragHandleProps}>
                          {users.find(u => u.userId === userId)?.username}
                        </div>
                        <div className={st.remove} onClick={() => remove(userId)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </div>
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
      <UsersSelect />
    </div>
  )
}
