import React from 'react'
import st from 'styles/components/Switch.module.sass'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface SwitchProps {
  enabled: boolean
  set: (n: boolean) => void
  label: string
}
export const Switch: React.FC<SwitchProps> = ({ enabled, set, label }) => (
  <div className={st.switch} onClick={() => set(!enabled)}>
    <div className={st.check}>{enabled && <FontAwesomeIcon icon={faCheck} />}</div>
    {label}
  </div>
)
