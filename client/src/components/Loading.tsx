import React from 'react'
import st from 'styles/components/Loading.module.sass'

interface LoadingProps {
  size?: number
}
export const Loading: React.FC<LoadingProps> = ({ size }) => (
  <div className={st.loading}>
    <div className={st.ring} style={size ? { width: `${size}px`, height: `${size}px` } : undefined} />
  </div>
)
