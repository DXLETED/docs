import React from 'react'
import { MainLayout } from 'layouts/MainLayout'
import { useParams } from 'react-router'

export const DocumentPage: React.FC = () => {
  const { id } = useParams() as { id: string }
  return (
    <MainLayout title={`Document ${id}`}>
    </MainLayout>
  )
}
