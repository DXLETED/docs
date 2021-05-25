import React, { useRef, useState } from 'react'
import st from 'styles/components/document/DocumentSigners.module.sass'
import clsx from 'clsx'
import { documentCreateActions } from 'store/documentCreate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'
import { DragDropContext, Draggable, DraggableProvided, Droppable, DropResult } from 'react-beautiful-dnd'
import { faChevronDown, faPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from 'hooks/auth.hook'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'
import { validateMultiple } from 'utils/validate'
import { ValidationErrors } from 'components/input/ValidationErrors'

const UsersSelect: React.FC = () => {
  const ref = useRef<HTMLDivElement | any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const dispatch = useDispatchTyped()
  const signers = useSelectorTyped(s => s.documentCreate.document.signers)
  const { user } = useAuth()
  const users = useSelectorTyped(s => s.users)
  useOnClickOutside<HTMLDivElement>(ref, () => isOpen && setIsOpen(false))
  const select = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation()
    setSelected(userId)
    setIsOpen(false)
  }
  const add = () => {
    dispatch(documentCreateActions.addSigner({ userId: selected }))
    setSelected(null)
  }
  return (
    <div className={st.usersSelect}>
      <div className={clsx(st.select, { [st.open]: isOpen })} onClick={() => setIsOpen(true)} ref={ref}>
        <div className={st.label}>
          {selected ? users.find(u => u.userId === selected)?.username : 'Выбрать пользователя'}
        </div>
        <FontAwesomeIcon className={st.arrow} icon={faChevronDown} />
        <div className={st.dropdown}>
          {users
            .filter(u => u.userId !== user?.userId && !signers.includes(u.userId))
            .map((user, i) => (
              <div className={st.el} onClick={(e: React.MouseEvent) => select(e, user.userId)} key={user.userId}>
                {user.username}
              </div>
            ))}
        </div>
      </div>
      <div className={clsx(st.add, { disabled: !selected })} onClick={add}>
        <FontAwesomeIcon icon={faPlus} />
      </div>
    </div>
  )
}

interface DocumentSignersProps {
  users: { userId: string; username: string }[]
}
export const DocumentSigners: React.FC<DocumentSignersProps> = ({ users }) => {
  const dispatch = useDispatchTyped()
  const signers = useSelectorTyped(s => s.documentCreate.document.signers)
  const showErrors = useSelectorTyped(s => s.documentCreate.showErrors)
  const { errors } = validateMultiple(signers, ['required'])
  const move = (result: DropResult): any =>
    result.destination &&
    dispatch(documentCreateActions.moveSigner({ prev: result.source.index, new: result.destination.index }))
  const remove = (userId: string) => dispatch(documentCreateActions.delSigner({ userId }))
  const renderDraggable = (userId: string, i: number) => (
    <Draggable draggableId={userId} index={i} key={userId}>
      {(provided: DraggableProvided) => (
        <div className={st.signer} ref={provided.innerRef} {...provided.draggableProps} key={userId}>
          <div className={st.username} {...provided.dragHandleProps}>
            {users.find(u => u.userId === userId)?.username}
          </div>
          <div className={st.remove} onClick={() => remove(userId)}>
            <FontAwesomeIcon icon={faUserMinus} size="sm" />
          </div>
        </div>
      )}
    </Draggable>
  )
  return (
    <div className={st.signers}>
      <div className={st.label}>Подписанты</div>
      <DragDropContext onDragEnd={move}>
        <Droppable droppableId="signers">
          {provided => (
            <>
              <div {...provided.droppableProps} ref={provided.innerRef} className={st.inner}>
                {signers.map((userId, i) => renderDraggable(userId, i))}
              </div>
              {provided.placeholder}
            </>
          )}
        </Droppable>
      </DragDropContext>
      <UsersSelect />
      {!!errors.length && showErrors && <ValidationErrors errors={errors} visible />}
    </div>
  )
}
