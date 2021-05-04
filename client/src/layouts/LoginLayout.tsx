import { Page } from 'components/Page'
import React from 'react'

interface ILoginLayout { children: React.ReactNode }
export const LoginLayout: React.FC<ILoginLayout> = ({children}) => <Page>{children}</Page>
