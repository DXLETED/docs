export type Validation = 'required' | 'notContainWhiteSpaces' | 'email' | 'phone' | 'notContainNumbers'
export type Validations = Validation[]

const validateDict: { [key in Validation]: (val?: string) => string | false | null } = {
  required: val => !val && 'Required',
  notContainWhiteSpaces: val => !!val && !!val.match(/\s/g) && 'The field must not contain whitespaces',
  email: val =>
    !!val &&
    !val.match(
      /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm
    ) &&
    'The field must contain email',
  phone: val =>
    !!val && !val.match(/^\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})$/) && 'The field must contain a phone number',
  notContainNumbers: val => !!val && !val?.match(/^([^0-9]*)$/) && 'The field must not contain numbers',
}

export const validate = (value?: string, validations?: Validations): string[] =>
  validations?.map(v => validateDict[v](value)).filter(Boolean) as string[]
