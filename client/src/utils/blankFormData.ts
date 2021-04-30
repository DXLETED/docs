import { IFormData, IFormDataEl, IBlank, IBlankEl } from 'types'

export const blankFormData = (
  blank: IBlank,
  update: (path: string[], val: string) => void,
  path: string[] = []
): IFormData => {
  const els = {
    field: (key: string, el: IBlankEl): IFormDataEl => ({
      ...el,
      value: el.defaultValue || '',
      set: (val) => update([...path, key], val),
    }),
    group: (key: string, el: IBlankEl): IFormDataEl => ({
      t: el.t,
      groupName: el.groupName,
      els: blankFormData(el.els || {}, update, [...path, key, 'els']),
    }),
  }
  return Object.fromEntries(
    Object.entries(blank).map(([key, el]: [string, IBlankEl]) => [
      key,
      els[el.t](key, el),
    ])
  )
}
