import React from 'react'
import st from 'styles/components/Error.module.sass'

interface ErrorProps {
  msg: React.ReactNode
}
export const Error: React.FC<ErrorProps> = ({ msg }) => {
  return (
    <div className={st.error}>
      {Array.isArray(msg) ? (
        msg
          .filter(Boolean)
          .slice(0, 1)
          .map((m, i) => (
            <div className={st.msg} key={`${m}${i}`}>
              {m}
            </div>
          ))
      ) : (
        <div className={st.msg}>{msg}</div>
      )}
    </div>
  )
}
