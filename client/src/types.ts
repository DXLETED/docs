export enum BlankElTypes {
  field = 'field',
  group = 'group',
}
export interface IBlankEl {
  t: BlankElTypes
  defaultValue?: string
  els?: IBlank,
  groupName?: string,
  placeholder?: string,
  validate?: Array<[string, RegExp]>
}
export interface IBlank {
  [propName: string]: IBlankEl
}
export interface IFormDataEl {
  t: BlankElTypes
  value?: string
  set?: (value: string) => void
  els?: IFormData,
  groupName?: string,
  placeholder?: string,
  validate?: Array<[string, RegExp]>
}
export interface IFormData {
  [propName: string]: IFormDataEl
}
