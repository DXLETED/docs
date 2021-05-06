import { Page } from 'components/Page'
import React from 'react'

interface LoginLayoutProps { children: React.ReactNode }
export const LoginLayout: React.FC<LoginLayoutProps> = ({children}) => <Page>{children}</Page>
