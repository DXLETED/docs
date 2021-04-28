import st from './Placeholder.sass'
import React from 'react'

interface IPlaceholder { children: React.ReactNode }
export const Placeholder: React.FC<IPlaceholder> = ({children}: IPlaceholder) => <div className={st.placeholder}>{children}</div>