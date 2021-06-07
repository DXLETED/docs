import React from 'react'

interface FormProps {
  onSubmit: React.FormEventHandler
  children: React.ReactNode
}
export const Form: React.FC<FormProps> = ({ onSubmit, children }) => (
  <form
    onSubmit={e => {
      e.preventDefault()
      onSubmit(e)
    }}>
    {children}
    <button type="submit" hidden />
  </form>
)
