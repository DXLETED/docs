import React, { useEffect, useMemo, useState } from 'react'
import st from 'styles/components/layout/Documents.module.sass'
import moment from 'moment'
import dict from 'dictionary.json'
import { documentsActions, getDocuments, getNextDocuments } from 'store/documents'
import { getUsers } from 'store/users'
import { Table } from 'components/table/Table'
import { useDispatchTyped } from 'hooks/dispatchTyped.hook'
import { useRequest } from 'hooks/request.hook'
import { requestsStatus } from 'utils/requestsStatus'
import { Loading } from 'components/Loading'
import { Error } from 'components/Error'
import { useHistory } from 'react-router'
import { TableFilter } from 'components/table/TableFilter'
import { TableSearch } from 'components/table/TableSearch'
import { TableSwitch } from 'components/table/TableSwitch'

const statusColors: { [key in keyof typeof dict.documentStatus]: string } = {
  IN_PROGRESS: '#cdca1d',
  RESOLVED: '#57D7CA',
  REJECTED: '#CD451D',
  ARCHIVED: '#EDEDED',
}

interface DocumentsProps {
  id: string
  label?: string
  path: string
  head: { [key: string]: string }
  statusFilter?: boolean
  onlyWaitingSwitch?: boolean
}
export const Documents: React.FC<DocumentsProps> = ({
  id,
  label,
  path,
  head,
  statusFilter: statusFilterEnabled,
  onlyWaitingSwitch,
}) => {
  const history = useHistory()
  const [search, setSearch] = useState('')
  const [onlyWaiting, setOnlyWaiting] = useState(true)
  const [statusFilter, setStatusFilter] = useState<{ [el: string]: boolean }>({})
  const dispatch = useDispatchTyped()
  const [documents, documentsStatus, documentsError] = useRequest(
    s => s.documents,
    () => getDocuments({ path, search, statusFilter, onlyWaiting }),
    [search, statusFilter, onlyWaiting]
  )
  const [users, usersStatus, usersError] = useRequest(
    s => s.users,
    () => getUsers()
  )
  const els = useMemo(
    () =>
      documents.list.map(d => ({
        d: {
          _id: d._id,
          id: d._id.slice(-8),
          author: users.find(u => u.userId === d.userId)?.username || d.userId,
          title: d.title,
          status: { d: dict.documentStatus[d.status], color: statusColors[d.status] },
          creationDate: moment(d.createdAt).format(`DD.MM.YYYY`),
          updateDate: d.updatedAt ? moment(d.updatedAt).format(`DD.MM.YYYY`) : '-----',
        },
      })),
    [documents, users]
  )
  const status = requestsStatus(documentsStatus, usersStatus)
  useEffect(
    () => () => {
      dispatch(documentsActions.reset())
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const load = () => dispatch(getNextDocuments({ path, search, statusFilter, onlyWaiting }))
  return (
    <div className={st.table}>
      {status === 'done' && (
        <Table
          {...{ id, label, head, els, load }}
          menu={
            <>
              {onlyWaitingSwitch && (
                <TableSwitch enabled={onlyWaiting} set={setOnlyWaiting} label="Только документы, ожидающие решение" />
              )}
              {statusFilterEnabled && (
                <TableFilter label="Статус" options={dict.documentStatus} filter={statusFilter} set={setStatusFilter} />
              )}
              <TableSearch value={search} set={setSearch} />
            </>
          }
          link={el => history.push(`/documents/${el._id}`)}
        />
      )}
      {status === 'loading' && <Loading />}
      {status === 'error' && <Error msg={[documentsError, usersError]} />}
    </div>
  )
}
