export enum BlankElTypes {
  field = 'field',
  group = 'group',
}
export interface IBlankEl {
  t: keyof typeof BlankElTypes
  defaultValue?: string
  els?: IBlank
  groupName?: string
  placeholder?: string
  validate?: Array<[RegExp, string]>
  required?: boolean
}
export interface IBlank {
  [propName: string]: IBlankEl
}
