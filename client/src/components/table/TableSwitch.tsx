import React from 'react'
import st from 'styles/components/table/TableSwitch.module.sass'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface TableSwitchProps {
  enabled: boolean
  set: (n: boolean) => void
  label: string
}
export const TableSwitch: React.FC<TableSwitchProps> = ({ enabled, set, label }) => {
  return (
    <div className={st.tableSwitch} onClick={() => set(!enabled)}>
      <div className={st.check}>
        {enabled && <FontAwesomeIcon icon={faCheck} />}
      </div>
      {label}
    </div>
  )
}
