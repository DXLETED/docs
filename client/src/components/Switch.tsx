import React from 'react'
import st from 'styles/components/Switch.module.sass'
import { faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface SwitchProps {
  enabled: boolean
  set: (n: boolean) => void
  label: string
  loading?: boolean
}
export const Switch: React.FC<SwitchProps> = ({ enabled, set, label, loading }) => (
  <div className={st.switch} onClick={() => set(!enabled)}>
    <div className={st.check}>
      {loading ? <FontAwesomeIcon className={st.loading} icon={faSpinner} /> : enabled && <FontAwesomeIcon icon={faCheck} />}
    </div>
    {label}
  </div>
)
