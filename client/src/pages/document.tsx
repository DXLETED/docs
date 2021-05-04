import React from 'react'
import { FormEditor } from 'components/FormEditor'
import { MainLayout } from 'layouts/MainLayout'
import { useParams } from 'react-router'
import { IBlank } from 'types/blank'

const blank: IBlank = {
  field1: { t: 'field', defaultValue: 'default' },
  fullname: {
    t: 'group',
    groupName: 'Full name',
    els: {
      name: { t: 'field', placeholder: 'Name' },
      lastname: { t: 'field', placeholder: 'Last name' },
      nested: {
        t: 'group',
        groupName: 'Nested group',
        els: {
          field2: { t: 'field' },
        },
      },
    },
  },
}

export const DocumentPage: React.FC = () => {
  const { id } = useParams() as { id: string }
  return (
    <MainLayout title={`Document ${id}`}>
      <FormEditor blank={blank} sendText="Publish" />
    </MainLayout>
  )
}
