import { isEqual } from 'lodash'
import React, { memo } from 'react'
import st from 'styles/FormGroup.module.sass'
import { IFormData } from 'types'
import { FormElements } from './FormElements'

interface IFormGroup {
  groupName?: string
  els: IFormData
}
export const FormGroup: React.FC<IFormGroup> = memo(({
  groupName,
  els,
  ...props
}) => (
  <div className={st.group} {...props}>
    <div className={st.groupName}>{groupName}</div>
    <FormElements els={els} />
  </div>
), isEqual)
