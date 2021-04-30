import React from 'react'
import { Page } from 'components/Page'
import { Signers } from 'components/Signers'
import { IBlank, BlankElTypes } from 'types'
import { FormEditor } from 'components/FormEditor'

const blank: IBlank = {
  field1: { t: BlankElTypes.field, defaultValue: 'default' },
  fullname: {
    t: BlankElTypes.group,
    groupName: 'Full name',
    els: {
      name: { t: BlankElTypes.field, placeholder: 'Name' },
      lastname: { t: BlankElTypes.field, placeholder: 'Last name' },
      nested: {
        t: BlankElTypes.group,
        groupName: 'Nested group',
        els: {
          field2: { t: BlankElTypes.field },
        },
      },
    },
  },
}

export const DocumentPage: React.FC = () => {
  return (
    <Page>
      <FormEditor blank={blank} sendText="Publish" />
      <Signers
        list={[
          { name: 'Name Patronymic Surname', position: 'Head of compotech' },
          { name: 'Name Patronymic Surname', position: 'Head of compotech' },
          { name: 'Name Patronymic Surname', position: 'Head of compotech' },
        ]}
      />
    </Page>
  )
}
