import React from 'react'
import st from 'styles/components/Page.module.sass'
import clsx from 'clsx'
import { useSelectorTyped } from 'hooks/selectorTyped.hook'

interface PageProps {
  children: React.ReactNode
}
export const Page: React.FC<PageProps> = ({ children }) => {
  const isNavOpen = useSelectorTyped(s => s.switches.nav)
  return <div className={clsx(st.page, { [st.navOpen]: isNavOpen })}>{children}</div>
}
