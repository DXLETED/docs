export enum FormDataElTypes {
  field = 'field',
  group = 'group',
}
export interface IFormDataEl {
  t: keyof typeof FormDataElTypes
  value?: string
  set?: (value: string) => void
  els?: IFormData
  groupName?: string
  placeholder?: string
  validate?: Array<[RegExp, string]>
  required?: boolean
}
export interface IFormData {
  [propName: string]: IFormDataEl
}
